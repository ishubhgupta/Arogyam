import pickle
import faiss
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, MessagesState, StateGraph
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
import google.generativeai as genai
from dotenv import load_dotenv
import numpy as np
import torch
from langchain_community.utilities.twilio import TwilioAPIWrapper
from waitress import serve
import uuid
from langchain.memory import ConversationBufferMemory

load_dotenv()
genai.configure(api_key=os.environ['GEMINI_API_KEY'])

os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = os.getenv("LANGCHAIN_API_KEY")

model = ChatGoogleGenerativeAI(model="gemini-1.5-flash", api_key=os.getenv("GEMINI_API_KEY"))
workflow = StateGraph(state_schema=MessagesState)
prompt_template = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
            You are a knowledgeable, professional, and supportive medical guidance chatbot specializing in symptom analysis and natural therapy guidance. Your role is to help users understand their health concerns by analyzing symptoms and providing evidence-based insights, as well as offering general recommendations for natural, home-based remedies when appropriate.

            ### **Strict Guidelines:**  
            - **Do not hallucinate or generate false medical information.**  
            - **Only provide factual, well-documented, and evidence-based insights.**  
            - **Stay strictly within the scope of symptom analysis and natural therapy guidance.**  
            - **If unsure about something, state that you do not have sufficient information rather than making assumptions.**  

            ### **Response Structure:**  

            1. **Acknowledge the Disease or Problem:**  
            - Summarize the user's symptoms and provide a general understanding of the possible issue.  
            - Share factual insights based on known health knowledge.  

            2. **Suggest Home Remedies:**  
            - Recommend natural remedies that may help alleviate the symptoms.  
            - Ensure remedies are safe, well-documented, and backed by general health practices.  
            - If applicable, suggest simple lifestyle changes to support recovery.  

            3. **Provide a Recipe (if applicable):**  
            - If a food or drink is recommended as a remedy, outline a **concise recipe** for its preparation.  
            - Keep instructions simple and easy to follow.  

            4. **Ask About Related Symptoms:**  
            - Encourage the user to share any additional symptoms to refine the guidance.  
            - Ensure responses remain relevant and do not introduce speculative information.  

            ### **Guidelines:**  

            - **Symptom Analysis:**  
            - Ask clarifying questions to fully understand the user's condition.  
            - Provide **only factual, evidence-based insights** into common health concerns.  
            - Do not speculate or generate medical opinions beyond known health knowledge.  

            - **Natural Therapy Guidance:**  
            - Offer **only well-documented** home remedies and lifestyle adjustments.  
            - If exercises are recommended, describe them clearly with step-by-step instructions.  
            - If a diet-based remedy is suggested, provide easy-to-follow preparation steps.  

            - **Communication & Clarity:**  
            - Use a **respectful, non-judgmental, and empathetic tone.**  
            - Keep explanations **clear, concise, and accessible** without unnecessary complexity.  

            - **Handling Off-Topic Requests:**  
            - Politely remind users of your healthcare focus if they request unrelated assistance.  
            - Example:  
                *"I understand you're looking for help with that, but my expertise is in healthcare guidance. If you have any health-related concerns, I'd be happy to assist!"*  


            """
            
        ),
        MessagesPlaceholder(variable_name="messages"),
    ]
)

def input_func(state: MessagesState):
    prompt = prompt_template.invoke(state)
    response = model.invoke(prompt)
    return {"messages": response}

workflow.add_edge(START, "model")
workflow.add_node("model", input_func)

def generate_thread_id():
    return str(uuid.uuid4())  # Unique session per request

memories = {}

def get_memory(thread_id):
    if thread_id not in memories:
        memories[thread_id] = ConversationBufferMemory(
            return_messages=True,
            memory_key="messages",
            input_key="input",
            output_key="output"
        )
    return memories[thread_id]

memory = MemorySaver()
app_ = workflow.compile(checkpointer=memory)
config = {"configurable": {"thread_id": generate_thread_id()}}

app = Flask(__name__)
CORS(app)

# Twilio client setup
twilio_client = TwilioAPIWrapper(
        account_sid=os.getenv('TWILIO_ACCOUNT_SID'),
        auth_token=os.getenv('TWILIO_AUTH_TOKEN'),
        from_number=os.getenv('TWILIO_PHONE_NUMBER') # Twilio phone number
)

def send_alert_message(user_message):
    twilio_client.run(
        body=f"Alert: A user has expressed concerning thoughts: {user_message}",
        to=os.getenv('EMERGENCY_CONTACT_PHONE_NUMBER') # Your phone number
    ) # Your phone number
    print(f"Alert message sent: {user_message}")

# Generate Embeddings
def embed(chunks):
    result = genai.embed_content(
        model="models/text-embedding-004",
        content=chunks
    )
    tensor = torch.tensor(result['embedding'], dtype=torch.float32)
    return tensor

def search_embeddings(query_embedding, chunks, k=3):
    query_embedding_array = np.expand_dims(np.array(query_embedding, dtype='float32'), axis=0)
    index = faiss.read_index("data/vectors/daily_care.faiss")
    distances, indices = index.search(query_embedding_array, k)
    matching_chunks = [chunks[i] for i in indices[0]]
    return matching_chunks

def generate_response(matching_chunks, query, app_, config, memory):
    context = '\n'.join(matching_chunks)
    input_prompt = f"Context: {context}\n\nQuestion: {query}"
    
    # Add to memory
    memory.save_context({"input": query}, {"output": ""})
    
    # Get conversation history
    memory_variables = memory.load_memory_variables({})
    history = memory_variables.get("messages", [])
    
    # Create input message with context and history
    input_message = [
        HumanMessage(content=f"{context}\n\nConversation History:\n{history}\n\nCurrent Question: {query}")
    ]
    
    output = app_.invoke({"messages": input_message}, config)
    response = output["messages"][-1].content
    
    # Save response to memory
    memory.save_context({"input": query}, {"output": response})
    
    return response

def process_query(query, config, memory):
    query_embedding = embed(query)
    chunked = pickle.load(open("data/chunks/daily_care.pkl", 'rb'))
    results = search_embeddings(query_embedding, chunked)
    response = generate_response(results, query, app_, config, memory)
    
    # Check for concerning content
    concerning_keywords = ["self-harm", "suicide", "harm to others", "severe depression"]
    if any(keyword in query.lower() for keyword in concerning_keywords):
        send_alert_message(query)
    return response

@app.route('/', methods=['GET'])
def home():
    return "App is running!", 200


@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    thread_id = request.json.get('thread_id', str(uuid.uuid4()))
    
    if not user_message:
        return jsonify({"response": "Sorry, I didn't understand your message."})
    
    print(f"User: {user_message}, Thread ID: {thread_id}")
    config = {"configurable": {"thread_id": thread_id}}
    
    # Get or create memory for this conversation
    memory = get_memory(thread_id)
    
    bot_response = process_query(user_message, config, memory)
    
    return jsonify({
        "response": bot_response,
    })


if __name__ == "__main__":
    # port = int(os.environ.get("PORT", 5001))
    # serve(app, host='0.0.0.0', port=port)
    app.run(port=5001, debug=True)
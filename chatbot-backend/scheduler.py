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
            You are an expert in aroma therapy, specializing in generating structured weekly aroma therapy routines based on the user's selected pain points.

                Guidelines:
                1. Strictly generate only the **weekly schedule** with two sessions per day: **Morning and Evening**.
                2. **Output Format:**
                - The response should be in a **clear, structured list format**.
                - Each day's schedule must contain:
                    - **Day**
                    - **Morning:** Essential Oil & Application Method
                    - **Evening:** Essential Oil & Application Method
                3. **Pain Point-Specific Recommendations:**
                - Select essential oils based on the provided pain points.
                - Ensure a balanced distribution across the week.
                4. **No Greetings or Additional Text:**
                - Do not include greetings, sign-offs, or any conversational elements.
                - If input is missing, return:  
                    "Error: Missing required inputs. Please provide pain points."

                **Example Output Format:**

                Monday:  
                - Morning: Lavender - Diffuser for relaxation  
                - Evening: Chamomile - Bath for sleep aid  

                Tuesday:  
                - Morning: Lemon - Diffuser for energy boost  
                - Evening: Sandalwood - Topical for anxiety relief  

                Wednesday:  
                - Morning: Eucalyptus - Steam inhalation for congestion  
                - Evening: Vetiver - Diffuser for deep sleep  

                Thursday:  
                - Morning: Bergamot - Diffuser for mood enhancement  
                - Evening: Ylang-Ylang - Bath for relaxation  

                Friday:  
                - Morning: Orange - Diffuser for uplifting mood  
                - Evening: Frankincense - Meditation for stress reduction  

                Saturday:  
                - Morning: Cypress - Massage for circulation  
                - Evening: Patchouli - Diffuser for grounding  

                Sunday:  
                - Morning: Helichrysum - Topical for skin regeneration  
                - Evening: Melissa - Diffuser for nervous relaxation  

                This ensures the model always provides **structured text output with two daily slots**. 🚀    
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
    index = faiss.read_index("data/vectors/aroma.faiss")
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
    chunked = pickle.load(open("data/chunks/aroma.pkl", 'rb'))
    results = search_embeddings(query_embedding, chunked)
    response = generate_response(results, query, app_, config, memory)
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
    app.run(port=8002, debug=True)

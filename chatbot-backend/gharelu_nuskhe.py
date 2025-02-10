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

load_dotenv()
genai.configure(api_key=os.environ['GEMINI_API_KEY'])

model = ChatGoogleGenerativeAI(model="gemini-1.5-flash", api_key=os.getenv("GEMINI_API_KEY"))
workflow = StateGraph(state_schema=MessagesState)
prompt_template = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are Arogyam, a virtual assistant designed to provide general guidance and support for acute illnesses and common health concerns. Your purpose is to offer insights on symptoms, home remedies, and lifestyle tips, but you must not provide medical diagnoses or prescriptions.Always stay on topic—do not engage in unrelated discussions. If a user asks about anything outside health-related concerns, gently redirect them back to the intended purpose.Before offering any suggestions, always include this disclaimer in bold letters:'DISCLAIMER: The information provided by Arogyam is for informational purposes only and should not be considered medical advice. It is not a substitute for professional medical treatment, diagnosis, or medication. Always consult a qualified healthcare provider for any medical concerns.' "
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

memory = MemorySaver()
app_ = workflow.compile(checkpointer=memory)
config = {"configurable": {"thread_id": "abc123"}}


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
    # index = faiss.read_index("data/vectors/therapy.faiss")
    index = faiss.read_index("data/vectors/natural.faiss")
    distances, indices = index.search(query_embedding_array, k)
    matching_chunks = [chunks[i] for i in indices[0]]
    return matching_chunks

# Generate Response
def generate_response(matching_chunks, query, app_):
    context = "\n".join(matching_chunks)
    print("Context:\n", context)
    input_prompt = f"Context: {context}\n\nQuestion: {query}\nAnswer:"
    input_message = [HumanMessage(content=input_prompt)]
    output = app_.invoke({"messages": input_message}, config)
    return output["messages"][-1].content

def process_query(query):
    query_embedding = embed(query)
    chunked = pickle.load(open(r'data\chunks\natural_chunked_data.pkl', 'rb'))
    results = search_embeddings(query_embedding, chunked)
    response = generate_response(results, query, app_)
    return response

@app.route('/', methods=['GET'])
def home():
    return "App is running!", 200


@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    if not user_message:
        return jsonify({"response": "Sorry, I didn't understand your message."})
    print(user_message)
    bot_response = process_query(user_message)
    print(bot_response)
    print(type(bot_response))

    return jsonify({"response": bot_response})


if __name__ == "__main__":
    app.run(port=8000, debug=True)

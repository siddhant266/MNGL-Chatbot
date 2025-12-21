import os
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware


from langchain_mistralai import ChatMistralAI, MistralAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import CSVLoader
from langchain_community.tools import DuckDuckGoSearchRun

load_dotenv()

app = FastAPI(title="MNGL AI Assistant")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# ---- Load once (VERY IMPORTANT) ----
embedding_model = MistralAIEmbeddings(model="mistral-embed")

loader = CSVLoader(
    file_path="mngl_faq.csv",
    encoding="utf-8",
    csv_args={"delimiter": ",", "quotechar": '"'}
)
documents = loader.load()

vector_store = FAISS.from_documents(documents, embedding_model)

llm = ChatMistralAI(model="open-mistral-7b", temperature=0.1)
search_tool = DuckDuckGoSearchRun()

# ---- Request Model ----
class QuestionRequest(BaseModel):
    question: str

# ---- API Endpoint ----
@app.post("/ask")
def ask_bot(data: QuestionRequest):
    user_question = data.question

    docs = vector_store.similarity_search(user_question, k=10)
    context_text = "\n\n".join([d.page_content for d in docs])

    check_prompt = f"""
    You are a helpful assistant for MNGL.

    Internal Data Context:
    {context_text}

    User Question: {user_question}

    RULES:
    1. If the answer is present in the context:
       - Answer professionally.
    2. If NOT present:
       - Reply with exactly one word: SEARCH_WEB
    """

    response = llm.invoke([("human", check_prompt)]).content.strip()

    if "SEARCH_WEB" in response:
        web_results = search_tool.run(user_question)
        web_prompt = f"""
        Answer based on this web data:
        {web_results}

        Question: {user_question}
        """
        final_answer = llm.invoke([("human", web_prompt)]).content
        source = "web"
    else:
        final_answer = response
        source = "internal"

    return {
        "answer": final_answer,
        "source": source
    }

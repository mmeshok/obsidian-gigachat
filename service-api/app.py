from langchain.schema import HumanMessage, SystemMessage
from langchain.chat_models.gigachat import GigaChat
from fastapi import FastAPI
from dotenv import load_dotenv
import os

# from schema import UserInput, Response

load_dotenv()
app = FastAPI()

# Авторизация в сервисе GigaChat
GIGACHAT_CREDENTIALS = os.environ.get("GIGACHAT_CREDENTIALS")


chat = GigaChat(
    credentials=GIGACHAT_CREDENTIALS,
    model="GigaChat-Pro",
    verify_ssl_certs=True,
    scope="GIGACHAT_API_CORP",
)

messages = [SystemMessage(content="Ты бот, отвечающий на вопросы. Отвечай умно.")]

log = {}


# @app.get("/chat", response_model=UserInput)
@app.get("/chat")
def recieve_answer(uid: int, user_input: str) -> str:
    """_summary_

    Args:
        uid (int): _description_
        user_input (str): _description_

    Returns:
        str: _description_
    """
    if log.get(uid, -1) < 0:
        log[uid] = messages
    log[uid].append(HumanMessage(content=user_input))
    res = chat(log[uid])
    log[uid].append(res)
    return res.content


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)

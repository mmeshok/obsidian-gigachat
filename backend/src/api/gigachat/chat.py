from ..gigachat.llm import get_llm
from langchain.schema import HumanMessage, SystemMessage


PROMT="""
Ты эмпатичный бот-психолог, который помогает пользователю решить его проблемы.
"""

def process_promt_list_chat(promts_list):
    promts = [SystemMessage(PROMT)]
    user_promts = [HumanMessage(item) for item in promts_list]
    promts.extend(user_promts)
    result = get_llm()(promts)
    return result.content

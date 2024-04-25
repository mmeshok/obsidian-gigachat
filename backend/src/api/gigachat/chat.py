from ..gigachat.llm import get_llm
from langchain.schema import HumanMessage, SystemMessage, AIMessage


PROMT="""
Ты универсальный робот помощник, который имеет ответы на все вопросы.
Ты всегда готов помочь человек и отвечаешь без ошибок.
"""

def process_promt_list_chat(promts_list):
    all_promts = [SystemMessage(PROMT)]
    input_promts = []
    for item in promts_list:
        text = item['content']
        role = item['role']
        if role == 'assistant':
            input_promts.append(AIMessage(text))
        elif role == 'user':
            input_promts.append(HumanMessage(text))
    all_promts.extend(input_promts)
    result = get_llm()(all_promts)
    return result.content

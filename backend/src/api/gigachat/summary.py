from langchain.chains.combine_documents.stuff import create_stuff_documents_chain
from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMSummarizationCheckerChain
from langchain.docstore.document import Document

from .llm import get_llm

PROMT_TEMPLATE = """Выдели ключевые моменты в тексте.
Оформи ответ в виде списка.
Текст: "{context}"
Ключевые моменты:"""


def stuff_summary(text, checker: bool = True, max_checks: int = 1):
    docs = [Document(page_content=text, metadata={"source": "local"})]
    prompt_template = PROMT_TEMPLATE
    prompt = PromptTemplate.from_template(prompt_template)
    stuff_chain = create_stuff_documents_chain(get_llm(), prompt)
    summary = stuff_chain.invoke({"context": docs})
    if not checker:
        return summary.content
    else:
        checker_chain = LLMSummarizationCheckerChain.from_llm(
            get_llm(), max_checks=max_checks
        )
        return checker_chain.invoke(summary).content

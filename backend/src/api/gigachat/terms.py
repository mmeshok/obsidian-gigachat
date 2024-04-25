from langchain.chains import AnalyzeDocumentChain
from langchain.chains.question_answering import load_qa_chain
from langchain_community.utilities import GoogleSerperAPIWrapper

from .llm import get_llm


PROMPT_TEMPLATE = """Твоя задача найти в тексте термины без определений.
Игнорируй обычные слова. Ищи только термины, определения и сокращения, которым не хватает расшифровки.
Если таких нет, ничего не возвращай.
Текст: "{context}"
Ответ:"""


QUESTION = """Найди в тексте сокращения и аббревиатуры. Не выбирай нормальные слова. Выведи их в формате [термин_1, термин_2,
термин_3, термин_4]. Не мотивируй свой ответ, не выводи другой текст."""


_SEARCH: GoogleSerperAPIWrapper


def get_search():
    global _SEARCH
    return _SEARCH


def _process_abbreviations(text):
    qa_chain = load_qa_chain(get_llm(), chain_type="map_reduce")
    qa_document_chain = AnalyzeDocumentChain(combine_docs_chain=qa_chain)
    abbreviations = qa_document_chain.run(
        input_document=text,
        question=QUESTION,
    )
    abbreviations = list(set(abbreviations[abbreviations.find('['):abbreviations.find(']')].replace('"', '').replace("'", '').strip('][').split(', ')))
    return abbreviations


def _find_terms(abbreviations):
    search_results = {}
    for abb in abbreviations:
        search_results[abb] = get_search().run(f'{abb} это')

    decodings = {}
    for abbreviation, search_result in search_results.items():
        decoding = get_llm().invoke(f'''Найди расшифровку аббривиатуры "{abbreviation}" в тексте:
            "{search_result}". Выведи только расшифровку. Не выводи опредеоление и другой текст. 
            Не объясняй свой ответ. Если не найдешь термин, убери его из списка''').content
        decodings[abbreviation] = decoding
    return decodings


def process_terms_in_text(text: str) -> dict:
    abbreviations = _process_abbreviations(text)
    terms = _find_terms(abbreviations)

    for key, value in terms.items():
        text = text.replace(key, f'{key} ({value})')

    return text


def init_google_serper(api_key):
    global _SEARCH
    _SEARCH = GoogleSerperAPIWrapper(serper_api_key=api_key, gl='ru', hl='ru', k=5)

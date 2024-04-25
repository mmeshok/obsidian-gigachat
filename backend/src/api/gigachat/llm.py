from langchain.chat_models.gigachat import GigaChat


_LLM: GigaChat


def get_llm():
    global _LLM
    return _LLM


def init_gigachat(credentionals):
    global _LLM
    _LLM = GigaChat(
        credentials=credentionals,
        model="GigaChat-Pro",
        verify_ssl_certs=False,
        scope="GIGACHAT_API_CORP",
        profanity_check=False
    )

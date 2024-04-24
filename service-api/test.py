import requests

message = "Сколько платят в сбере мидлу?"

respone = requests.get(f"http://127.0.0.1:8000/chat?uid=1&user_input={message}")

print(respone.text)

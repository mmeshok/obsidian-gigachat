from flask import Blueprint, request
import http.client as http_client


mod = Blueprint('chat', __name__, url_prefix='/')


@mod.route('/chat', methods=['POST'])
def simple_chat():
    message = request.json.get('message')
    # TODO:
    return { 'responce': 'This is mock responce!' }, http_client.OK


@mod.route('/chat/clear', methods=['POST'])
def chat_clear():
    # TODO:
    return '', http_client.OK


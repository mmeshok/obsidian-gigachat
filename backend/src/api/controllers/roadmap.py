from flask import Blueprint, request
import http.client as http_client
from ..gigachat.roadmap import process_roadmap


mod = Blueprint('roadmap', __name__, url_prefix='/')


@mod.route('/roadmap', methods=['POST'])
def roadmap():
    topic = request.json.get('topic')
    result = process_roadmap(topic)
    return { 'result': result }, http_client.OK

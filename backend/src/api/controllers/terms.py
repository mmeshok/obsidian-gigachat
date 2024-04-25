from flask import Blueprint, request, current_app
import http.client as http_client

from ..gigachat import process_terms_in_text 


mod = Blueprint('/terms', __name__, url_prefix='/')


@mod.route('/terms', methods=['POST'])
def terms():
    text = request.json.get('text')
    current_app.logger.info(f'terms input={text}')
    result = process_terms_in_text(text)
    current_app.logger.info(f'terms result={result}')
    return { 'result': result }, http_client.OK

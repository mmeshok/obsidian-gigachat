from flask import Blueprint
import http.client as http_client


mod = Blueprint('/', __name__, url_prefix='/')


@mod.route('/health_check')
def health_check():
    return 'Backend is running\n', http_client.OK

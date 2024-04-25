import logging

from flask import Flask
from .config import Config


def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object('api.Config')
    
    init_logging()
    init_controllers(app)

    return app


def init_logging():
    logging.basicConfig(format='[%(asctime)s] %(name)s %(levelname)s: %(message)s', level=logging.DEBUG)
    

def init_controllers(app: Flask):
    from .controllers import root, chat, summary
    api_v1(app, root.mod)
    api_v1(app, chat.mod)
    api_v1(app, summary.mod)


def api_v1(app: Flask, mod):
    app.register_blueprint(mod, url_prefix='')

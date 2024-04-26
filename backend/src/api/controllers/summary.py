from flask import Blueprint, request
import http.client as http_client
from ..gigachat.summary import stuff_summary


mod = Blueprint("summary", __name__, url_prefix="/")


@mod.route("/summary", methods=["POST"])
def summary():
    text = request.json.get("text")
    # TODO:
    return text, http_client.OK

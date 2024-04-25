FROM python:3.8-buster
RUN mkdir -p backend
WORKDIR /backend
COPY ./requirements.txt .
RUN pip install -r requirements.txt
COPY src/ ./src
ENV FLASK_APP=src/api
CMD flask run --host=0.0.0.0 --port=80

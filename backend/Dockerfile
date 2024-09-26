FROM python:latest
WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 6543

CMD [ "python","-m","flask_route" ]

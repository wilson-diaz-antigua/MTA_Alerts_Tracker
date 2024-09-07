FROM python:latest
WORKDIR /app

COPY . .
RUN pip install -r requirements.txt
EXPOSE 6543

CMD ["python","-m", "flask_route"]

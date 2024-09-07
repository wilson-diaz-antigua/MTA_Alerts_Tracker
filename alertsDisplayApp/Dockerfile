FROM node:alpine3.20
WORKDIR /app

COPY . .
RUN node install
EXPOSE 6543

CMD ["python", "flask_route.py"]

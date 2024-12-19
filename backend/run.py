import sys

import uvicorn

from backend.services import server


def main():
    uvicorn.run(app=server, host="localhost", port=5008, reload=True)


if __name__ == "__main__":
    main()

import os

import requests
from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv(".env")

KEY = os.getenv("API_KEY")
URL = os.getenv("API_URL")

supabase: Client = create_client(URL, KEY)

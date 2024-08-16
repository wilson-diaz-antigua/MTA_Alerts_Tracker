import os

import requests
from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv(".env")

KEY = os.getenv("SUPABASE_API_KEY")
URL = os.getenv("SUPABASE_API_URL")

supabase: Client = create_client(URL, KEY)

import os
from dotenv import load_dotenv
import google.genai as genai

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

for m in client.models.list():
    print(m.name, "->", m.supported_actions)

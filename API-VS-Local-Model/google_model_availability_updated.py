import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

models = client.models.list()

for m in models:
    if "generateContent" in (m.supported_actions or []):
        print("Valid:", m.name)
    else:
        print("SKIP:", m.name, "-> supports:", m.supported_actions)
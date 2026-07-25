import os
from dotenv import load_dotenv
from openai import OpenAI

# Load API key from .env
load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

prompt = "What is the capital of Paris?"


response = client.chat.completions.create(
    model="gpt-4.1-mini",
    messages=[{"role": "user", "content": prompt}],
    max_tokens=200
)

print(response.choices[0].message.content.strip())
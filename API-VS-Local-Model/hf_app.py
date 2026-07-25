import os
import requests
from dotenv import load_dotenv

load_dotenv()

prompt = "What is the currency of India?"

model_id = "baidu/Unlimited-OCR"
api_url = f"https://api-inference.huggingface.co/models/{model_id}"

header = {"Authorization": f"Bearer {os.getenv('HUGGINGFACE_API_KEY')}"}
payload = {"inputs": prompt, "parameters": {"max_new_tokens": 200}}

response = requests.post(api_url, headers=header, json=payload)
response.raise_for_status()

data = response.json()
print(data[0]["generated_text"].strip())
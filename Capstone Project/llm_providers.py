import ollama
import os
import json
import google.generativeai as genai
from openai import OpenAI
from dotenv import load_dotenv

import warnings
warnings.filterwarnings('ignore')

load_dotenv()

with open("config.json", "r") as f:
    CONFIG = json.load(f)

# OpenAI function
def run_openai(message):
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.chat.completions.create(
        model=CONFIG["openai"]["model"],
        messages=message,
        max_tokens = CONFIG["openai"].get("max_tokens", 200),
        temperature= CONFIG["openai"].get("temperature", 0.7),
        top_p= CONFIG["openai"].get("top_p", 0.9),
    )
    return response.choices[0].message.content.strip()

# Gemini function
def run_gemini(prompt: str):
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel(CONFIG["gemini"]["model"])
    response = model.generate_content(
        prompt,
        generation_config={
            "temperature": CONFIG["gemini"].get("temperature", 0.7),
            "top_p": CONFIG["gemini"].get("top_p", 0.9),
            "max_output_tokens": CONFIG["gemini"].get("max_output_tokens", 200),            
        }
    )
    return response.text.strip()

# Ollama function
def run_ollama(prompt: str, config: dict):
    response = ollama.chat(
        model=config["ollama"]["model"],   # e.g. "mistral"
        messages=[{"role": "user", "content": prompt}],
        options={
            "temperature": config["ollama"].get("temperature", 0.8),
            "top_p": config["ollama"].get("top_p", 0.9),
            "num_predict": config["ollama"].get("max_tokens", 500)
        }
    )
    return response["message"]["content"].strip()


# Router function
def run_llm(history):
    provider = CONFIG["provider"]

    if provider == "openai":
        return run_openai(history)
    elif provider == "ollama":
        conversation_text = "\n".join(
            f"{m['role']}: {m['content']}" for m in history
        )
        return run_ollama(conversation_text, CONFIG)
    elif provider == "gemini":
        conversation_text = "\n".join(
            f"{m['role']}: {m['content']}" for m in history
        )
        return run_gemini(conversation_text)
    else:
        return "[Error] Invalid provider in config.json"
import os
import logging
from dotenv import load_dotenv
from typing import Dict, Any
from openai import OpenAI
import ollama
from google import genai


load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


#prompt
prompt = "What is the currency of USA?"


def run_openai(prompt: str) -> str:
    try:
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logging.error(f"OpenAI API failed: {e}")


def run_gemini(prompt: str) -> str:
    try:
        client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        response = client.models.generate_content(
            model="models/gemini-3.5-flash",
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        logging.error(f"Gemini API failed: {e}")
        return "[Gemini Error]"
    

def run_ollama(prompt: str) -> str:
    try:
        response = ollama.chat(
            model="mistral",
            messages=[{"role": "user", "content": prompt}]
        )
        return response["message"]["content"].strip()
    except Exception as e:
        logging.error(f"Ollama failed: {e}")
        return "[Ollama Error]"
    


def run_all_models(prompt: str) -> Dict[str, Any]:
    logging.info("Running prompt across OpenAI, Gemini and Ollama...")
    results = {
        "OpenAI": run_openai(prompt),
        "Google Gemini": run_gemini(prompt),
        "Ollama:": run_ollama(prompt)
    }
    return results

if __name__=="__main__":
    results = run_all_models(prompt)

    print("\n\n>>>>> Comparison of Outputs <<<<<")
    for model, output in results.items():
        print(f"\n--- {model} ---")
        print(output)
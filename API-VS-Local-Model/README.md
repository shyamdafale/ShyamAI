# API vs Local Models

A hands-on comparison of running LLMs via cloud APIs (OpenAI GPT, Google Gemini) versus locally through Ollama and HuggingFace Transformers. Sends the same prompt to each provider and prints side-by-side outputs so you can compare response quality, latency, and cost trade-offs.

## Projects files

| File | Description |
|------|-------------|
| `compare-models.py` | Sends one prompt to OpenAI, Gemini, and Ollama and prints all results |
| `openai_app.py` | Standalone OpenAI GPT example |
| `gemini_app.py` | Standalone Google Gemini example |
| `ollama_app.py` | Standalone Ollama (local) example |
| `hf_app.py` | HuggingFace Transformers (local) example |
| `google_model_availability.py` | Lists available Gemini models |

## Setup

### 1. Create a virtual environment

```bash
python -m venv venv
source venv/bin/activate        # macOS/Linux
# venv\Scripts\activate         # Windows
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure API keys

Create a `.env` file in this folder:

```env
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
```

> For Ollama, install it from [ollama.com](https://ollama.com) and pull a model: `ollama pull mistral`

## Run

```bash
python compare-models.py
```

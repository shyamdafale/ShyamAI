Create the API key from here:
https://platform.openai.com/home




Create the API key from here:


https://aistudio.google.com/api-keys?_gl=1bak360_gaMTYxMjM0NDQxNi4xNzgzOTQ4NDIz_ga_P1DBVKWT6V*czE3ODM5NDg0MjMkbzEkZzEkdDE3ODM5NDg4NjIkajYwJGwwJGgxNzY3MTkxMjI1&project=gen-lang-client-0957723667&projectFilter=gen-lang-client-0332376362




Create the API key from here:


https://huggingface.co/settings/tokens




Download and install the Ollama from here:


Ollama is like a local deployment platform for the model like Falcom, Mistral which are open source


https://ollama.com/download/windows


Once installed on local PC :
Open command prompt in administration mode and type below command to download and install the Ollama for mistral AI Model (RAM Recommended 8GB to 12GB)


Cmd >> ollama pull mistral
i.e.
C:\Windows\System32>ollama pull mistral


Create virtual envrioment for python :

python -m venv myenv

open new terminal and then type below cmd:

(myenv) PS E:\Shyam AI\API-VS-Local-Model> myenv\Scripts\activate      

(myenv) PS E:\Shyam AI\API-VS-Local-Model> pip install -r requirements.txt  
 
Upgrade the pip if require
>> python.exe -m pip install --upgrade pip
pip install --upgrade google-genai

>>pip install google-generativeai --- This is outdated

>> PS E:\Shyam AI\API-VS-Local-Model> pip install python-dotenv
>> 

(myenv) PS E:\Shyam AI\API-VS-Local-Model> python .\google_model_availability_updated.py

PS E:\Shyam AI\API-VS-Local-Model> python .\ollama_app.py 

PS E:\Shyam AI\API-VS-Local-Model> python .\openai_app.py

(myenv) PS E:\Shyam AI\API-VS-Local-Model> python .\gemini_app.py


Chat bot -  just normal code passing history to the new prompt

RAG  -- It's like vector db needed for the memeory

Agents: Prompt tunning Vs Fine tunning -->

1. Full parameter Fine tuning  (FPFT)
2. Pamameter efficient fine tuning (PeFT)
    A. LoRA - Lower Rank Adapter / Adaptation
    B. QLoRa - Quantized Lower Rank Adapter / Adaptation

This above need the understanding of the Matrix, Rank of the matrix, lower rank of Matrix concepts from the Mathematics.
Need the library and practical for this.
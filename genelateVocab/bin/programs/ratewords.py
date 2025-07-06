import csv
from time import sleep
import google.generativeai as genai
import os
from datetime import datetime
import sqlGenerater

def removeWords(r):
     os.environ["GOOGLE_API_KEY"] = "AIzaSyDDlcYwI_V-9vNjXBkCiml_UyFRxw3V2q4" 
     genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

     model = genai.GenerativeModel(model_name="gemini-2.0-flash")

     prompt = "\n".join(
          f"remove words which is to easy so that person who can earn 200 point at TOEIC exam doesn't need to memorize from following list."
          f"Out put must be just word list which toeic learner challenging more than 200 point must learn.Also if there is any word which is not in English,remove it."
          f"Output must be just the words without any additional text or formatting"
          f"and all words must be in lowercase and each wordsmust be in one row. here is the list of words: {r}"
          )
     response = model.generate_content(prompt)
     return response.text
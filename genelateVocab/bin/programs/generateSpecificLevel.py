import csv
from time import sleep
import google.generativeai as genai
import os
from datetime import datetime
import sqlGenerater

def generateSpecificLevel(level):
     os.environ["GOOGLE_API_KEY"] = "AIzaSyDDlcYwI_V-9vNjXBkCiml_UyFRxw3V2q4" 
     genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

     model = genai.GenerativeModel(model_name="gemini-2.0-flash")
     prompt = "\n".join(
               f"Generate 20 words which have appeared in TOEIC exam for TOEIC level {level}. Output must be just the word without any additional text or formatting and all characters must be lowercase."
          )
     response = model.generate_content(prompt)
     print(response.text)
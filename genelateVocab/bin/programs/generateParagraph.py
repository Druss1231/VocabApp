import csv
from time import sleep
import google.generativeai as genai
import os
from datetime import datetime
import sqlGenerater

def generateParagraph():
     os.environ["GOOGLE_API_KEY"] = "AIzaSyDDlcYwI_V-9vNjXBkCiml_UyFRxw3V2q4" 
     genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

     model = genai.GenerativeModel(model_name="gemini-2.0-flash")

     now = datetime.now()
     filename = f"paragraph_{now.strftime('%Y%m%d_%H%M%S')}.txt"
     # Sleep to avoid hitting API rate limits
     promptWords = ["paragraph"]
     prompt = "\n".join(
               f"Generate random TOEIC-like English long essey. Output must be just the paragraph without any additional text or formatting."
          )
     response = model.generate_content(prompt)
     filepath = os.path.join("output", filename)
     return response.text
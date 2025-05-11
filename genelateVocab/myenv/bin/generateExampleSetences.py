import csv
import pprint
import pandas as pd
import google.generativeai as genai
from tqdm import tqdm
import os
import time
import sqlGenerater

os.environ["GOOGLE_API_KEY"] = "AIzaSyDDlcYwI_V-9vNjXBkCiml_UyFRxw3V2q4" 
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

header = ['example_sentence', 'meaning']

export_file_path = "export.txt"
if os.path.exists(export_file_path):
  os.remove(export_file_path)

output_file_path = "output.txt"
if os.path.exists(output_file_path):
  os.remove(output_file_path)

model = genai.GenerativeModel(model_name="gemini-2.0-flash")

with open('Book 3(Sheet1).csv') as f:
   reader = csv.reader(f)
   data = [row for row in reader]
   i = 0
   while i < len(data):
     j = 0
     batch = []
     while j < 11 and i < len(data):
      batch.append(data[i])
      i += 1
      j += 1
      prompt = "\n".join(
        f"Generate random 1 TOEIC-like English example sentence for the word '{row[0]}', "
        f"provide the Japanese translation for the sentence,a short Japanese definition, and the word. Format as CSV with no column names."
        for row in batch
    )
     print(prompt) 
     response = model.generate_content(prompt)
     f2 = open('export.txt', 'a')
     result = response.text
     print(result)
     f2.write(result)
     time.sleep(30)
sqlGenerater.file_replace("600")
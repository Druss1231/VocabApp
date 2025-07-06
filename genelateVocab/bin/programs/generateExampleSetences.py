import csv
import io
import pprint
import google.generativeai as genai
from tqdm import tqdm
import os


def generateExampleSetences(r):
  os.environ["GOOGLE_API_KEY"] = "AIzaSyDDlcYwI_V-9vNjXBkCiml_UyFRxw3V2q4" 
  genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

  model = genai.GenerativeModel(model_name="gemini-2.0-flash")
  dict_list = []
  data = r
  
  i = 0
  length = len(data)
  print("Total words to process:", length)
  
  while i < len(data):
    j = 0
    batch = []
    while j < 11 and i < len(data):
      batch.append(data[i])
      i += 1
      j += 1
      prompt = "\n".join(
        f'''Generate random TOEIC-like English example sentence for the each word "{row}",
        provide the Japanese translation for the sentence, a short Japanese definition.
        And also rate the difficulty of the word from 200 to 990 according to TOEIC score requirement, where 200 is the easiest and 990 is the hardest.
        Out put must be like below with no other information.And you don't need to output the reading of the word.
        {{rate}},"{row}","{{short Japanese definition}}", "{{example sentence}}", "{{Japanese translation for the example sentence}}"'''
        for row in batch
    )
    response = model.generate_content(prompt)
    print(response.text)
    f = io.StringIO(response.text)
    print(f)
    reader = csv.reader(f)
    for row in reader:
      level = int(row[0])
      word = row[1]
      short_japanese_definition = row[2]
      example_sentence = row[3].replace(",", "\\,")
      japanese_translation = row[4]
          # Skip this row if English letters are found in the Japanese translation
      if any(c.isascii() and c.isalpha() for c in japanese_translation):
        continue  # Skip this row and go to next
      dict_list.append({
        "level": level,
        "word": word,
        "japanese_meaning": short_japanese_definition,
        "example_sentence": example_sentence,
        "sentence_meaning": japanese_translation
      })
    print(str(len(dict_list)), "sentences generated so far.")
      
    
  return dict_list
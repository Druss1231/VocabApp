from csv import reader, writer
import os
import sys

def file_replace(r):

  export2_file_path = "export2.txt"
  if os.path.exists(export2_file_path):
    os.remove(export2_file_path)

  with open('export.txt') as reader:
    content = reader.read()
  content = content.replace("'", "''")
  content = content.replace(',', "','")
  content = content.replace('\n', "','" + r + "'),\n")
  
  print(content)
  with open('export2.txt', 'w') as writer:
    writer.write(content)
    
  with open('export2.txt') as reader, open('export3.txt', 'w') as writer:
    for line in reader:
      line = "('" + line
      writer.write(line)
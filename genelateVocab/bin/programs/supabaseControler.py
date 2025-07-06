from supabase import create_client, Client
url = "https://iahmhdxbvbmdhaloxyae.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhaG1oZHhidmJtZGhhbG94eWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4ODM4NjIsImV4cCI6MjA2MjQ1OTg2Mn0.kEAfQTXlgAmElu_zCe5bsU0Ncgz2Wp-PGvupXAFfcZw"  # Usually your anon/public key

supabase: Client = create_client(url, key)
response = supabase.table("vocabulary").select("word").execute()

def get_words_from_supabase():
  # Extract words from the response
  words = [item["word"] for item in response.data]
  return words

def insert_words_to_supabase(r):
    # Insert words into the Supabase table
    response = supabase.table("vocabulary").insert(r).execute()
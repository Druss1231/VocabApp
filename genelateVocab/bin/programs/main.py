import generateParagraph
import separate
import chooseWords
import supabaseControler
import generateExampleSetences

# Generate a paragraph
generatedParagraph = generateParagraph.generateParagraph()

# Separate words from the generated paragraph
separatedWords = separate.separate_words(generatedParagraph)

# Remove words that are too easy for TOEIC learners
chosenWords = chooseWords.chooseWords(separatedWords)

# Split the chosen words into a list
toStrChosenWords = str(chosenWords)
chosenWordList = toStrChosenWords.splitlines()

# Fetch words from Supabase
fetchedWords = supabaseControler.get_words_from_supabase()

# Find unique words that are not in the fetched words
uniqueWords = list(set(chosenWordList) - set(fetchedWords))

# Generate example sentences for the unique words
generatedSentence = generateExampleSetences.generateExampleSetences(uniqueWords)
numbet_of_sentences = str(len(generatedSentence))
print(numbet_of_sentences + " sentences generated.")


# Insert the generated sentences into Supabase
supabaseControler.insert_words_to_supabase(generatedSentence)
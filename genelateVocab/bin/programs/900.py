import generateParagraph
import separate
import chooseWords
import supabaseControler
import generateExampleSetences

chosenWordList = ["inventory","itinerary","procurement","expedite","consolidate","advisory","discrepancy","liability","compliance","stipulate","remittance","amortization","appraisal","collateral","subsidiary","contingency","rectify","delegate","arbitration","affidavit","liaison","adhere","feasibility","reimburse","moratorium","stringent","commence","acquisition","prospectus","audit","adherence","bereavement","impromptu","merchandise","retrofit","turnover","vendor","warranty","authenticate","compile","foreclosure","revenue","negotiate","liaise","consensus","benchmark","retrospective","meticulous","embargo","attrition","logistics","demographics","iterate","solicit","tenure"]

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
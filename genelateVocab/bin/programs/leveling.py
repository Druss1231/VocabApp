import pandas as pd
import math


# Load the CSV file
df = pd.read_csv('Supabase Snippet Vocabulary Word Retrieval.csv')

# Define the new 7 TOEIC score levels and their approximate ranges
# We'll adjust the ranges slightly based on the distribution of existing scores
level_ranges = {
    300: (300, 399),
    400: (400, 499),
    500: (500, 599),
    600: (600, 699),
    700: (700, 779),  # Adjusted upper bound to help distribute high-level words
    800: (780, 849),  # Adjusted for better distribution
    900: (850, 900)
}

def assign_new_level(current_level, ranges, df_levels):
    """
    Assigns a new TOEIC level based on the current level, trying to keep distribution balanced
    and close to the original level.
    """
    best_level = None
    min_distance = float('inf')

    # Find the level range that the current_level falls into
    for level, (lower, upper) in ranges.items():
        if lower <= current_level <= upper:
            best_level = level
            break

    # If the current_level doesn't fall neatly into a range, find the closest one
    if best_level is None:
        for level, (lower, upper) in ranges.items():
            distance = min(abs(current_level - lower), abs(current_level - upper))
            if distance < min_distance:
                min_distance = distance
                best_level = level

    # Further adjustment to balance distribution, if necessary.
    # This is a heuristic and might need manual tweaking depending on the data.
    # For this exercise, we'll primarily rely on the range mapping and
    # the existing distribution, as per user's request to not deviate too much.

    return best_level

# Apply the new level assignment
df['new_level'] = df['level'].apply(lambda x: assign_new_level(x, level_ranges, df['level']))

# Count words per new level to check distribution
# print("Initial distribution of words per new level:")
# print(df['new_level'].value_counts().sort_index())

# If the distribution is very uneven, we might need a more sophisticated balancing
# mechanism, but given the request to stay "not too far" from original levels,
# a direct mapping to pre-defined ranges is a good start.
# Let's ensure the output format is correct.

output = []
for index, row in df.iterrows():
    output.append(f"{row['word']},{row['new_level']}")

# Print the output
for line in output:
    print(line)
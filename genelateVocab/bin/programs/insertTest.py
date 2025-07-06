import supabaseControler

value = [{'level': 650, 'word': 'efficiency', 'japanese_meaning': '効率、能率', 'example_sentence': 'The new system improved the efficiency of the order processing department.', 'sentence_meaning': '新しいシステムにより、受注処理部門の効率が向上しました。'}]
supabaseControler.insert_words_to_supabase(value)
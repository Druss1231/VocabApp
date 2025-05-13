
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '../../supabaseClient';
type Props = {
  level: number;
};

type Vocab = {
  id: number;
  word: string;
  japanese_meaning: string;
  example_sentence: string;
  sentence_meaning: string;
};

function VocabList({ level }: Props) {
  const [vocabList, setVocabList] = useState<Vocab[]>([]);
  const navigate = useNavigate();

useEffect(() => {
  const fetchData = async () => {
    const { data, error } = await supabase
      .from('vocabulary')
      .select('*')
      .eq('level', level)
      .order('id');

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setVocabList(data || []);
    }
  };

  fetchData();
}, [level]);
  return (
    <div className="container">
      <h2>単語一覧 (レベル {level})</h2>
      <ul className="vocab-list">
        {vocabList.map((item,index) => (
          <li key={item.id}>
            <button
              className="vocab-card"
              key={item.id}
              onClick={() => navigate('/meaning', {state: {vocabList, currentIndex: index}})} 
            >
              {item.word}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VocabList;

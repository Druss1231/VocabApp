import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
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
  const [rememberedWords, setRememberedWords] = useState<number[]>([]);
  const [filter, setFilter] = useState<"all" | "remembered" | "unremembered">(
    "all"
  );
  const [userId, setUserId] = useState<string | null>(null);
  // Fetch user ID
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    fetchUser();
  }, []);

  // Fetch remembered word IDs for the user
  useEffect(() => {
    if (!userId) return;
    const fetchRemembered = async () => {
      const { data, error } = await supabase
        .from("remembered_words")
        .select("vocab_id")
        .eq("user_id", userId)
        .eq("remembered", true);

      if (error) {
        console.error("Error fetching remembered words:", error);
      } else {
        setRememberedWords(data.map((item) => item.vocab_id));
      }
    };
    fetchRemembered();
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("vocabulary")
        .select("*")
        .eq("level", level)
        .order("id");

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setVocabList(data || []);
      }
    };

    fetchData();
  }, [level]);

  const filteredList = vocabList.filter((item) => {
    if (filter === "remembered") return rememberedWords.includes(item.id);
    if (filter === "unremembered") return !rememberedWords.includes(item.id);
    return true; // all
  });

  return (
    <div className="container">
      <h2>単語一覧 (レベル {level})</h2>
      <div className="flex-container-10">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded ${
            filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          全て
        </button>
        <button
          onClick={() => setFilter("remembered")}
          className={`px-3 py-1 rounded ${
            filter === "remembered" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          覚えた単語
        </button>
        <button
          onClick={() => setFilter("unremembered")}
          className={`px-3 py-1 rounded ${
            filter === "unremembered" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          覚えてない単語
        </button>
      </div>
<button
  onClick={() => navigate("/quiz", { state: { vocabList: filteredList } })}
  className="my-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
>
  この単語でクイズを始める
</button>
<ul className="vocab-list">
  {filteredList.map((item, index) => (
    <li key={item.id}>
      <button
        className="vocab-card"
        onClick={() => navigate('/meaning', {
          state: {
            vocabList: filteredList,
            currentIndex: index
          }
        })}
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

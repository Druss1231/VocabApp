import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./css/vocablist.css";
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
        .gte("level", level)
        .lte("level", level + 99)
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
      <div style={{ position: "fixed", top: "16px", left: "16px", zIndex: 50 }}>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 shadow"
        >
          レベル選択へ戻る
        </button>
      </div>
      <h2>
        単語一覧 (レベル {level})
        {vocabList.length > 0 && (
          <span style={{ fontSize: "0.8em", marginLeft: "1em", color: "#555" }}>
            覚えた:{" "}
            {
              rememberedWords.filter((id) =>
                vocabList.map((v) => v.id).includes(id)
              ).length
            }{" "}
            / {vocabList.length}
          </span>
        )}
      </h2>
      <div className="flex-container-10">
        <button
          onClick={() => setFilter("all")}
          className={`filter-button ${filter === "all" ? "active" : ""}`}
        >
          全て
        </button>
        <button
          onClick={() => setFilter("remembered")}
          className={`filter-button ${filter === "remembered" ? "active" : ""}`}
        >
          覚えた単語
        </button>
        <button
          onClick={() => setFilter("unremembered")}
          className={`filter-button ${
            filter === "unremembered" ? "active" : ""
          }`}
        >
          覚えてない単語
        </button>
      </div>
      <button
        onClick={() =>
          navigate("/quiz", { state: { vocabList: filteredList } })
        }
        className="my-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        この単語でクイズを始める
      </button>
      <ul className="vocab-list">
        {filteredList.map((item, index) => (
          <li key={item.id}>
            <button
              className={`vocab-card ${
                rememberedWords.includes(item.id) ? "remembered" : ""
              }`}
              onClick={() =>
                navigate("/meaning", {
                  state: {
                    vocabList: filteredList,
                    currentIndex: index,
                  },
                })
              }
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

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Volume2 } from "lucide-react";
import Flag from "react-world-flags";
import { supabase } from "../../supabaseClient";

type Vocab = {
  id: number;
  word: string;
  japanese_meaning: string;
  example_sentence: string;
  sentence_meaning: string;
};

const speak = (text: string, lang: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;

  const voices = window.speechSynthesis.getVoices();
  const matchingVoice = voices.find((voice) => voice.lang === lang);
  if (matchingVoice) {
    utterance.voice = matchingVoice;
  }

  window.speechSynthesis.speak(utterance);
};

const Meaning = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { vocabList, currentIndex } = location.state as {
    vocabList: Vocab[];
    currentIndex: number;
  };

  const [index, setIndex] = useState(currentIndex);
  const vocab = vocabList[index];

  const [generatedSentence, setGeneratedSentence] = useState("");
  const [generatedMeaning, setGeneratedMeaning] = useState("");
  const [loading, setLoading] = useState(false);
  const [remembered, setRemembered] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoadingRemembered, setIsLoadingRemembered] = useState(true); // Add loading state

  // 1. Get current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    fetchUser();
  }, []);

useEffect(() => {
  if (!userId) return;

  const vocab = vocabList[index]; // ✅ Recalculate based on index

  // Reset UI states when word changes
  setGeneratedSentence("");
  setGeneratedMeaning("");
  setIsLoadingRemembered(true);

  const loadRemembered = async () => {
    const { data, error } = await supabase
      .from("remembered_words")
      .select("remembered")
      .eq("user_id", userId)
      .eq("vocab_id", vocab.id)
      .single();

    if (error) {
      console.error("Error fetching remembered state:", error);
      setRemembered(false); // fallback
    } else {
      setRemembered(data?.remembered ?? false);
    }
    setIsLoadingRemembered(false);
  };

  loadRemembered();
}, [userId, index]);

  // 3. Toggle remembered state
  const toggleRemembered = async () => {
    if (!userId) return;
    const { error } = await supabase.from("remembered_words").upsert(
      {
        user_id: userId,
        vocab_id: vocab.id,
        remembered: !remembered,
      },
      { onConflict: "user_id, vocab_id" }
    );

    if (!error) setRemembered(!remembered);
  };

  const handleGenerate = async () => {
    setLoading(true);
    const res = await fetch("http://127.0.0.1:5000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word: vocab.word }),
    });
    const data = await res.json();
    const parts = data.result.split("\t"); // Or use a better parser based on how Gemini responds
    setGeneratedSentence(parts[0] || "");
    setGeneratedMeaning((parts[1] + " " + (parts[2] || "")).trim());
    setLoading(false);
  };

  if (isLoadingRemembered) return <div>Loading...</div>; // Display loading message if the remembered state is still fetching

  return (
    <div className="container relative">
      <div style={{ position: "fixed", top: "16px", left: "16px", zIndex: 50 }}>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 shadow"
        >
          単語一覧へ戻る
        </button>
      </div>
      <div className="flex-container">
          <button
            onClick={() => setIndex(index - 1)}
            disabled={index === 0}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            前へ
          </button>
          
        <div>
          
          <div className="row">
            <h1 className="text-xl font-bold">{vocab.word}</h1>
            <button onClick={() => speak(vocab.word, "en-US")}>
              <Volume2 />
              <Flag code="US" style={{ width: 24, height: 16 }} />
            </button>
            <button onClick={() => speak(vocab.word, "en-GB")}>
              <Volume2 />
              <Flag code="GB" style={{ width: 24, height: 16 }} />
            </button>
          </div>
          {/* Remembered checkbox */}
          <label className="block my-2">
            <input
              type="checkbox"
              checked={remembered}
              onChange={toggleRemembered}
            />{" "}
            この単語を覚えた
          </label>
          <h2>{vocab.japanese_meaning}</h2>
          <div className="row">
            <h2>{vocab.example_sentence}</h2>
            <button onClick={() => speak(vocab.example_sentence, "en-US")}>
              <Volume2 />
              <Flag code="US" style={{ width: 24, height: 16 }} />
            </button>
            <button onClick={() => speak(vocab.example_sentence, "en-GB")}>
              <Volume2 />
              <Flag code="GB" style={{ width: 24, height: 16 }} />
            </button>
          </div>
          <h2>{vocab.sentence_meaning}</h2>
          <button onClick={handleGenerate} disabled={loading}>
            {loading ? "生成中" : "例文を生成する"}
          </button>
          {generatedSentence && (
            <div className="mt-4 p-4 border rounded-md bg-indigo-50">
              <h3>生成された例文: {generatedSentence}</h3>
              <h3>意味： {generatedMeaning}</h3>
              <button onClick={() => speak(generatedSentence, "en-US")}>
                <Volume2 />
                <Flag code="US" style={{ width: 24, height: 16 }} />
              </button>
              <button onClick={() => speak(generatedSentence, "en-GB")}>
                <Volume2 />
                <Flag code="GB" style={{ width: 24, height: 16 }} />
              </button>
            </div>
          )}
          
        </div>
        <button
            onClick={() => setIndex(index + 1)}
            disabled={index === vocabList.length - 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            次へ
          </button>
      </div>
    </div>
  );
};

export default Meaning;

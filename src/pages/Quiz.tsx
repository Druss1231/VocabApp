import { useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

type Vocab = {
  id: number;
  word: string;
  japanese_meaning: string;
  example_sentence: string;
  sentence_meaning: string;
  remembered: boolean;
  vocab_id: number;
};

const Quiz = () => {
  const location = useLocation();
  const { vocabList } = location.state as { vocabList: Vocab[] };
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // ✅ Moved inside
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    };
    getUser();
  }, []);

  const currentVocab = vocabList[currentIndex];

  const choices = useMemo(() => {
    const options = [currentVocab.japanese_meaning];
    while (options.length < 4) {
      const rand = vocabList[Math.floor(Math.random() * vocabList.length)];
      if (!options.includes(rand.japanese_meaning)) {
        options.push(rand.japanese_meaning);
      }
    }
    return options.sort(() => Math.random() - 0.5);
  }, [currentIndex]);

  const handleAnswer = async (answer: string) => {
    const correct = answer === currentVocab.japanese_meaning;
    setSelectedAnswer(answer);
    setIsCorrect(correct);

    const rememberedValue = correct ? true : false;

    if (userId) {
      const { error } = await supabase
        .from("remembered_words")
        .upsert(
          {
            user_id: userId,
            vocab_id: currentVocab.id,
            remembered: rememberedValue,
          },
          { onConflict: "user_id,vocab_id" }
        );

      if (error) {
        console.error("Failed to update remembered status:", error);
      }
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  return (
    <div className="container">
      <div style={{ position: "fixed", top: "16px", left: "16px", zIndex: 50 }}>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 shadow"
        >
          単語一覧へ戻る
        </button>
      </div>
      <h2 className="text-xl font-bold mb-4">問題 {currentIndex + 1}</h2>
      <p className="text-lg mb-4">{currentVocab.word} の意味は？</p>

      <div className="option-container">
        {choices.map((choice, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(choice)}
            className={`option-button ${
              selectedAnswer
                ? choice === currentVocab.japanese_meaning
                  ? "correct"
                  : choice === selectedAnswer
                  ? "wrong"
                  : ""
                : ""
            }`}
            disabled={!!selectedAnswer}
          >
            {choice}
          </button>
        ))}
      </div>

      {selectedAnswer && isCorrect !== null && (
        <p
          className={`mt-4 text-lg font-semibold ${
            isCorrect ? "text-green-600" : "text-red-600"
          }`}
        >
          {isCorrect ? "正解！" : "不正解"}
        </p>
      )}

      {selectedAnswer && (
        <button
          onClick={handleNext}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
        >
          次の問題へ
        </button>
      )}
    </div>
  );
};

export default Quiz;

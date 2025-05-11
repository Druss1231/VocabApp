import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Volume2 } from "lucide-react";
import Flag from "react-world-flags";

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
  const location = useLocation();
  const vocab = location.state as Vocab;

  const [generatedSentence, setGeneratedSentence] = useState("");
  const [generatedMeaning, setGeneratedMeaning] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="container">
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
  );
};

export default Meaning;

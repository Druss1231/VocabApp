import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

function PageMain() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [rememberedCounts, setRememberedCounts] = useState<Record<number, number>>({});
  const [totalCounts, setTotalCounts] = useState<Record<number, number>>({});

  const levels = [300, 400, 500, 600, 700, 800, 900];

  // ユーザーIDを取得
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getUser();
  }, []);

  // vocabulary テーブルから各レベルの単語数を取得
  useEffect(() => {
    const fetchTotalCounts = async () => {
      const { data, error } = await supabase
        .from("vocabulary")
        .select("level");

      if (error || !data) {
        console.error("Error fetching vocabulary levels:", error);
        return;
      }

      const counts: Record<number, number> = {};
      data.forEach(({ level }) => {
        counts[level] = (counts[level] || 0) + 1;
      });
      setTotalCounts(counts);
    };

    fetchTotalCounts();
  }, []);

  // 覚えた単語数をレベルごとに取得
  useEffect(() => {
    if (!userId) return;

    const fetchRememberedCounts = async () => {
      const { data, error } = await supabase
        .from("remembered_words")
        .select("vocab_id")
        .eq("user_id", userId)
        .eq("remembered", true);

      if (error || !data) {
        console.error("Error fetching remembered words:", error);
        return;
      }

      const vocabIds = data.map((d) => d.vocab_id);

      const { data: vocabData, error: vocabError } = await supabase
        .from("vocabulary")
        .select("id, level")
        .in("id", vocabIds);

      if (vocabError || !vocabData) {
        console.error("Error fetching vocabulary data:", vocabError);
        return;
      }

      const counts: Record<number, number> = {};
      for (const { level } of vocabData) {
        counts[level] = (counts[level] || 0) + 1;
      }
      setRememberedCounts(counts);
    };

    fetchRememberedCounts();
  }, [userId]);

  return (
    <>
      <h1>レベル選択</h1>
      <ul className="list-group" style={{ listStyle: "none", padding: 0 }}>
        {levels.map((level) => {
          const remembered = rememberedCounts[level] || 0;
          const total = totalCounts[level] || 0;
          return (
            <li key={level} style={{ marginBottom: "12px" }}>
              <button
                className="card"
                onClick={() => navigate(`/${level}`)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "16px",
                  textAlign: "center",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  background: "#f9f9f9",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  {level}点レベル
                </div>
                <div style={{ fontSize: "0.9rem", color: "#555", marginTop: "4px" }}>
                  {remembered} / {total}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default PageMain;

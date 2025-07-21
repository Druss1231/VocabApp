import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div>
      <div
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 50,
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            backgroundColor: "#e53e3e", // 赤系
            color: "white",
            border: "none",
            borderRadius: 6,
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            cursor: "pointer",
            fontWeight: "600",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "#c53030"; // ホバー時濃い赤
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "#e53e3e";
          }}
        >
          ログアウト
        </button>
      </div>
      {children}
    </div>
  );
};

export default Layout;

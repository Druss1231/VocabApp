import React from "react"
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

type props = {
  children: React.ReactNode
}

const Layout = ({ children }: props) => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/login")
  };

  return (
    <div>
      <div style={{ position: "fixed", top: "16px", right: "16px", zIndex: 50 }}>
        <button onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 shadow"
>
          ログアウト
        </button>
      </div>
        {children}
    </div>
  )
};
export default Layout
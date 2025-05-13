// App.tsx
import "./App.css";
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Session } from "@supabase/supabase-js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from './pages/Authentication';
import Layout from "./pages/Layout";
import PageMain from "./pages/Pagemain";
import Page600 from "./pages/Page600";
import Page700 from "./pages/Page700";
import Page800 from "./pages/Page800";
import Page900 from "./pages/Page900";
import Meaning from "./pages/Meaning";

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (!session) return <Auth />
  
  ;

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="*" element={<PageMain />} />
          <Route path="/600" element={<Page600 />} />
          <Route path="/700" element={<Page700 />} />
          <Route path="/800" element={<Page800 />} />
          <Route path="/900" element={<Page900 />} />
          <Route path="/meaning" element={<Meaning />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

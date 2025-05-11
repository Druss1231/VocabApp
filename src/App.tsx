import "./App.css";
import PageMain from "./pages/Pagemain";
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Auth from './pages/Authentication';
import { Session } from "@supabase/supabase-js";

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

  return session ? <PageMain /> : <Auth />;
}

export default App;
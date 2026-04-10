import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const u = session?.user ?? null;
        setUser(u);
        if (u) {
          const { data } = await supabase.rpc("has_role", { _user_id: u.id, _role: "admin" });
          setIsAdmin(!!data);
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        const { data } = await supabase.rpc("has_role", { _user_id: u.id, _role: "admin" });
        setIsAdmin(!!data);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password });

  const signUp = (email: string, password: string, displayName?: string) =>
    supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: displayName ? { full_name: displayName } : undefined,
      },
    });

  const signOut = () => supabase.auth.signOut();

  return { user, isAdmin, loading, signIn, signUp, signOut };
}

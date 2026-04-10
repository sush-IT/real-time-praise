import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async () => {
    if (!email.trim() || !password) { toast.error("Fill all fields"); return; }
    setLoading(true);
    const { error } = isLogin
      ? await signIn(email.trim(), password)
      : await signUp(email.trim(), password);
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success(isLogin ? "Logged in!" : "Check your email to confirm signup");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="gradient-text">{isLogin ? "Admin Login" : "Sign Up"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-background" />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-background" />
          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {isLogin ? "Login" : "Sign Up"}
          </Button>
          <button className="text-xs text-muted-foreground hover:text-primary w-full text-center" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

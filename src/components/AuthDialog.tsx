import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async () => {
    if (!email.trim() || !password) { toast.error("Fill all fields"); return; }
    setLoading(true);
    const { error } = isLogin
      ? await signIn(email.trim(), password)
      : await signUp(email.trim(), password, displayName.trim() || undefined);
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success(isLogin ? "Logged in!" : "Account created successfully!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="gradient-text">{isLogin ? "Sign In" : "Create Account"}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isLogin ? "Sign in to rate and review projects" : "Create an account to start reviewing projects"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {!isLogin && (
            <Input
              placeholder="Display name (optional)"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={50}
              className="bg-background"
            />
          )}
          <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-background" />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-background" />
          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
          </Button>
          <button className="text-xs text-muted-foreground hover:text-primary w-full text-center" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

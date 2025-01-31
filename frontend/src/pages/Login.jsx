import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from    "../store/useAuthStore";
import { Layout } from "@/components/Layout";
import { LogIn, Mail, Lock } from "lucide-react";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, isLogginIn } = useAuthStore();
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    await login({ email, password });
  };
  return (
    <Layout>
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="w-full max-w-md space-y-8 bg-cinema-gray p-8 rounded-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-400">
              Please sign in to your account
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-cinema-red hover:bg-red-700"
              disabled={isLogginIn}
            >
              {isLogginIn ? (
                "Signing in..."
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" /> Sign In
                </>
              )}
            </Button>
            <p className="text-center text-sm text-gray-400">
              Don`&apos;`t have an account?{" "}
              <Button
                variant="link"
                className="text-cinema-red hover:text-red-400"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </Button>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
};
export default Login;

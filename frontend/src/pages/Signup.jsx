import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from    "../store/useAuthStore";
import { Layout } from "@/components/Layout";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import { toast } from "../hooks/use-toast";
const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const { signup, isSigningUp } = useAuthStore();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const { confirmPassword, ...signupData } = formData;
    await signup(signupData);
  };
  return (
    <Layout>
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="w-full max-w-md space-y-8 bg-cinema-gray p-8 rounded-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Create an account</h2>
            <p className="mt-2 text-sm text-gray-400">
              Sign up to start booking movies
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
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
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-cinema-red hover:bg-red-700"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                "Creating account..."
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" /> Sign Up
                </>
              )}
            </Button>
            <p className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Button
                variant="link"
                className="text-cinema-red hover:text-red-400"
                onClick={() => navigate("/login")}
              >
                Sign in
              </Button>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
};
export default Signup;
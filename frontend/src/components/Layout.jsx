import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { UserCircle } from "lucide-react";

export const Layout = ({ children  }) => {
  const navigate = useNavigate();
  const isAdmin = false; // TODO: Implement admin check

  return (
    <div className="min-h-screen bg-cinema-dark text-white">
      <nav className="border-b border-cinema-gray">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-cinema-red">
            CineBook
          </Link>
          <div className="flex items-center  gap-4">
            {isAdmin && (
              <Button
                variant="outline"
                onClick={() => navigate("/admin")}
                className="text-white hover:text-cinema-red"
              >
                Admin Dashboard
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => navigate("/profile")}
              className="text-white hover:text-cinema-red"
            >
              <UserCircle className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};
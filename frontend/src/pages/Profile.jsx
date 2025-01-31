 
import { Button } from "@/components/ui/button";
import { UserCircle, Film, LogOut, Mail, Edit2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const {authUser , logout} = useAuthStore();
  const navigate = useNavigate();
  // console.log(authUser);
  const handleLogout = async () => {
    // console.log("Logout clicked");
    logout();
  }
  const userDetails = {
    fullName: authUser.name,
    email: authUser.email,
    profilePic: "https://i.pravatar.cc/150?img=3",
    memberSince: "January 2024",
    totalBookings: 12
  };

  return (
    <Layout>
      <div className="flex h-full bg-[#121212]">
        {/* Sidebar */}
        <div className="w-64 bg-[#1a1a1a] border-r border-gray-800">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-200 mb-6">Dashboard</h2>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:bg-gray-800/50"
              >
                <UserCircle className="w-5 h-5 mr-3" />
                Profile
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:bg-gray-800/50"
                onClick = {() => navigate("/bookings")}
              >
                <Film className="w-5 h-5 mr-3" />
                My Bookings
              </Button>
              <Separator className="my-4 bg-gray-800" />
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:bg-red-500/10"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 mr-3"   />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 bg-[#121212]">
          <div className="max-w-4xl mx-auto">
            <Card className="relative overflow-visible bg-[#1a1a1a] border-gray-800">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="relative mb-6">
                    <img
                      src={userDetails.profilePic}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover ring-4 ring-gray-800 shadow-lg"
                    />
                    {/* <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-300 shadow-sm">
                      Member since {userDetails.memberSince}
                    </div> */}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-100 mb-2">
                    {userDetails.fullName}
                  </h1>
                  <div className="flex items-center text-gray-400 mb-6">
                    <Mail className="w-4 h-4 mr-2" />
                    {userDetails.email}
                  </div>
                  <div className="grid grid-cols-2 gap-8 w-full max-w-xs">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-100">
                        {userDetails.totalBookings}
                      </div>
                      <div className="text-sm text-gray-400">Total Bookings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-100">
                        ⭐️ 4.8
                      </div>
                      <div className="text-sm text-gray-400">Rating</div>
                    </div>
                  </div>
                </div>

                {/* Edit Profile Button - Bottom Right */}
                <div className="absolute bottom-4 right-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800/50"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
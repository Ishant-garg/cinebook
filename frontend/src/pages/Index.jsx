import { Layout } from "@/components/Layout";
import { MovieCard } from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Ticket } from "lucide-react";
import useMovieStore from "../store/useMovieStore";
import { useEffect, useState } from "react";

const comingSoon = [
  {
    id: "5",
    title: "Dune: Part Two",
    imageUrl: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
    rating: 4.5,
    genre: "Sci-Fi",
  },
  {
    id: "6",
    title: "Deadpool 3",
    imageUrl: "https://image.tmdb.org/t/p/w500/4JeejGugONWpJkbnvL12hVoYEDa.jpg",
    rating: 4.6,
    genre: "Action",
  },
];

const Index = () => {
  const { movies, isLoading, fetchMovies } = useMovieStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center h-screen space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cinema-red"></div>
          <p className="text-lg text-gray-400">Loading amazing movies for you...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section with Quick Actions */}
      <section className="relative h-[70vh] mb-16 rounded-lg overflow-hidden">
        <img
          src="https://image.tmdb.org/t/p/original/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg"
          alt="Featured Movie"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
          <div className="absolute bottom-0 left-0 p-8 space-y-6 w-full">
            <h1 className="text-5xl font-bold">Dune: Part Two</h1>
            <p className="text-xl text-gray-200 max-w-2xl">
              Continue the journey beyond fear in the next chapter of Denis Villeneuve's epic saga.
            </p>
            <div className="flex gap-4">
              <Button className="bg-cinema-red hover:bg-red-700 flex items-center gap-2">
                <Ticket className="w-5 h-5" />
                Book Now
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Set Reminder
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search movies..."
          className="w-full pl-10 pr-4 py-3 bg-cinema-gray rounded-lg focus:ring-2 focus:ring-cinema-red focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Now Showing */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Now Showing</h2>
            <p className="text-gray-400 mt-1">Watch these amazing movies today</p>
          </div>
          <Button variant="outline" className="hover:bg-cinema-red hover:text-white transition-colors">
            View All
          </Button>
        </div>
        {filteredMovies.length === 0 ? (
          <div className="text-center py-12 bg-cinema-gray rounded-lg">
            <p className="text-xl text-gray-400">No movies found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie._id} {...movie} />
            ))}
          </div>
        )}
      </section>

      {/* Coming Soon */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Coming Soon</h2>
            <p className="text-gray-400 mt-1">Exciting releases on the horizon</p>
          </div>
          <Button variant="outline" className="hover:bg-cinema-red hover:text-white transition-colors">
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {comingSoon.map((movie) => (
            <MovieCard key={movie.id} {...movie} />
          ))}
        </div>
      </section>

      {/* Promotions */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-2">Special Offers</h2>
        <p className="text-gray-400 mb-8">Exclusive deals and discounts for our valued customers</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group bg-cinema-gray rounded-lg p-8 space-y-4 hover:bg-cinema-red transition-colors duration-300 cursor-pointer">
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-semibold group-hover:text-white">Student Discount</h3>
              <span className="text-3xl font-bold text-cinema-red group-hover:text-white">20%</span>
            </div>
            <p className="text-gray-400 group-hover:text-gray-200">
              Show your valid student ID and get 20% off on all movie tickets. Perfect for those study breaks!
            </p>
            <Button 
              variant="outline" 
              className="group-hover:bg-white group-hover:text-cinema-red transition-colors"
            >
              Learn More
            </Button>
          </div>
          <div className="group bg-cinema-gray rounded-lg p-8 space-y-4 hover:bg-cinema-red transition-colors duration-300 cursor-pointer">
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-semibold group-hover:text-white">Family Package</h3>
              <span className="text-3xl font-bold text-cinema-red group-hover:text-white">15%</span>
            </div>
            <p className="text-gray-400 group-hover:text-gray-200">
              Bring the whole family! Special rates for family bookings of 4 or more. Includes popcorn and drinks.
            </p>
            <Button 
              variant="outline"
              className="group-hover:bg-white group-hover:text-cinema-red transition-colors"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
import { Layout } from "@/components/Layout";
import { MovieCard } from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import useMovieStore from "../store/useMovieStore";
import { useEffect } from "react";

// Mock data - replace with API calls later
// const movies = [
//   {
//     id: "1",
//     title: "Inception",
//     imageUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
//     rating: 4.8,
//     genre: "Sci-Fi",
//   },
//   {
//     id: "2",
//     title: "The Dark Knight",
//     imageUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
//     rating: 4.9,
//     genre: "Action",
//   },
//   {
//     id: "3",
//     title: "Pulp Fiction",
//     imageUrl: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
//     rating: 4.7,
//     genre: "Crime",
//   },
//   {
//     id: "4",
//     title: "The Shawshank Redemption",
//     imageUrl: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
//     rating: 4.9,
//     genre: "Drama",
//   },
// ];

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
  const { movies, isLoading , fetchMovies } = useMovieStore();

  useEffect(() => {
    fetchMovies(); // Fetch movies when the component mounts
  }, [fetchMovies]);
  if(isLoading){
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cinema-red"></div>
        </div>
      </Layout>
    )
  }
   return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[60vh] mb-16 rounded-lg overflow-hidden">
        <img
          src="https://image.tmdb.org/t/p/original/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg"
          alt="Featured Movie"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
          <div className="absolute bottom-0 left-0 p-8 space-y-4">
            <h1 className="text-5xl font-bold">Dune: Part Two</h1>
            <p className="text-xl text-gray-200 max-w-2xl">
              Continue the journey beyond fear in the next chapter of Denis Villeneuve`&apos;`s epic saga.
            </p>
            <Button className="bg-cinema-red hover:bg-red-700">Book Now</Button>
          </div>
        </div>
      </section>

      {/* Now Showing */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Now Showing</h2>
          <Button variant="outline">View All</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie._id} {...movie} />
          ))}
        </div>
      </section>

      {/* Coming Soon */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Coming Soon</h2>
          <Button variant="outline">View All</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {comingSoon.map((movie) => (
            <MovieCard key={movie.id} {...movie} />
          ))}
        </div>
      </section>

      {/* Promotions */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Special Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-cinema-gray rounded-lg p-6 space-y-4">
            <h3 className="text-2xl font-semibold">Student Discount</h3>
            <p className="text-gray-400">Get 20% off on all movie tickets with your student ID</p>
            <Button variant="outline">Learn More</Button>
          </div>
          <div className="bg-cinema-gray rounded-lg p-6 space-y-4">
            <h3 className="text-2xl font-semibold">Family Package</h3>
            <p className="text-gray-400">Special rates for family bookings of 4 or more</p>
            <Button variant="outline">Learn More</Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import TheatreList from "../components/TheatreList";
import YouTube from "react-youtube";
import useMovieStore from  "../store/useMovieStore";

const MovieDetails = () => {
  const { id } = useParams(); // Get movie ID from URL parameters
  const { movieDetails, isLoading, fetchMovieDetails } = useMovieStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);
    console.log(id);
  useEffect(() => {
    if (id) {
      fetchMovieDetails(id); // Fetch movie details when the page loads
    }
  }, [id, fetchMovieDetails]);
  // console.log(movieDetails.movie);
  if(isLoading){
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cinema-red"></div>
        </div>
      </Layout>
    )
  }

  if (!movieDetails || Object.keys(movieDetails).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>No movie details found.</span> {/* Show a message if movie details are missing */}
      </div>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <div
        className="relative rounded-lg min-h-[60vh]   bg-cover bg-center"
        style={{
          backgroundImage: `url(${movieDetails.imageUrl})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-black/70  "  style={{ backdropFilter: "blur(50px)" }} />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="grid md:grid-cols-[300px,1fr] gap-8 items-start">
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
              <img
                src={movieDetails.imageUrl}
                alt={movieDetails.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-16 h-16 rounded-full bg-black/50 hover:bg-black/70"
                  onClick={() => setShowTrailer(true)}
                >
                  <span className="sr-only">Play trailer</span>
                  <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1" />
                </Button>
              </div>
            </div>

            {/* Movie Details */}
            <div className="space-y-6 text-white">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-xs border rounded">
                    {movieDetails.certification}
                  </span>
                  <span className="text-sm">•</span>
                  <span>{movieDetails.duration}</span>
                  <span className="text-sm">•</span>
                  <span>{movieDetails.releaseDate}</span>
                </div>
                <h1 className="text-4xl font-bold">{movieDetails.title}</h1>
                <div className="flex items-center gap-2 text-sm">
                  {movieDetails.genres.join(", ")}
                  <span className="text-sm">•</span>
                  {movieDetails.languages.join(", ")}
                </div>
              </div>
              <p className="text-lg text-gray-200 max-w-3xl">{movieDetails.description}</p>
              <Button variant="default" className="bg-cinema-red hover:bg-red-700">
                Book Tickets
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* YouTube Trailer Modal */}
      {showTrailer && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-10 right-0 text-white"
              onClick={() => setShowTrailer(false)}
            >
              ✕
            </Button>
            <YouTube
              videoId={movieDetails.trailerVideoId}
              opts={{
                width: "100%",
                playerVars: {
                  autoplay: 1,
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Booking Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="space-y-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search for cinema"
              className="w-full max-w-md pl-10 pr-4 py-2 rouded-lg  bg-white/5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="border-gray-700">
              Languages
            </Button>
            <Button variant="outline" className="border-gray-700">
              Formats
            </Button>
            <Button variant="outline" className="border-gray-700">
              Experiences
            </Button>
            <Button variant="outline" className="border-gray-700">
              Accessibility
            </Button>
            <Button variant="outline" className="border-gray-700">
              Select Special Tags
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="h-3 w-3 rounded-full bg-green-500" /> Available
              <span className="h-3 w-3 rounded-full bg-yellow-500" /> Filling
              Fast
              <span className="h-3 w-3 rounded-full bg-red-500" /> Sold Out
              <span className="h-3 w-3 rounded-full bg-gray-500" /> Lapsed
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                Subtitle
              </Button>
              <Button variant="ghost" size="sm">
                Accessibility
              </Button>
            </div>
          </div>
        </div>

        <TheatreList movieId={id } />
      </div>
    </Layout>
  );
};

export default MovieDetails;

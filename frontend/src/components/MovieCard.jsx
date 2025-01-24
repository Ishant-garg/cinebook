import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export const MovieCard = ({ _id, title, imageUrl, rating, genre }) => {
  const navigate = useNavigate();
 
  return (

    <Card className="group relative overflow-hidden bg-cinema-gray hover:scale-105 transition-transform duration-300">
      <div className="aspect-[2/3] relative">
        <img
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
            <p className="text-sm text-gray-300 mb-2">
              {genre} • ⭐ {rating}
            </p>
            <Button
              onClick={() => navigate(`/movie/${_id}`)}
              className="w-full bg-cinema-red hover:bg-red-700 text-white"
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

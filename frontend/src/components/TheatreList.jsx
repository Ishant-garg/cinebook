import { Button } from "./ui/button";
import { useState } from "react";
import { Card } from "./ui/card";
import { useNavigate } from "react-router-dom";
import useStore from "../store/useStore";

const theatres = [
  {
    id: "1",
    name: "Cinema City",
    location: "Downtown",
    showTimes: ["10:00 AM", "2:00 PM", "6:00 PM", "9:00 PM"],
  },
  {
    id: "2",
    name: "Starlight Theatre",
    location: "West End",
    showTimes: ["11:00 AM", "3:00 PM", "7:00 PM", "10:00 PM"],
  },
];

const TheatreList = ({ movieId }) => {
  const navigate = useNavigate();
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  
  const setStoreTheatre = useStore((state) => state.setSelectedTheatre);
  const setStoreShowtime = useStore((state) => state.setSelectedShowtime);

  const handleShowtimeSelect = (theatreId, showtime) => {
    setSelectedTheatre(theatreId);
    setSelectedShowtime(showtime);
    
    const theatre = theatres.find(t => t.id === theatreId);
    setStoreTheatre(theatre);
    setStoreShowtime(showtime);
    
    navigate(`/movie/${movieId}/booking`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Select Theatre & Showtime</h2>
      <div className="grid gap-4">
        {theatres.map((theatre) => (
          <Card key={theatre.id} className="p-4 bg-cinema-gray">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-xl font-semibold">{theatre.name}</h3>
                <p className="text-gray-400">{theatre.location}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {theatre.showTimes.map((time) => (
                  <Button
                    key={`${theatre.id}-${time}`}
                    variant={
                      selectedTheatre === theatre.id && selectedShowtime === time
                        ? "default"
                        : "outline"
                    }
                    className={
                      selectedTheatre === theatre.id && selectedShowtime === time
                        ? "bg-cinema-red hover:bg-red-700"
                        : "hover:bg-cinema-red/10"
                    }
                    onClick={() => handleShowtimeSelect(theatre.id, time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TheatreList;
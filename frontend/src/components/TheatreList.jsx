import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Accordion, AccordionItem } from "./ui/accordion"; // Use an accordion component
import useTheaterStore from  "../store/useTheaterStore";
import { AccordionContent, AccordionTrigger } from "@radix-ui/react-accordion";
import { MinusCircleIcon, MinusIcon, MinusSquareIcon, Plus, PlusCircleIcon, PlusIcon, X } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

const TheatreList = ({ movieId }) => {
  const {
    theaters,
    showsByTheater,
    selectedDate,
    isLoading,
    fetchTheatersByDate,
    fetchShowsByTheater,
    setSelectedDate,
  } = useTheaterStore();
  const navigate = useNavigate();
  // Calculate the next 3 dates (today and next 2 days)
  const dates = Array.from({ length: 3 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

 // Fetch theaters when the selected date or movieId changes
useEffect(() => {
  
    fetchTheatersByDate(selectedDate.toISOString().split("T")[0] ,  movieId ); // Pass both date and movieId
    console.log(theaters);
}, [selectedDate ]);

  const handleAccordionClick = (theaterId) => {
    // Fetch shows for the theater if not already fetched
    
    fetchShowsByTheater(theaterId, selectedDate.toISOString().split("T")[0]);
    
    console.log(theaterId , showsByTheater );
  };
  const handleShowClick = (showId) => { 
    console.log(showId);
    navigate(`/seat-selection/${showId}`);
    // Navigate(`/seat-selection/${showId}`);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Select Date and Theatre</h2>

      {/* Date Selector */}
      <div className="flex space-x-4 mb-4">
        {dates.map((date) => (
          <Button
            key={date.toISOString()}
            onClick={() => setSelectedDate(date)}
            variant={selectedDate.toDateString() === date.toDateString() ? "default" : "outline"}
          >
            {date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" })}
          </Button>
        ))}
      </div>

   
      {/* Theater Accordion */}
    
     
 
<Accordion type="single" collapsible className="w-full bg-transparent  ">
  {theaters.length === 0 && (
    <p className="text-gray-400 text-center py-4">No theaters found for the selected date.</p>
  )}
  {theaters.map((theater) => (
    <AccordionItem
      key={theater._id}
      value={theater._id}
      className="border-b last:border-none mb-2"
    >
      <AccordionTrigger className="flex justify-between items-center w-full  py-4 px-6 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
        <div className="text-gray-200 font-medium">
          {`${theater.name}, ${theater.location}`}
        </div>
        {/* Render dynamic icon */}
        {showsByTheater[theater._id] ? (
          <Plus className="w-5 h-5 text-gray-200" />
        ) : (
          <PlusIcon className="w-5 h-5 text-gray-200" />
        )}
      </AccordionTrigger>
      <AccordionContent className="px-6 py-4 bg-black/15 mt-1 rounded-lg rounded-b-lg">
        {showsByTheater[theater._id] ? (
          showsByTheater[theater._id]
            .sort((a, b) => new Date(a.showTime) - new Date(b.showTime))
            .map((show) => (
              <div
                key={show._id}
                className="flex justify-between items-center py-2 border-b last:border-none"
              >
                <span className="text-gray-300">
                  {new Date(show.showTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <Button
                  variant="outline"
                  className="text-cinema-light border-cinema-red hover:bg-cinema-red "
                  onClick={() => handleShowClick(show._id)}
                >
                  Book
                </Button>
              </div>
            ))
        ) : (
          <p className="text-gray-400">Loading shows...</p>
        )}
      </AccordionContent>
    </AccordionItem>
  ))}
</Accordion> 


    </div>
  );
};

export default TheatreList;

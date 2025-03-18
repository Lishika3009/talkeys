"use client";

import type React from "react";
import { useState, useCallback, memo, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import placeholderImage from "@/public/images/events.jpg";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ParticularEventPage from "@/components/ParticularEventPage";
import type { Event } from "@/types/types";
import { useMediaQuery } from "react-responsive";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { cn } from "@/lib/utils";


// import { useRouter } from "next/navigation";

interface EventCarouselProps {
  category?: string;
  ev?: Event[];
}


interface EventCardProps {
  event: Event;
  index: number;
  onFetchEventById: (eventId: string) => void;
}


const EventCard = memo(function EventCard({
  event,
  index,
  onFetchEventById,
}: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
          opacity: 1,
          y: 0,
          transition: {
            delay: i * 0.1,
            duration: 0.5,
            ease: "easeOut",
          },
        }),
      }}
      className="h-full"
    >
      <CardContainer
        className="w-full h-full py-0"
        containerClassName="py-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardBody
          className={cn(
            "w-full h-full rounded-xl overflow-hidden border border-gray-800 bg-gray-900/80",
            isHovered ? "shadow-lg shadow-purple-500/20" : ""
          )}
        >
          <div className="relative w-full h-full flex flex-col">
            <CardItem
              translateZ={50}
              className="relative w-full aspect-square overflow-hidden"
            >
              <Image
                src={event.photographs?.[0] ?? placeholderImage}
                alt={event.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={index < 4}
                loading={index < 4 ? "eager" : "lazy"}
                className="object-cover object-center transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70" />

              <CardItem
                translateZ="60"
                className="absolute bottom-0 left-0 right-0 p-3"
              >
                <div className="text-sm text-purple-300 font-medium">
                  {new Date(event.startDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  {" • "}
                  {event.startTime}
                </div>
              </CardItem>

              <CardItem
                translateZ="60"
                className={cn(
                  "absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-md",
                  event.isLive
                    ? "bg-green-500/80 text-white"
                    : "bg-red-500/80 text-white"
                )}
              >
                {event.isLive ? "Live" : "Ended"}
              </CardItem>
            </CardItem>

            <CardItem translateZ={30} className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-bold mb-2 line-clamp-2 text-white">
                {event.name}
              </h3>
              <p className="text-gray-400 mb-4 line-clamp-1">
                {event.location ?? "Location not specified"}
              </p>
              <div className="mt-auto">
                <CardItem translateZ="50">
                  <Button
                    variant="outline"
                    className="w-full hover:bg-purple-600 hover:text-white transition-colors duration-300 border-purple-500/50"
                    onClick={() => {
                      onFetchEventById(event._id);
                    }}
                  >
                    More info
                  </Button>
                </CardItem>
              </div>
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    </motion.div>
  );
});

EventCard.displayName = "EventCard";


const EventCarousel: React.FC<EventCarouselProps> = ({
  category = "ALL Events",
  ev = [],
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });

  const sortedEvents = [...ev].sort((a, b) => {
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();
    return dateA - dateB;
  });

 
  const handleFetchEventById = useCallback(async (eventId: string) => {
    try {
      const response = await fetch(
        `${process.env.BACKEND_URL}/getEventById/${eventId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch event details");
      }

      const data = await response.json();
      setSelectedEvent(data.data);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching event by ID:", error);
    }
  }, []);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
  }, []);

  return (
    <div className="mb-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full bg-transparent text-white py-6">
        <div className="flex justify-between items-center mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <div className="w-1 h-6 bg-purple-500 mr-3 rounded-full"></div>
            <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
              {category ?? "Upcoming Events"}
            </h2>
          </motion.div>
        </div>

        {sortedEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedEvents.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <EventCard
                  event={event}
                  index={index}
                  onFetchEventById={handleFetchEventById}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="pl-2 md:pl-4 basis-full">
            <div className="flex justify-center items-center h-40 bg-purple-900/25 rounded-lg">
              <p className="text-gray-400">No Upcoming Events Currently</p>
            </div>
          </div>
        )}

        <AnimatePresence>
          {selectedEvent && isDialogOpen && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent
                ref={dialogRef}
                className="max-w-5xl max-h-[90vh] overflow-y-auto border-none mt-6 scrollbar-hide custom-scrollbar p-0 bg-transparent"
                style={{ marginTop: isMobile ? "4rem" : "1.5rem" }}
              >
                
                <ParticularEventPage
                  event={selectedEvent}
                  onClose={handleCloseDialog}
                />
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default memo(EventCarousel);

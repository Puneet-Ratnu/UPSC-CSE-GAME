import { STORY_SEGMENTS, UserStats } from "@/lib/gameLogic";
import mapImage from "@assets/generated_images/fantasy_adventure_map_background.png";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

interface StoryMapProps {
  stats: UserStats;
}

export function StoryMap({ stats }: StoryMapProps) {
  // Find current story segment
  const currentSegment = STORY_SEGMENTS.slice().reverse().find(s => stats.level >= s.level) || STORY_SEGMENTS[0];
  const nextSegment = STORY_SEGMENTS.find(s => s.level > stats.level);

  return (
    <div className="w-full bg-card rounded-3xl overflow-hidden border border-border shadow-md mt-8">
      <div className="relative h-64 w-full bg-muted">
        <img 
          src={mapImage} 
          alt="Adventure Map" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-center gap-2 mb-2 text-yellow-300 font-bold uppercase tracking-wider text-xs">
            <MapPin className="w-4 h-4" />
            Current Location
          </div>
          <h3 className="text-2xl font-display font-bold mb-1">{currentSegment.title}</h3>
          <p className="text-white/80 text-sm max-w-lg leading-relaxed">
            {currentSegment.text}
          </p>
        </div>
      </div>
      
      {nextSegment && (
        <div className="bg-primary/5 p-4 flex justify-between items-center text-sm font-medium">
          <span className="text-muted-foreground">Next Destination: <span className="text-foreground font-bold">{nextSegment.title}</span></span>
          <span className="bg-white px-3 py-1 rounded-full shadow-sm text-primary font-bold">
            Lvl {nextSegment.level}
          </span>
        </div>
      )}
    </div>
  );
}

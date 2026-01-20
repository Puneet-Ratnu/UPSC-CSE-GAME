import { AVATAR_UNLOCKS, UserStats, STORY_SEGMENTS } from "@/lib/gameLogic";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, User, ScrollText } from "lucide-react";
import avatarImage from "@assets/generated_images/cute_chibi_avatar_character.png";

interface SkinSelectorProps {
  stats: UserStats;
}

export function SkinSelector({ stats }: SkinSelectorProps) {
  // Find current story
  const currentStory = STORY_SEGMENTS.slice().reverse().find(s => stats.level >= s.level) || STORY_SEGMENTS[0];

  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2 rounded-xl bg-white/50 border-primary/20 hover:bg-white hover:border-primary/50 transition-all shadow-sm">
            <ScrollText className="w-4 h-4 text-secondary" />
            <span>Story</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-center flex items-center justify-center gap-2">
              <ScrollText className="w-6 h-6 text-secondary" />
              Your Legend
            </DialogTitle>
            <DialogDescription className="text-center italic">
              "The tale of a hero who conquered their to-do list..."
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 p-6 bg-secondary/5 rounded-2xl border-2 border-dashed border-secondary/20">
            <h3 className="font-display text-xl text-secondary mb-2">{currentStory.title}</h3>
            <p className="text-foreground leading-relaxed">{currentStory.text}</p>
            <div className="mt-4 pt-4 border-t border-secondary/10 flex justify-between items-center text-xs font-bold text-muted-foreground uppercase">
              <span>Chapter {STORY_SEGMENTS.indexOf(currentStory) + 1}</span>
              <span>Level {stats.level}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2 rounded-xl bg-white/50 border-primary/20 hover:bg-white hover:border-primary/50 transition-all shadow-sm">
            <User className="w-4 h-4 text-primary" />
            <span>Skins</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-center">Character Skins</DialogTitle>
            <DialogDescription className="text-center">
              Unlock new looks as you level up!
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            {AVATAR_UNLOCKS.map((skin) => {
              const isUnlocked = stats.level >= skin.level;
              
              return (
                <div 
                  key={skin.name}
                  className={`
                    relative p-4 rounded-xl border-2 flex flex-col items-center text-center gap-3 transition-all
                    ${isUnlocked 
                      ? "bg-white border-primary/30 shadow-sm cursor-pointer hover:border-primary hover:shadow-md" 
                      : "bg-muted/50 border-dashed border-muted-foreground/30 opacity-70 grayscale"}
                  `}
                >
                  <div className="w-16 h-16 rounded-full bg-secondary/10 overflow-hidden flex items-center justify-center">
                    {isUnlocked ? (
                      <img src={avatarImage} alt={skin.name} className="w-full h-full object-cover" />
                    ) : (
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-sm">{skin.name}</h4>
                    <p className="text-xs text-muted-foreground">{skin.description}</p>
                  </div>
                  
                  {!isUnlocked && (
                    <div className="absolute top-2 right-2 text-[10px] font-bold bg-muted-foreground text-white px-1.5 py-0.5 rounded-full">
                      Lvl {skin.level}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { 
  UserStats, 
  Pet, 
  PET_SPECIES,
  triggerConfetti
} from "@/lib/gameLogic";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  PawPrint, 
  Utensils, 
  ShieldCheck, 
  Sparkles,
  Heart,
  TrendingUp,
  Store
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PetSystemProps {
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

export function PetSystem({ stats, setStats }: PetSystemProps) {
  const { toast } = useToast();
  const activePet = stats.pets.find(p => p.id === stats.activePetId);

  const buyItem = (type: 'food' | 'gear' | 'decoration', cost: number, name: string) => {
    if (stats.xp < cost) {
      toast({
        title: "Not enough XP",
        description: "Complete more tasks to earn XP for your pet!",
        variant: "destructive"
      });
      return;
    }

    if (!activePet) {
      toast({
        title: "No active pet",
        description: "Assign a pet first to buy items!",
        variant: "destructive"
      });
      return;
    }

    setStats(prev => {
      const nextPets = prev.pets.map(p => {
        if (p.id === prev.activePetId) {
          if (type === 'food') return { ...p, level: p.level + 0.1, xp: p.xp + 20 };
          if (type === 'gear') return { ...p, gear: [...p.gear, name] };
          if (type === 'decoration') return { ...p, decorations: [...p.decorations, name] };
        }
        return p;
      });

      toast({
        title: "Purchase Successful!",
        description: `Bought ${name} for your ${activePet.species}!`,
      });

      return {
        ...prev,
        xp: prev.xp - cost,
        pets: nextPets
      };
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 rounded-xl bg-white/50 border-pink-200 hover:bg-white hover:border-pink-400 transition-all shadow-sm">
          <PawPrint className="w-4 h-4 text-pink-500" />
          <span>Pets</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-display text-3xl flex items-center gap-3">
            <PawPrint className="w-8 h-8 text-pink-500" />
            Mythic Sanctuary
          </DialogTitle>
          <DialogDescription>
            Your mythic companions grow stronger as you master your Mains Answer Writing.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          {!activePet ? (
            <div className="text-center py-12 bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
              <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-display font-medium">Link your Apple ID to receive your first Mythic Pet!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Pet Profile */}
              <div className="bg-gradient-to-br from-pink-50 to-orange-50 p-6 rounded-3xl border border-pink-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <PawPrint className="w-24 h-24" />
                </div>
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-24 h-24 bg-white rounded-2xl shadow-md flex items-center justify-center border border-pink-100">
                    <span className="text-4xl">
                      {activePet.species === 'Phoenix' && '🔥'}
                      {activePet.species === 'Dragon' && '🐲'}
                      {activePet.species === 'Griffin' && '🦅'}
                      {activePet.species === 'Kitsune' && '🦊'}
                      {activePet.species === 'Pegasus' && '🦄'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-display font-bold text-pink-700">{activePet.name}</h3>
                    <p className="text-sm text-pink-600/70 font-medium">Level {Math.floor(activePet.level)} {activePet.species}</p>
                    <div className="mt-3 space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold uppercase text-pink-600">
                        <span>Growth Progress</span>
                        <span>{Math.round((activePet.level % 1) * 100)}%</span>
                      </div>
                      <Progress value={(activePet.level % 1) * 100} className="h-2 bg-pink-100" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pet Shop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                    <Utensils className="w-4 h-4" /> Feeding Station
                  </h4>
                  <div className="grid gap-2">
                    <Button 
                      variant="outline" 
                      className="justify-between h-14 rounded-2xl"
                      onClick={() => buyItem('food', 50, 'Ambrosia Pellets')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-pink-100 rounded-lg"><Sparkles className="w-4 h-4 text-pink-500" /></div>
                        <div className="text-left">
                          <p className="text-sm font-bold">Ambrosia</p>
                          <p className="text-[10px] text-muted-foreground">Boost growth</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-primary">50 XP</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Armory & Decor
                  </h4>
                  <div className="grid gap-2">
                    <Button 
                      variant="outline" 
                      className="justify-between h-14 rounded-2xl"
                      onClick={() => buyItem('gear', 150, 'Golden Saddle')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg"><TrendingUp className="w-4 h-4 text-orange-500" /></div>
                        <div className="text-left">
                          <p className="text-sm font-bold">Golden Saddle</p>
                          <p className="text-[10px] text-muted-foreground">Epic Gear</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-primary">150 XP</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Inventory */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-muted-foreground">Equipped & Decorated</h4>
                <div className="flex flex-wrap gap-2">
                  {activePet.gear.map((g, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100">{g}</span>
                  ))}
                  {activePet.decorations.map((d, i) => (
                    <span key={i} className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100">{d}</span>
                  ))}
                  {activePet.gear.length === 0 && activePet.decorations.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">No items yet...</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

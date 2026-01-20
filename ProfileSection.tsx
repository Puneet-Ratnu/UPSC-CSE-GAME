import { 
  UserStats, 
  triggerConfetti, 
  MILESTONE_REWARDS, 
  SPECIAL_TRIGGERS,
  PET_SPECIES,
  Pet
} from "@/lib/gameLogic";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Apple, CheckCircle2, Mail, Bell, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface ProfileSectionProps {
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

export function ProfileSection({ stats, setStats }: ProfileSectionProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAppleModalOpen, setIsAppleModalOpen] = useState(false);
  const { toast } = useToast();

  // Monthly Pet Reward Checker
  useEffect(() => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;
    
    if (isLoggedIn && stats.lastPetMonthlyReward !== currentMonth) {
      const species = PET_SPECIES[Math.floor(Math.random() * PET_SPECIES.length)];
      const newPet: Pet = {
        id: `monthly-${Date.now()}`,
        name: `Moon-${species}`,
        species,
        level: 1,
        xp: 0,
        gear: [],
        decorations: []
      };

      setStats(prev => ({
        ...prev,
        pets: [...prev.pets, newPet],
        lastPetMonthlyReward: currentMonth
      }));

      toast({
        title: "🌙 Monthly Companion Arrived!",
        description: `You've won a random monthly pet: ${species}!`,
        className: "bg-purple-600 text-white"
      });
    }
  }, [isLoggedIn, stats.lastPetMonthlyReward]);

  const handleAppleLogin = () => {
    // Simulating login
    setTimeout(() => {
      setIsLoggedIn(true);
      setIsAppleModalOpen(false);
      
      // Assign first pet on login
      const species = PET_SPECIES[Math.floor(Math.random() * PET_SPECIES.length)];
      const firstPet: Pet = {
        id: `initial-${Date.now()}`,
        name: `Alpha-${species}`,
        species,
        level: 1,
        xp: 0,
        gear: [],
        decorations: []
      };

      setStats(prev => ({
        ...prev,
        pets: [firstPet],
        activePetId: firstPet.id
      }));

      triggerConfetti();
      toast({
        title: "Apple ID Linked!",
        description: `Welcome adventurer! Your first mythic pet ${species} has joined you. Weekly reports will be sent to your email.`,
      });
    }, 1000);
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className={`rounded-full h-12 w-12 border-2 ${isLoggedIn ? 'border-green-400 bg-green-50' : 'border-dashed border-muted-foreground/30'}`}
        onClick={() => setIsAppleModalOpen(true)}
      >
        {isLoggedIn ? <CheckCircle2 className="w-6 h-6 text-green-600" /> : <Apple className="w-6 h-6 text-muted-foreground" />}
      </Button>

      <Dialog open={isAppleModalOpen} onOpenChange={setIsAppleModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-bold flex items-center gap-2">
              <Apple className="w-6 h-6" />
              {isLoggedIn ? "Account Linked" : "Link Apple Account"}
            </DialogTitle>
            <DialogDescription>
              {isLoggedIn 
                ? "Your progress is synced and weekly reports are active." 
                : "Sync your journey across devices and receive weekly performance analysis."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-4">
            {isLoggedIn ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-2xl space-y-3">
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>Weekly Reports: Active</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <Bell className="w-4 h-4 text-primary" />
                    <span>Milestone Notifications: Enabled</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full rounded-xl" onClick={() => setIsLoggedIn(false)}>
                  Unlink Account
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Button 
                  className="w-full h-14 rounded-2xl bg-black text-white hover:bg-black/90 font-bold flex items-center justify-center gap-3"
                  onClick={handleAppleLogin}
                >
                  <Apple className="w-6 h-6 fill-white" />
                  Continue with Apple
                </Button>
                <p className="text-[10px] text-center text-muted-foreground px-6">
                  By continuing, you agree to receive weekly gamified progress reports and milestone alerts via your Apple ID email.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

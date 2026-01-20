import { 
  UserStats, 
  CRAFT_RECIPES, 
  ResourceType, 
  CraftItem,
  triggerConfetti,
  HIDDEN_REWARDS,
  ItemClass
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
  Hammer, 
  Package, 
  Gem, 
  Flame, 
  Anvil, 
  Sparkles,
  ShieldAlert,
  ArrowUpCircle,
  Trophy
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface CraftingSystemProps {
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

export function CraftingSystem({ stats, setStats }: CraftingSystemProps) {
  const { toast } = useToast();

  const handleForge = (recipe: Omit<CraftItem, 'isForged'>) => {
    const canForge = recipe.requirements.every(req => 
      stats.inventory[req.resource] >= req.count
    );

    if (!canForge) {
      toast({
        title: "Insufficient Materials",
        description: "You need more resources to forge this item.",
        variant: "destructive"
      });
      return;
    }

    setStats(prev => {
      const nextInventory = { ...prev.inventory };
      recipe.requirements.forEach(req => {
        nextInventory[req.resource] -= req.count;
      });

      const newItem: CraftItem = { ...recipe, id: `${recipe.id}-${Date.now()}`, isForged: true };
      
      triggerConfetti();
      toast({
        title: "✨ Item Forged!",
        description: `Successfully crafted the ${recipe.name}!`,
        className: "bg-green-500 text-white border-none"
      });

      const updatedCrafted = [...prev.craftedItems, newItem];
      
      // Check for hidden reward if 50+ divine/transcendental items
      const divineOrAbove = updatedCrafted.filter(i => i.class === 'Divine' || i.class === 'Transcendental').length;
      let nextHidden = prev.hiddenRewards;
      if (divineOrAbove >= 50 && Math.random() > 0.5) {
        const unearned = HIDDEN_REWARDS.filter(r => !prev.hiddenRewards.includes(r));
        if (unearned.length > 0) {
          const reward = unearned[Math.floor(Math.random() * unearned.length)];
          nextHidden = [...prev.hiddenRewards, reward];
          toast({
            title: "🌟 UNKNOWN REWARD DISCOVERED!",
            description: `You've found the legendary: ${reward}`,
            className: "bg-yellow-500 text-white border-none"
          });
        }
      }

      return {
        ...prev,
        inventory: nextInventory,
        craftedItems: updatedCrafted,
        hiddenRewards: nextHidden
      };
    });
  };

  const handleFusion = (sourceClass: ItemClass) => {
    const itemsOfClass = stats.craftedItems.filter(i => i.class === sourceClass);
    if (itemsOfClass.length < 50) {
      toast({
        title: "Need more items",
        description: `You need 50 ${sourceClass} items for a fusion attempt.`,
        variant: "destructive"
      });
      return;
    }

    setStats(prev => {
      // Remove 50 items
      let removed = 0;
      const nextCrafted = prev.craftedItems.filter(item => {
        if (item.class === sourceClass && removed < 50) {
          removed++;
          return false;
        }
        return true;
      });

      // Find higher class
      const classes: ItemClass[] = ['Human', 'Epic', 'Legend', 'Divine', 'Transcendental'];
      const currentIndex = classes.indexOf(sourceClass);
      const targetClass = classes[Math.min(currentIndex + 1, classes.length - 1)];

      const possibleBlueprints = CRAFT_RECIPES.filter(r => r.class === targetClass);
      const randomBlueprint = possibleBlueprints[Math.floor(Math.random() * possibleBlueprints.length)];
      
      const newItem: CraftItem = { 
        ...randomBlueprint, 
        id: `${randomBlueprint.id}-${Date.now()}`, 
        isForged: true 
      };

      triggerConfetti();
      toast({
        title: "🌀 FUSION SUCCESS!",
        description: `Fused 50 items to create: ${newItem.name} (${newItem.class})`,
        className: "bg-purple-600 text-white border-none"
      });

      return {
        ...prev,
        craftedItems: [...nextCrafted, newItem]
      };
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Human': return 'text-slate-500 bg-slate-100';
      case 'Epic': return 'text-blue-500 bg-blue-100';
      case 'Legend': return 'text-purple-500 bg-purple-100';
      case 'Divine': return 'text-yellow-600 bg-yellow-100';
      case 'Transcendental': return 'text-red-500 bg-red-100 animate-pulse';
      default: return 'text-slate-500';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 rounded-xl bg-white/50 border-primary/20 hover:bg-white hover:border-primary/50 transition-all shadow-sm">
          <Hammer className="w-4 h-4 text-orange-500" />
          <span>Forge</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl text-center flex items-center justify-center gap-3">
            <Anvil className="w-8 h-8 text-orange-600" />
            Great Forge
          </DialogTitle>
          <DialogDescription className="text-center">
            Gather materials from study quests to forge mythical equipment.
          </DialogDescription>
        </DialogHeader>

        {/* Fusion Section */}
        <div className="mb-6 p-4 bg-purple-50 rounded-2xl border border-purple-100">
          <h4 className="text-sm font-bold text-purple-700 flex items-center gap-2 mb-3">
            <ArrowUpCircle className="w-4 h-4" /> Fusion Altar
          </h4>
          <div className="flex flex-wrap gap-2">
            {(['Human', 'Epic', 'Legend', 'Divine'] as ItemClass[]).map(cls => (
              <Button 
                key={cls}
                variant="outline"
                size="sm"
                className="text-[10px] h-8 rounded-lg"
                onClick={() => handleFusion(cls)}
              >
                Fuse 50 {cls}
              </Button>
            ))}
          </div>
          <p className="text-[10px] text-purple-400 mt-2">Fuse 50 lower-class items for a random higher-class item.</p>
        </div>

        {/* Hidden Rewards Section */}
        {stats.hiddenRewards.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 rounded-2xl border border-yellow-200">
             <h4 className="text-sm font-bold text-yellow-700 flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4" /> Extraordinary Discoveries
            </h4>
            <div className="flex flex-wrap gap-2">
              {stats.hiddenRewards.map(reward => (
                <span key={reward} className="text-[10px] font-bold bg-white text-yellow-600 px-2 py-1 rounded-full border border-yellow-200">
                  {reward}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="bg-muted/30 p-4 rounded-2xl grid grid-cols-5 gap-2 mb-6 border-2 border-dashed border-muted/50">
          {Object.entries(stats.inventory).map(([resource, count]) => (
            <div key={resource} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-muted">
                {resource === 'Iron Ingot' && <Package className="w-5 h-5 text-slate-400" />}
                {resource === 'Fire' && <Flame className="w-5 h-5 text-orange-500" />}
                {resource === 'Ancient Manuscript' && <ScrollText className="w-5 h-5 text-blue-400" />}
                {resource === 'Stardust' && <Sparkles className="w-5 h-5 text-yellow-400" />}
                {resource === 'Dragon Scale' && <Gem className="w-5 h-5 text-emerald-500" />}
              </div>
              <span className="text-[10px] font-bold text-muted-foreground text-center line-clamp-1">{resource}</span>
              <span className="text-xs font-bold text-foreground">{count}</span>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-muted-foreground flex items-center gap-2">
            <Hammer className="w-4 h-4" /> Available Blueprints
          </h3>
          <div className="grid gap-4">
            {CRAFT_RECIPES.map((recipe) => {
              const requirementsMet = recipe.requirements.every(req => stats.inventory[req.resource] >= req.count);

              return (
                <div 
                  key={recipe.id}
                  className={`p-5 rounded-2xl border-2 transition-all bg-white border-border hover:border-primary/20`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block ${getRarityColor(recipe.class)}`}>
                        {recipe.class} Class
                      </span>
                      <h4 className="font-display text-xl font-bold">{recipe.name}</h4>
                      <p className="text-xs text-muted-foreground">{recipe.description}</p>
                    </div>
                    <Button 
                      size="sm" 
                      disabled={!requirementsMet}
                      onClick={() => handleForge(recipe)}
                      className={`rounded-xl h-10 px-6 font-bold transition-all ${requirementsMet ? 'bg-orange-600 hover:bg-orange-700 shadow-md' : 'bg-muted text-muted-foreground'}`}
                    >
                      Forge
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {recipe.requirements.map(req => (
                      <div key={req.resource} className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
                          <span>{req.resource}</span>
                          <span>{stats.inventory[req.resource]} / {req.count}</span>
                        </div>
                        <Progress 
                          value={(stats.inventory[req.resource] / req.count) * 100} 
                          className="h-1.5"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ScrollText({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M15 12h-5"/><path d="M15 8h-5"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/>
    </svg>
  );
}

import { useState, useEffect } from "react";
import { GamificationHeader } from "@/components/GamificationHeader";
import { TaskItem } from "@/components/TaskItem";
import { StoryMap } from "@/components/StoryMap";
import { SkinSelector } from "@/components/SkinSelector";
import { ProfileSection } from "@/components/ProfileSection";
import { MainsTracker } from "@/components/MainsTracker";
import { CraftingSystem } from "@/components/CraftingSystem";
import { PetSystem } from "@/components/PetSystem";
import { 
  INITIAL_STATS, 
  UserStats, 
  triggerConfetti, 
  Task, 
  LEVEL_XP_REQ,
  GS_GROUPS,
  OPTIONAL_GROUPS,
  HOBBY_GROUPS,
  MILESTONE_REWARDS,
  SPECIAL_TRIGGERS,
  ResourceType,
  isBossBattleTime
} from "@/lib/gameLogic";
import { Plus, BookOpen, GraduationCap, PenTool, Lock, Heart, Palette, ScrollText, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function Home() {
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [activeTab, setActiveTab] = useState<'GS' | 'Optional' | 'Essay' | 'Hobby'>('GS');
  const [selectedGroup, setSelectedGroup] = useState(GS_GROUPS[0]);
  const { toast } = useToast();

  const [poems, setPoems] = useState<{title: string, content: string}[]>([]);
  const [paintings, setPaintings] = useState<{title: string, url: string}[]>([]);
  
  const [isEssayDialogOpen, setIsEssayDialogOpen] = useState(false);
  const [essayCount, setEssayCount] = useState("1");
  const [essayDetails, setEssayDetails] = useState<{topic: string, marks: string}[]>([]);
  const [lastEssayDate, setLastEssayDate] = useState<string | null>(null);

  const isWednesday = new Date().getDay() === 3;
  const isBossTime = isBossBattleTime();

  // Boss Battle Penalty Checker
  useEffect(() => {
    if (!isBossTime) return;

    const checkInterval = setInterval(() => {
      const now = new Date();
      // Only penalize at the end of the window if no essay was written today during window
      const endHourUtc = 9;
      const endMinUtc = 30;
      if (now.getUTCHours() === endHourUtc && now.getUTCMinutes() >= endMinUtc) {
         if (lastEssayDate !== now.toDateString()) {
           setStats(prev => ({
             ...prev,
             xp: Math.max(0, prev.xp - 300)
           }));
           toast({
             title: "💀 BOSS DEFEAT",
             description: "You missed the Wednesday Boss Battle! -300 XP penalty applied.",
             variant: "destructive"
           });
         }
      }
    }, 60000);

    return () => clearInterval(checkInterval);
  }, [isBossTime, lastEssayDate]);

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        if (!t.completed) handleTaskCompletion(t.xpValue, t.type, t.category);
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const handleTaskCompletion = (xp: number, type?: string, category?: string) => {
    triggerConfetti();
    setStats(prev => {
      const newTotalTasks = prev.tasksCompleted + 1;
      const newDailyCount = prev.dailyTaskCount + 1;
      const newWeeklyCount = prev.weeklyTaskCount + 1;
      
      let newXp = prev.xp + xp;
      let newLevel = prev.level;
      if (newXp >= LEVEL_XP_REQ) {
        newLevel += Math.floor(newXp / LEVEL_XP_REQ);
        newXp = newXp % LEVEL_XP_REQ;
        toast({ title: "🎉 LEVEL UP!", className: "bg-primary text-white border-none" });
      }

      const radar = { ...prev.radarData };
      if (type === 'GS') radar.GS = Math.min(100, radar.GS + 5);
      if (type === 'Optional') radar.Optional = Math.min(100, radar.Optional + 5);
      if (type === 'Essay') radar.Essay = Math.min(100, radar.Essay + 10);
      if (type === 'Hobby') radar.Hobbies = Math.min(100, radar.Hobbies + 5);
      if (!type) radar.Mains = Math.min(100, radar.Mains + 8);

      const nextInventory = { ...prev.inventory };
      if (type === 'GS' || type === 'Optional' || !type) {
        nextInventory['Iron Ingot'] += 1;
        if (Math.random() > 0.7) nextInventory['Ancient Manuscript'] += 1;
      }
      if (!type || type === 'Essay') nextInventory['Fire'] += 1;
      if (type === 'Hobby') nextInventory['Stardust'] += 1;
      if (newLevel > prev.level) nextInventory['Dragon Scale'] += 1;

      // Pet Growth on Mains Answers
      let nextPets = prev.pets;
      if (!type && prev.activePetId) { // !type is Mains Tracker callback
        nextPets = prev.pets.map(p => {
          if (p.id === prev.activePetId) {
            return { ...p, level: p.level + 0.05, xp: p.xp + 10 };
          }
          return p;
        });
      }

      return { 
        ...prev, 
        xp: newXp, 
        level: newLevel, 
        tasksCompleted: newTotalTasks,
        dailyTaskCount: newDailyCount,
        weeklyTaskCount: newWeeklyCount,
        radarData: radar,
        inventory: nextInventory,
        pets: nextPets
      };
    });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks([{
      id: Date.now().toString(),
      text: newTaskText,
      completed: false,
      xpValue: 10,
      type: activeTab as any,
      category: selectedGroup
    }, ...tasks]);
    setNewTaskText("");
  };

  const handleEssaySubmit = () => {
    let totalXp = 0;
    essayDetails.forEach(e => {
      const marks = parseInt(e.marks) || 0;
      totalXp += marks * 2; 
    });
    handleTaskCompletion(totalXp, 'Essay');
    setLastEssayDate(new Date().toDateString());
    setIsEssayDialogOpen(false);
    setEssayDetails([]);
    toast({
      title: "Essays Logged!",
      description: `You earned ${totalXp} XP for your hard work!`,
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="ipad-shell flex flex-col">
        <ScrollArea className="flex-1">
          <div className="p-10">
            {isBossTime && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-600 text-white rounded-2xl flex items-center justify-between shadow-lg border-2 border-red-400"
              >
                <div className="flex items-center gap-3">
                  <Swords className="w-8 h-8 animate-bounce" />
                  <div>
                    <h2 className="font-display font-bold text-lg">BOSS BATTLE: THE WEDNESDAY TRIALS</h2>
                    <p className="text-xs opacity-90">Log an essay now or lose 300 XP! (Window: 12-3 PM IST)</p>
                  </div>
                </div>
                {lastEssayDate === new Date().toDateString() ? (
                  <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">BOSS DEFEATED</span>
                ) : (
                  <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full animate-pulse">BATTLE ACTIVE</span>
                )}
              </motion.div>
            )}

            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-display font-bold text-primary">UPSC Quest</h1>
              <div className="flex items-center gap-2">
                <ProfileSection stats={stats} setStats={setStats} />
                <PetSystem stats={stats} setStats={setStats} />
                <CraftingSystem stats={stats} setStats={setStats} />
                <SkinSelector stats={stats} />
              </div>
            </div>

            <GamificationHeader stats={stats} />
            <MainsTracker onAwardXp={(xp) => handleTaskCompletion(xp)} />

            <Tabs value={activeTab} onValueChange={(v: any) => {
              setActiveTab(v);
              if (v === 'GS') setSelectedGroup(GS_GROUPS[0]);
              if (v === 'Optional') setSelectedGroup(OPTIONAL_GROUPS[0]);
              if (v === 'Hobby') setSelectedGroup(HOBBY_GROUPS[0]);
            }} className="w-full">
              <TabsList className="grid grid-cols-4 h-16 rounded-2xl bg-white/50 border-2 border-dashed border-muted/30 mb-8 p-1">
                <TabsTrigger value="GS" className="rounded-xl gap-2 font-display text-sm data-[state=active]:bg-primary data-[state=active]:text-white">
                  <BookOpen className="w-4 h-4" /> GS
                </TabsTrigger>
                <TabsTrigger value="Optional" className="rounded-xl gap-2 font-display text-sm data-[state=active]:bg-secondary data-[state=active]:text-white">
                  <GraduationCap className="w-4 h-4" /> Optional
                </TabsTrigger>
                <TabsTrigger value="Essay" className="rounded-xl gap-2 font-display text-sm data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  <PenTool className="w-4 h-4" /> Essay
                </TabsTrigger>
                <TabsTrigger value="Hobby" className="rounded-xl gap-2 font-display text-sm data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                  <Heart className="w-4 h-4" /> Hobbies
                </TabsTrigger>
              </TabsList>

              {(activeTab === 'GS' || activeTab === 'Optional' || activeTab === 'Hobby') && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <form onSubmit={handleAddTask} className="flex flex-col gap-3 mb-8">
                    <div className="flex gap-3">
                      <Input value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} placeholder="New task..." className="h-14 rounded-2xl bg-white border-2 border-dashed flex-1" />
                      <Button type="submit" size="icon" className="h-14 w-14 rounded-2xl bg-primary text-white"><Plus className="w-6 h-6 stroke-[3]" /></Button>
                    </div>
                    <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                      <SelectTrigger className="h-12 rounded-xl bg-white border-border"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(activeTab === 'GS' ? GS_GROUPS : activeTab === 'Optional' ? OPTIONAL_GROUPS : HOBBY_GROUPS).map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </form>

                  {activeTab === 'Hobby' && (
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="h-24 rounded-2xl flex flex-col gap-2 bg-white border-dashed">
                            <ScrollText className="w-6 h-6 text-pink-500" /> Store Poem
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Write a Poem</DialogTitle></DialogHeader>
                          <div className="space-y-4 py-4">
                            <Input placeholder="Title" id="p-title" />
                            <Textarea placeholder="Write your lines here..." id="p-content" className="min-h-[200px]" />
                            <Button onClick={() => {
                              const t = (document.getElementById('p-title') as HTMLInputElement).value;
                              const c = (document.getElementById('p-content') as HTMLTextAreaElement).value;
                              if (t && c) {
                                setPoems([{title: t, content: c}, ...poems]);
                                toast({title: "Poem Saved!", description: "Keep the ink flowing."});
                              }
                            }} className="w-full">Save to Archive</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="h-24 rounded-2xl flex flex-col gap-2 bg-white border-dashed">
                            <Palette className="w-6 h-6 text-orange-500" /> Log Painting
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Log your Art</DialogTitle></DialogHeader>
                          <div className="space-y-4 py-4">
                            <Input placeholder="Artwork Title" id="a-title" />
                            <Input placeholder="Image URL (or description)" id="a-url" />
                            <Button onClick={() => {
                               const t = (document.getElementById('a-title') as HTMLInputElement).value;
                               const u = (document.getElementById('a-url') as HTMLInputElement).value;
                               if (t && u) {
                                 setPaintings([{title: t, url: u}, ...paintings]);
                                 toast({title: "Artwork Logged!", description: "Your gallery grows."});
                               }
                            }} className="w-full">Add to Gallery</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}

                  {(activeTab === 'GS' ? GS_GROUPS : activeTab === 'Optional' ? OPTIONAL_GROUPS : HOBBY_GROUPS).map(group => {
                    const groupTasks = tasks.filter(t => t.type === activeTab && t.category === group);
                    if (groupTasks.length === 0) return null;
                    return (
                      <div key={group} className="mb-8">
                        <h3 className="text-xl font-display font-bold text-foreground/80 mb-4 px-2 border-l-4 border-primary/40 ml-1">{group}</h3>
                        <div className="space-y-1">
                          <AnimatePresence mode="popLayout">
                            {groupTasks.map(task => <TaskItem key={task.id} task={task} onToggle={handleToggleTask} />)}
                          </AnimatePresence>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}

              <TabsContent value="Essay">
                <div className="flex flex-col items-center justify-center p-12 bg-white/50 rounded-3xl border-2 border-dashed border-muted/30 min-h-[300px] text-center">
                  {!isWednesday ? (
                    <div className="space-y-4">
                      <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto"><Lock className="w-10 h-10 text-muted-foreground" /></div>
                      <h3 className="text-2xl font-display font-bold">Window Locked</h3>
                      <p className="text-muted-foreground">The Essay window only opens on <span className="text-primary font-bold">Wednesdays</span>.</p>
                    </div>
                  ) : (
                    <div className="space-y-6 w-full max-w-sm">
                      <PenTool className="w-16 h-16 text-accent mx-auto" />
                      <h3 className="text-2xl font-display font-bold">Essay Day!</h3>
                      <Dialog open={isEssayDialogOpen} onOpenChange={setIsEssayDialogOpen}>
                        <DialogTrigger asChild><Button className="w-full h-14 rounded-2xl bg-accent text-accent-foreground font-bold">Log My Essays</Button></DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Essay Session</DialogTitle></DialogHeader>
                          <div className="space-y-6 py-4">
                            <Select value={essayCount} onValueChange={(v) => { setEssayCount(v); setEssayDetails(Array.from({ length: parseInt(v) }, () => ({ topic: "", marks: "" }))); }}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent><SelectItem value="1">1 Essay</SelectItem><SelectItem value="2">2 Essays</SelectItem><SelectItem value="3">3 Essays</SelectItem><SelectItem value="4">4 Essays</SelectItem></SelectContent>
                            </Select>
                            {essayDetails.map((_, i) => (
                              <div key={i} className="space-y-3 p-4 bg-muted/20 rounded-2xl">
                                <Label>Essay #{i+1}</Label>
                                <Input placeholder="Topic" value={essayDetails[i]?.topic} onChange={(e) => { const n = [...essayDetails]; n[i].topic = e.target.value; setEssayDetails(n); }} />
                                <Input type="number" placeholder="Marks" value={essayDetails[i]?.marks} onChange={(e) => { const n = [...essayDetails]; n[i].marks = e.target.value; setEssayDetails(n); }} />
                              </div>
                            ))}
                            <Button onClick={handleEssaySubmit} className="w-full h-12 rounded-xl bg-primary text-white">Claim Rewards</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            <StoryMap stats={stats} />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

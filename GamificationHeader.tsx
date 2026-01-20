import { UserStats, LEVEL_XP_REQ } from "@/lib/gameLogic";
import { motion } from "framer-motion";
import { Flame, Trophy, Target } from "lucide-react";
import avatarImage from "@assets/generated_images/cute_chibi_avatar_character.png";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from "recharts";

interface GamificationHeaderProps {
  stats: UserStats;
}

export function GamificationHeader({ stats }: GamificationHeaderProps) {
  const progress = (stats.xp / LEVEL_XP_REQ) * 100;

  const radarData = [
    { subject: 'GS', A: stats.radarData.GS },
    { subject: 'Optional', A: stats.radarData.Optional },
    { subject: 'Essay', A: stats.radarData.Essay },
    { subject: 'Mains', A: stats.radarData.Mains },
    { subject: 'Hobbies', A: stats.radarData.Hobbies },
  ];

  return (
    <div className="w-full bg-card rounded-3xl p-6 shadow-lg border border-border/50 relative overflow-hidden mb-8">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/10 rounded-full blur-2xl -ml-5 -mb-5" />

      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group cursor-pointer transition-transform hover:scale-105">
            <div className="w-28 h-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-primary/20">
               <img src={avatarImage} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-accent text-accent-foreground font-bold px-3 py-1 rounded-full text-sm shadow-sm border border-white flex items-center gap-1">
              Lvl {stats.level}
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-display font-bold text-foreground">
              {stats.currentSkin}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 bg-orange-100 text-orange-600 px-2 py-1 rounded-lg font-bold text-xs">
                <Flame className="w-3 h-3 fill-orange-500" />
                {stats.currentStreak}
              </div>
              <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg font-bold text-xs">
                <Trophy className="w-3 h-3 fill-yellow-500" />
                {stats.tasksCompleted}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex-1 w-full space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <span>Experience</span>
              <span>{stats.xp} / {LEVEL_XP_REQ} XP</span>
            </div>
            <div className="h-4 bg-secondary/20 rounded-full overflow-hidden border border-secondary/10">
              <motion.div 
                className="h-full bg-gradient-to-r from-secondary to-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 50, damping: 15 }}
              />
            </div>
          </div>

          <div className="p-4 bg-white/40 rounded-2xl border border-white/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase text-muted-foreground">Character Attributes</span>
            </div>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 'bold' }} />
                  <Radar
                    name="Strength"
                    dataKey="A"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useMemo } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Swords, TrendingUp, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface MainsTrackerProps {
  onAwardXp: (xp: number) => void;
}

// Mock historical data
const MOCK_DATA = {
  week: [
    { name: "Mon", count: 2 },
    { name: "Tue", count: 3 },
    { name: "Wed", count: 1 },
    { name: "Thu", count: 4 },
    { name: "Fri", count: 2 },
    { name: "Sat", count: 5 },
    { name: "Sun", count: 0 },
  ],
  month: [
    { name: "Week 1", count: 12 },
    { name: "Week 2", count: 18 },
    { name: "Week 3", count: 15 },
    { name: "Week 4", count: 22 },
  ],
  year: [
    { name: "Jan", count: 45 },
    { name: "Feb", count: 52 },
    { name: "Mar", count: 48 },
    { name: "Apr", count: 60 },
    { name: "May", count: 35 },
    { name: "Jun", count: 42 },
  ]
};

export function MainsTracker({ onAwardXp }: MainsTrackerProps) {
  const [questionsToday, setQuestionsToday] = useState("");
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("week");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(questionsToday);
    if (isNaN(count) || count <= 0) return;

    // Award 25 XP per Mains question
    const xpReward = count * 25;
    onAwardXp(xpReward);
    setQuestionsToday("");
  };

  return (
    <Card className="w-full bg-card rounded-3xl border border-border shadow-lg overflow-hidden mt-8 mb-8">
      <CardHeader className="bg-primary/5 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Swords className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="font-display text-xl">Mains Answer Writing</CardTitle>
          </div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <TrendingUp className="w-4 h-4" />
            25 XP per Answer
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="questions" className="text-muted-foreground font-medium">
                  How many Mains questions did you attempt today?
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="questions"
                    type="number"
                    value={questionsToday}
                    onChange={(e) => setQuestionsToday(e.target.value)}
                    placeholder="e.g. 3"
                    className="h-12 rounded-xl bg-muted/30 border-none text-lg"
                  />
                  <Button type="submit" className="h-12 rounded-xl px-6 bg-primary hover:bg-primary/90 font-bold gap-2">
                    <Plus className="w-4 h-4" /> Log
                  </Button>
                </div>
              </div>
            </form>

            <div className="p-4 bg-secondary/5 rounded-2xl border border-secondary/10">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Pro Tip</p>
              <p className="text-sm leading-relaxed italic">
                "Consistent answer writing is the key to mastering the Mains. Every question attempted brings you closer to your goal."
              </p>
            </div>
          </div>

          {/* Chart Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-muted-foreground uppercase">Activity Graph</span>
              <Tabs value={timeframe} onValueChange={(v: any) => setTimeframe(v)} className="w-auto">
                <TabsList className="bg-muted/50 h-8 p-1 rounded-lg">
                  <TabsTrigger value="week" className="text-[10px] h-6 rounded-md px-2">Week</TabsTrigger>
                  <TabsTrigger value="month" className="text-[10px] h-6 rounded-md px-2">Month</TabsTrigger>
                  <TabsTrigger value="year" className="text-[10px] h-6 rounded-md px-2">Year</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="h-48 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_DATA[timeframe]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#888' }}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    cursor={{ fill: 'rgba(236, 72, 153, 0.05)' }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]} 
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

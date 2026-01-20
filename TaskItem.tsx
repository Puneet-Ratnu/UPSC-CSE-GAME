import { Task } from "@/lib/gameLogic";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
}

export function TaskItem({ task, onToggle }: TaskItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        "group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer mb-3 shadow-sm hover:shadow-md",
        task.completed 
          ? "bg-muted/30 border-transparent opacity-60" 
          : "bg-white border-border hover:border-primary/30"
      )}
      onClick={() => onToggle(task.id)}
    >
      <div className={cn(
        "w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-colors duration-300 relative",
        task.completed
          ? "bg-green-400 border-green-400"
          : "border-muted-foreground/30 group-hover:border-primary"
      )}>
        <AnimatePresence>
          {task.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Check className="w-5 h-5 text-white stroke-[3]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1">
        <p className={cn(
          "font-medium text-lg transition-all duration-300 font-sans",
          task.completed ? "line-through text-muted-foreground" : "text-foreground"
        )}>
          {task.text}
        </p>
      </div>

      <div className={cn(
        "px-3 py-1 rounded-full text-xs font-bold transition-colors",
        task.completed 
          ? "bg-transparent text-transparent" 
          : "bg-accent/20 text-accent-foreground"
      )}>
        +{task.xpValue} XP
      </div>
    </motion.div>
  );
}

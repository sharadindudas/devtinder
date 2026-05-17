import type { FeedUser } from "@/types/feed";
import { animate, motion, useMotionValue, useTransform } from "motion/react";

const SWIPE_THRESHOLD = 100;

interface SwipeCardProps {
  user: FeedUser;
  onSwipe: (action: "like" | "pass") => void;
  isDraggable: boolean;
  index: number;
}

export default function SwipeCard({ user, onSwipe, isDraggable, index }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, -20], [1, 0]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      animate(x, 1000, { duration: 0.3 }).then(() => onSwipe("like"));
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      animate(x, -1000, { duration: 0.3 }).then(() => onSwipe("pass"));
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 25 });
    }
  };

  return (
    <motion.div
      style={{
        x,
        rotate,
        scale: 1 - index * 0.04,
        y: index * 12,
        zIndex: 10 - index
      }}
      drag={isDraggable ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      className="absolute w-full h-full cursor-grab active:cursor-grabbing select-none">
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-8 left-6 z-10 border-4 border-green-400 text-green-400 font-black text-3xl px-3 py-1 rounded-xl -rotate-12">
        LIKE
      </motion.div>

      <motion.div
        style={{ opacity: passOpacity }}
        className="absolute top-8 right-6 z-10 border-4 border-red-400 text-red-400 font-black text-3xl px-3 py-1 rounded-xl rotate-12">
        PASS
      </motion.div>

      <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl relative">
        <img
          src={user.avatar || "/assets/avatar-placeholder.png"}
          alt={user.name}
          draggable={false}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <span className="text-xs bg-white/25 backdrop-blur-sm px-2.5 py-1 rounded-full capitalize font-medium">{user.experienceLevel}</span>
          </div>

          {user.bio && <p className="text-sm text-white/80 line-clamp-2 mb-3">{user.bio}</p>}

          {user.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {user.skills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="text-xs bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  {skill}
                </span>
              ))}
              {user.skills.length > 4 && (
                <span className="text-xs bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">+{user.skills.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}


import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { useState, useEffect } from "react";

export const rotateEmojiList = [
  {
    id: 1,
    content: "🧙‍♂️",
  },
  {
    id: 2,
    content: "🧜🏻‍♀️",
  },
  {
    id: 3,
    content: "💂🏻",
  },
  {
    id: 4,
    content: "🦹",
  },
  {
    id: 5,
    content: "🥷",
  },
];

const RotateEmoji: React.FC<{
  initialEmoji?: number;
  className?: string;
}> = (props) => {
  const [index, setIndex] = useState(props.initialEmoji || 0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((state) => {
        if (state >= rotateEmojiList.length - 1) return 0;
        return state + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={props.className} style={{ position: "relative" }}>
      <AnimatePresence>
        <motion.div
          key={rotateEmojiList[index].id}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ ease: "linear" }}
          style={{ position: "absolute" }}
        >
          {rotateEmojiList[index].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default React.memo(RotateEmoji);

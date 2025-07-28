import React from 'react'
import { PlayCircle, PauseCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const getActionButtons = (broadcast: any, handleActionClick: (action: string, id: any) => void) => {
  switch (broadcast.status) {
    case "draft":
    case "scheduled":
      return (
        <motion.button
          onClick={() => handleActionClick("execute", broadcast.id)}
          className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-300 rounded-full transition-all"
          title="Send Now"
        >
          <PlayCircle size={16} />
        </motion.button>
      );
    case "sending":
      return (
        <motion.button
          onClick={() => handleActionClick("pause", broadcast.id)}
          className="p-1.5 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-neutral-400 hover:text-purple-600 dark:hover:text-purple-300 rounded-full transition-all"
          title="Pause"
        >
          <PauseCircle size={16} />
        </motion.button>
      );
    case "paused":
      return (
        <motion.button
          onClick={() => handleActionClick("resume", broadcast.id)}
          className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-300 rounded-full transition-all"
          title="Resume"
        >
          <PlayCircle size={16} />
        </motion.button>
      );
    default:
      return null;
  }
};

export default getActionButtons

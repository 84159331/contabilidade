import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TabTransitionProps {
  children: React.ReactNode;
  transitionKey: string;
}

const TabTransition: React.FC<TabTransitionProps> = ({ children, transitionKey }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.2,
          ease: "easeInOut"
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default TabTransition;

import React from 'react';
import { motion } from 'framer-motion';
import GoalsSystem from '../components/GoalsSystem';
import PageTransition from '../components/PageTransition';

const GoalsPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="space-y-6">
        <GoalsSystem />
      </div>
    </PageTransition>
  );
};

export default GoalsPage;

import React from 'react';
import { motion } from 'framer-motion';
import DraggableDashboard from '../components/DraggableDashboard';
import PageTransition from '../components/PageTransition';

const CustomizableDashboard: React.FC = () => {
  return (
    <PageTransition>
      <div className="space-y-6">
        <DraggableDashboard />
      </div>
    </PageTransition>
  );
};

export default CustomizableDashboard;

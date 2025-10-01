import React from 'react';
import { motion } from 'framer-motion';
import AutomatedReports from '../components/AutomatedReports';
import PageTransition from '../components/PageTransition';

const AutomatedReportsPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="space-y-6">
        <AutomatedReports />
      </div>
    </PageTransition>
  );
};

export default AutomatedReportsPage;

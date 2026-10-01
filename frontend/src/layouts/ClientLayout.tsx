import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { RentalAIAssistant } from '../components/ai/RentalAIAssistant';

export const ClientLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-slate-100 selection:bg-brand-500 selection:text-black">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <RentalAIAssistant />
    </div>
  );
};

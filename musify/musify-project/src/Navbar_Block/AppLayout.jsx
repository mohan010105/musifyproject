import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Navbar from './Navbar';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import FooterPlayer from '../components/FooterPlayer';
import FullScreenPlayer from '../components/FullScreenPlayer';
import { useSongs } from '../Contex/SongContext';

const AppLayout = () => {
  const { isFullScreenPlayerOpen, currentSong, isPlaying } = useSongs();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  // Define animation variants
  const pageVariants = {
    initial: {
      opacity: 0,
      x: 50,
      scale: 0.95
    },
    in: {
      opacity: 1,
      x: 0,
      scale: 1
    },
    out: {
      opacity: 0,
      x: -50,
      scale: 1.05
    }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: shouldReduceMotion ? 0 : 1.2, ease: "easeOut" }}
    >
      {/* Song focus overlay */}
      <AnimatePresence>
        {currentSong && isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="fixed inset-0 bg-black pointer-events-none z-10"
            style={{
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)'
            }}
          />
        )}
      </AnimatePresence>

      <Toaster/>
      <Navbar/>
      <main className="flex-1 pb-20 relative z-20 overflow-y-auto">
        <Outlet/>
      </main>
      <FooterPlayer/>
      {isFullScreenPlayerOpen && <FullScreenPlayer />}
    </motion.div>
  );
};

export default AppLayout;

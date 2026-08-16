import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, AlertOctagon } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const letterConfigs = [
  { char: 'S', startX: -550, startY: -350, startRotate: -160, delay: 0.05 },
  { char: 'Y', startX: 480, startY: -420, startRotate: 180, delay: 0.15 },
  { char: 'S', startX: -500, startY: 300, startRotate: -110, delay: 0.25 },
  { char: 'T', startX: 520, startY: 360, startRotate: 210, delay: 0.35 },
  { char: 'E', startX: -320, startY: -500, startRotate: -170, delay: 0.45 },
  { char: 'M', startX: 380, startY: 450, startRotate: 130, delay: 0.55 },
  { char: ' ', startX: 0, startY: 0, startRotate: 0, delay: 0 },
  { char: 'S', startX: -420, startY: 390, startRotate: -190, delay: 0.65 },
  { char: 'C', startX: 490, startY: -290, startRotate: 115, delay: 0.75 },
  { char: 'R', startX: -390, startY: -390, startRotate: -140, delay: 0.85 },
  { char: 'I', startX: 310, startY: -460, startRotate: 185, delay: 0.95 },
  { char: 'B', startX: -510, startY: -210, startRotate: -120, delay: 1.05 },
  { char: 'E', startX: 430, startY: 380, startRotate: 205, delay: 1.15 },
];

const shatterFragments = [
  { targetX: -260, targetY: -220, rotate: -220, width: 'w-12', height: 'h-12', bg: 'from-cyan-400 to-[#892cdc]' },
  { targetX: 260, targetY: -220, rotate: 220, width: 'w-12', height: 'h-12', bg: 'from-purple-400 to-cyan-500' },
  { targetX: -300, targetY: 40, rotate: -150, width: 'w-10', height: 'h-14', bg: 'from-[#bc6ff1] to-[#52057b]' },
  { targetX: 300, targetY: -40, rotate: 150, width: 'w-14', height: 'h-10', bg: 'from-cyan-300 to-[#892cdc]' },
  { targetX: -220, targetY: 260, rotate: -270, width: 'w-12', height: 'h-12', bg: 'from-[#892cdc] to-purple-600' },
  { targetX: 220, targetY: 260, rotate: 270, width: 'w-12', height: 'h-12', bg: 'from-indigo-400 to-cyan-400' },
  { targetX: 0, targetY: -300, rotate: -180, width: 'w-14', height: 'h-10', bg: 'from-cyan-400 to-[#bc6ff1]' },
  { targetX: 0, targetY: 300, rotate: 180, width: 'w-14', height: 'h-10', bg: 'from-[#52057b] to-cyan-500' },
];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  // Phases: 'converging' -> 'overflowing' -> 'blasting' -> 'formed'
  const [phase, setPhase] = useState<'converging' | 'overflowing' | 'blasting' | 'formed'>('converging');

  useEffect(() => {
    // 1. Data Storage Box Overflow (1.4s)
    const overflowTimer = setTimeout(() => {
      setPhase('overflowing');
    }, 1400);

    // 2. Data Storage Box Blast 360-Degree Shatter (1.8s)
    const blastTimer = setTimeout(() => {
      setPhase('blasting');
    }, 1800);

    // 3. System Scribe Formed (2.2s)
    const formTimer = setTimeout(() => {
      setPhase('formed');
    }, 2200);

    // 4. Complete splash transition (3.8s)
    const finishTimer = setTimeout(() => {
      onComplete();
    }, 3800);

    return () => {
      clearTimeout(overflowTimer);
      clearTimeout(blastTimer);
      clearTimeout(formTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#020005] flex items-center justify-center text-white overflow-hidden select-none">
      {/* Ambient Cyber Data Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(137,44,220,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(137,44,220,0.08)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Perfectly Centered Radial Energy Glow */}
      <motion.div
        className="absolute w-[650px] h-[650px] bg-[#892cdc] opacity-25 blur-[150px] rounded-full pointer-events-none"
        animate={{
          scale: phase === 'overflowing' ? 1.1 : phase === 'blasting' ? [1.1, 1.9, 1.2] : phase === 'formed' ? 1.2 : 0.8,
          opacity: phase === 'blasting' ? [0.3, 0.7, 0.35] : 0.2,
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Perfectly Centered Explosion Shockwave Rings */}
      {(phase === 'blasting' || phase === 'formed') && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <motion.div
            initial={{ scale: 0.1, opacity: 1, borderWidth: '10px' }}
            animate={{ scale: 4.2, opacity: 0, borderWidth: '1px' }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="absolute w-44 h-44 rounded-full border-cyan-400 shadow-[0_0_60px_#22d3ee]"
          />
          <motion.div
            initial={{ scale: 0.1, opacity: 1, borderWidth: '6px' }}
            animate={{ scale: 3.2, opacity: 0, borderWidth: '1px' }}
            transition={{ duration: 0.65, delay: 0.1, ease: 'easeOut' }}
            className="absolute w-44 h-44 rounded-full border-purple-400 shadow-[0_0_40px_#bc6ff1]"
          />
        </div>
      )}

      {/* Main Perfectly Centered Stage */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center w-full h-full">
        {/* Phase 1 & 2: Central Data Storage Vault Container */}
        <AnimatePresence>
          {phase !== 'formed' && (
            <motion.div
              initial={{ scale: 1, opacity: 0 }}
              animate={
                phase === 'converging'
                  ? { scale: 1, opacity: 1 }
                  : phase === 'overflowing'
                  ? { scale: 1, filter: ['brightness(1)', 'brightness(2.5)', 'brightness(1.5)'], x: [-4, 4, -4, 4, 0] }
                  : { scale: 1, opacity: 1 }
              }
              exit={{ opacity: 0 }}
              transition={{
                duration: phase === 'converging' ? 0.6 : 0.3,
                ease: 'easeInOut',
              }}
              className="absolute flex flex-col items-center justify-center"
            >
              {/* 360-Degree Vault Shatter Pieces during Blast */}
              {phase === 'blasting' ? (
                <div className="relative w-32 h-32 flex items-center justify-center pointer-events-none">
                  {shatterFragments.map((frag, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
                      animate={{
                        x: frag.targetX,
                        y: frag.targetY,
                        rotate: frag.rotate,
                        opacity: [1, 1, 0],
                        scale: [1, 0.6, 0.1],
                      }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className={`absolute ${frag.width} ${frag.height} bg-gradient-to-br ${frag.bg} rounded-xl border border-cyan-200 shadow-[0_0_30px_#22d3ee] flex items-center justify-center overflow-hidden`}
                    >
                      <Database className="w-5 h-5 text-white opacity-90" />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className={`w-32 h-32 rounded-3xl p-1 shadow-2xl flex items-center justify-center transition-colors ${
                  phase === 'overflowing'
                    ? 'bg-gradient-to-br from-cyan-400 via-white to-purple-500 shadow-[0_0_70px_#22d3ee]'
                    : 'bg-gradient-to-br from-[#892cdc] via-[#bc6ff1] to-[#52057b] shadow-[0_0_40px_rgba(188,111,241,0.6)]'
                }`}>
                  <div className="w-full h-full bg-[#0a0412] rounded-[20px] flex flex-col items-center justify-center relative overflow-hidden border border-[#892cdc]/40">
                    <Database className={`w-10 h-10 transition-colors ${phase === 'overflowing' ? 'text-cyan-300 animate-pulse' : 'text-[#bc6ff1]'}`} />
                    <span className="text-[9px] font-mono font-bold tracking-wider text-purple-300 mt-1 uppercase">
                      DATA VAULT
                    </span>
                  </div>
                </div>
              )}

              {/* Status Label below Data Vault */}
              <div className="absolute top-36 text-xs font-mono font-bold tracking-widest uppercase whitespace-nowrap">
                {phase === 'converging' && <span className="text-[#bc6ff1]">Storing Data Packets...</span>}
                {phase === 'overflowing' && <span className="text-cyan-300 animate-pulse flex items-center justify-center gap-1"><AlertOctagon className="w-4 h-4 text-cyan-300 animate-ping" /> CRITICAL DATA OVERFLOW</span>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 1 & 2: Visible Letters Stream From Random Directions Into Dead Center */}
        {(phase === 'converging' || phase === 'overflowing') && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {letterConfigs.map((item, index) => {
              if (item.char === ' ') return null;
              return (
                <motion.span
                  key={index}
                  initial={{
                    x: item.startX,
                    y: item.startY,
                    rotate: item.startRotate,
                    scale: 1.1,
                    opacity: 0,
                  }}
                  animate={{
                    x: 0,
                    y: 0,
                    rotate: 0,
                    scale: 0.4,
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 1.1,
                    delay: item.delay,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                  className="absolute text-4xl sm:text-5xl font-black font-[900] text-transparent bg-gradient-to-r from-white via-cyan-300 to-[#bc6ff1] bg-clip-text font-sans drop-shadow-[0_0_15px_#22d3ee]"
                >
                  {item.char}
                </motion.span>
              );
            })}
          </div>
        )}

        {/* Phase 3: SYSTEM SCRIBE Title (Emerges From Dead Center) */}
        {phase === 'formed' && (
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'backOut' }}
            className="absolute flex flex-col items-center justify-center"
          >
            {/* Exploded Assembled Letters */}
            <div className="flex items-center justify-center gap-1 sm:gap-2.5 mb-4 h-16 sm:h-20 px-4">
              {letterConfigs.map((item, index) => {
                if (item.char === ' ') {
                  return <div key={index} className="w-4 sm:w-8" />;
                }
                return (
                  <motion.span
                    key={index}
                    initial={{
                      scale: 3.2,
                      opacity: 0,
                      filter: 'blur(15px)',
                    }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      filter: 'blur(0px)',
                    }}
                    transition={{
                      duration: 0.7,
                      delay: index * 0.03,
                      type: 'spring',
                      stiffness: 150,
                      damping: 12,
                    }}
                    className="inline-block text-5xl sm:text-7xl font-black font-[900] tracking-wider bg-gradient-to-b from-white via-[#e2d1f7] to-[#bc6ff1] bg-clip-text text-transparent font-sans"
                  >
                    {item.char}
                  </motion.span>
                );
              })}
            </div>

            {/* Assembled Data Lock Pulse Line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-80 sm:w-[450px] h-0.5 bg-gradient-to-r from-transparent via-[#bc6ff1] to-transparent"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

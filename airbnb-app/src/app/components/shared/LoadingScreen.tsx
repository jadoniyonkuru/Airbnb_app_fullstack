import { motion } from 'motion/react';

/* ─── Orbit Ring ─────────────────────────────────────────────────────────── */
function OrbitRing({
  radius,
  duration,
  dotSize,
  dotColor,
  delay = 0,
  trailColor = 'rgba(255,90,95,0.12)',
}: {
  radius: number;
  duration: number;
  dotSize: number;
  dotColor: string;
  delay?: number;
  trailColor?: string;
}) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      {/* orbit path ring */}
      <div
        className="absolute rounded-full border border-dashed"
        style={{
          width:  radius * 2,
          height: radius * 2,
          borderColor: trailColor,
        }}
      />
      {/* rotating dot */}
      <motion.div
        className="absolute"
        style={{ width: radius * 2, height: radius * 2 }}
        animate={{ rotate: 360 }}
        transition={{ duration, repeat: Infinity, ease: 'linear', delay }}
      >
        <div
          className="absolute rounded-full shadow-md"
          style={{
            width:  dotSize,
            height: dotSize,
            background: dotColor,
            top:  '50%',
            left: '100%',
            transform: `translateX(-${dotSize / 2}px) translateY(-${dotSize / 2}px)`,
            boxShadow: `0 0 ${dotSize * 3}px ${dotColor}88`,
          }}
        />
      </motion.div>
    </div>
  );
}

/* ─── Ripple Ring ─────────────────────────────────────────────────────────── */
function Ripple({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full border border-[#FF5A5F]/30"
      style={{ width: 64, height: 64 }}
      animate={{ scale: [1, 3.2], opacity: [0.5, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay }}
    />
  );
}

/* ─── Full Page Loading Screen ────────────────────────────────────────────── */
export function LoadingScreen({ message = 'Loading…' }: { message?: string }) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Top progress bar */}
      <motion.div
        className="fixed top-0 left-0 h-[3px] bg-[#FF5A5F] rounded-full origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: [0, 0.4, 0.7, 0.85, 0.92] }}
        transition={{ duration: 2.2, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
        style={{ width: '100%' }}
      />

      {/* Orbit assembly */}
      <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
        {/* Ripple rings */}
        <Ripple delay={0} />
        <Ripple delay={0.8} />
        <Ripple delay={1.6} />

        {/* Orbit rings */}
        <OrbitRing radius={52}  duration={1.8} dotSize={8}  dotColor="#FF5A5F"  delay={0}   trailColor="rgba(255,90,95,0.15)" />
        <OrbitRing radius={74}  duration={3.1} dotSize={6}  dotColor="#FC642D"  delay={0.4} trailColor="rgba(252,100,45,0.12)" />
        <OrbitRing radius={88}  duration={4.6} dotSize={5}  dotColor="#00A699"  delay={1.0} trailColor="rgba(0,166,153,0.10)" />

        {/* Central branded circle */}
        <motion.div
          className="w-16 h-16 bg-[#FF5A5F] rounded-2xl flex items-center justify-center shadow-xl z-10"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span
            className="text-white select-none"
            style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.5rem', fontWeight: 700, lineHeight: 1 }}
          >
            S
          </span>
        </motion.div>
      </div>

      {/* Brand name */}
      <motion.div
        className="mt-8 flex items-center gap-1"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <span
          className="text-[#1C1C1E]"
          style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.35rem', fontWeight: 700 }}
        >
          Stay
        </span>
        <span
          className="text-[#FF5A5F]"
          style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.35rem', fontWeight: 700 }}
        >
          Bnb
        </span>
      </motion.div>

      {/* Loading message */}
      <motion.p
        className="mt-2 text-[#8E8E93] text-sm tracking-wide"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        {message}
      </motion.p>

      {/* Dot trail loader */}
      <div className="mt-6 flex items-center gap-2">
        {[0, 1, 2, 3, 4].map(i => (
          <motion.div
            key={i}
            className="rounded-full"
            style={{ background: i === 2 ? '#FF5A5F' : '#DDDDDD' }}
            animate={{
              width:  [5, i === 2 ? 20 : 5, 5],
              height: [5, 5, 5],
              background: ['#DDDDDD', '#FF5A5F', '#DDDDDD'],
              borderRadius: ['50%', '6px', '50%'],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.18,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Inline small spinner (for buttons / inline use) ─────────────────────── */
export function Spinner({ size = 20, color = '#FF5A5F' }: { size?: number; color?: string }) {
  return (
    <motion.div
      style={{
        width:  size,
        height: size,
        borderRadius: '50%',
        border: `2.5px solid ${color}22`,
        borderTopColor: color,
        display: 'inline-block',
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  );
}

/* ─── Navigation progress bar (top only, no overlay) ──────────────────────── */
export function NavigationLoader() {
  return (
    <motion.div
      key="nav-progress"
      className="fixed top-0 left-0 right-0 z-[9998] h-[3px] bg-[#FF5A5F] rounded-full"
      initial={{ scaleX: 0, opacity: 1 }}
      animate={{ scaleX: 0.9 }}
      exit={{ scaleX: 1, opacity: 0 }}
      transition={{ duration: 1.6, ease: 'easeOut' }}
      style={{ transformOrigin: 'left' }}
    />
  );
}
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
  Sequence,
  Series,
} from "remotion";

const COLOR_GOLD = "#C5A059";
const COLOR_DARK = "#F9FAFB"; // Main Background (White-ish)
const COLOR_ACCENT = "#D4AF37";
const COLOR_WHITE = "#111827"; // Main Text (Dark)
const COLOR_CIRCUIT = "rgba(197, 160, 89, 0.1)"; // Subtle gold lines

// Reusable animated text component with a premium feel
const PremiumText: React.FC<{
  text: string;
  fontSize?: number;
  color?: string;
  delay?: number;
  glow?: boolean;
  letterSpacing?: number;
}> = ({ text, fontSize = 60, color = COLOR_WHITE, delay = 0, glow = false, letterSpacing = 2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const startFrame = delay * fps;
  const progress = interpolate(frame - startFrame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.poly(4)),
  });

  const translateY = interpolate(progress, [0, 1], [40, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.95, 1]);

  return (
    <div
      style={{
        fontSize,
        color,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        fontWeight: "900",
        fontFamily: "'Inter', 'Montserrat', sans-serif",
        textAlign: "center",
        letterSpacing: `${letterSpacing}px`,
        textShadow: glow ? `0 0 20px ${color}80` : "none",
        textTransform: "uppercase",
      }}
    >
      {text}
    </div>
  );
};

// Animated circuitry background for the "Quantum" feel
const QuantumBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: COLOR_DARK }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={COLOR_GOLD} stopOpacity="0.1" />
            <stop offset="100%" stopColor={COLOR_ACCENT} stopOpacity="0.3" />
          </linearGradient>
        </defs>
        
        {/* Abstract lines representing data flow */}
        {Array.from({ length: 15 }).map((_, i) => {
          const x = (i * (width / 15)) + (i % 2 * 20);
          const dashOffset = frame * 2 + i * 50;
          return (
            <line
              key={i}
              x1={x}
              y1="0"
              x2={x + (i % 3 - 1) * 100}
              y2={height}
              stroke={COLOR_GOLD}
              strokeWidth="1"
              strokeOpacity="0.08" // More subtle on white
              strokeDasharray="10 20"
              strokeDashoffset={-dashOffset}
            />
          );
        })}

        {/* Floating geometric shapes */}
        {Array.from({ length: 8 }).map((_, i) => {
            const rotation = frame * 0.5 + i * 45;
            const tx = 100 + Math.sin(frame / 50 + i) * 50;
            const ty = 200 + i * 200 + Math.cos(frame / 40 + i) * 30;
            return (
                <rect 
                    key={i}
                    x={tx} y={ty}
                    width="40" height="40"
                    fill="none"
                    stroke={COLOR_GOLD}
                    strokeWidth="1"
                    strokeOpacity="0.1" // More subtle on white
                    transform={`rotate(${rotation}, ${tx + 20}, ${ty + 20})`}
                />
            )
        })}
      </svg>
      
      {/* Subtle Light Vignette */}
      <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle, transparent 40%, rgba(255, 255, 255, 0.4) 100%)"
      }} />
    </AbsoluteFill>
  );
};

const QuantumLogo: React.FC<{ scale?: number }> = ({ scale = 1 }) => {
    const frame = useCurrentFrame();
    const pulse = 1 + Math.sin(frame / 15) * 0.05;
    
    return (
        <div style={{ transform: `scale(${scale * pulse})`, transition: 'transform 0.1s ease-out' }}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="80" fill="none" stroke={COLOR_GOLD} strokeWidth="4" />
                {/* Brain-like circuitry icon */}
                <path 
                    d="M 100 40 C 120 40, 140 60, 140 80 C 140 100, 120 120, 100 120 C 80 120, 60 100, 60 80 C 60 60, 80 40, 100 40 
                       M 100 120 V 160 M 70 80 H 40 M 130 80 H 160" 
                    stroke={COLOR_GOLD} 
                    strokeWidth="6" 
                    strokeLinecap="round"
                    fill="none"
                />
                <circle cx="100" cy="160" r="8" fill={COLOR_GOLD} />
                <circle cx="40" cy="80" r="8" fill={COLOR_GOLD} />
                <circle cx="160" cy="80" r="8" fill={COLOR_GOLD} />
            </svg>
        </div>
    );
};

const SimpleChart: React.FC<{ color: string }> = ({ color }) => {
    const frame = useCurrentFrame();
    return (
        <div style={{ width: '100%', height: 200, marginTop: 40 }}>
            <svg width="100%" height="200" viewBox="0 0 1000 200">
                {Array.from({ length: 20 }).map((_, i) => {
                    const h = 50 + Math.abs(Math.sin(i * 0.5 + frame / 10)) * 100;
                    const up = Math.sin(i * 0.8 + frame / 20) > 0.2;
                    const x = i * 50;
                    return (
                        <rect 
                            key={i}
                            x={x} y={100 - h/2}
                            width="20" height={h}
                            fill={up ? color : "#FF5252"}
                            opacity={0.6}
                        />
                    )
                })}
            </svg>
        </div>
    );
};

export const PromotionVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: COLOR_DARK }}>
      <QuantumBackground />

      <Series>
        {/* Intro Tagline (0-3.5s) */}
        <Series.Sequence durationInFrames={3.5 * fps}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <div style={{ transform: 'translateY(-100px)' }}>
                <QuantumLogo scale={1.2} />
            </div>
            <PremiumText text="QUANTUM ALGO" fontSize={80} color={COLOR_GOLD} glow delay={0.5} />
            <PremiumText text="SYSTEMS" fontSize={40} color={COLOR_WHITE} delay={1} letterSpacing={10} />
          </AbsoluteFill>
        </Series.Sequence>

        {/* Feature 1: Quantum Powered (3.5-7s) */}
        <Series.Sequence durationInFrames={3.5 * fps}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
            <PremiumText text="QUANTUM-POWERED" fontSize={50} color={COLOR_WHITE} delay={0} />
            <PremiumText text="TRADING CORE" fontSize={90} color={COLOR_GOLD} glow delay={0.5} />
            <div style={{ height: 40 }} />
            <PremiumText text="Next-Gen HFT Strategies" fontSize={30} color={COLOR_WHITE} delay={1.5} letterSpacing={4} />
          </AbsoluteFill>
        </Series.Sequence>

        {/* Feature 2: Performance (7-10.5s) */}
        <Series.Sequence durationInFrames={3.5 * fps}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
            <PremiumText text="VERIFIED RESULTS" fontSize={40} color={COLOR_WHITE} />
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                <PremiumText text="80%" fontSize={120} color={COLOR_GOLD} glow delay={0.5} />
                <PremiumText text="TO" fontSize={40} color={COLOR_WHITE} delay={0.8} />
                <PremiumText text="98%" fontSize={120} color={COLOR_GOLD} glow delay={1.1} />
            </div>
            <PremiumText text="WIN RATE" fontSize={60} color={COLOR_WHITE} delay={1.8} />
          </AbsoluteFill>
        </Series.Sequence>

        {/* Feature 3: XAUUSD Specialist (10.5-14s) */}
        <Series.Sequence durationInFrames={3.5 * fps}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
            <div style={{ opacity: 0.8, marginBottom: 20 }}>
                <svg width="120" height="120" viewBox="0 0 24 24" fill={COLOR_GOLD}>
                    <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" />
                </svg>
            </div>
            <PremiumText text="XAUUSD" fontSize={100} color={COLOR_GOLD} glow />
            <PremiumText text="GOLD SPECIALIST" fontSize={50} color={COLOR_WHITE} delay={0.5} />
            <SimpleChart color={COLOR_GOLD} />
          </AbsoluteFill>
        </Series.Sequence>

        {/* Feature 4: Platforms (14-17.5s) */}
        <Series.Sequence durationInFrames={3.5 * fps}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
            <PremiumText text="SUPPORTING" fontSize={40} color={COLOR_WHITE} />
            <div style={{ margin: '40px 0' }}>
                 <PremiumText text="MT4 • MT5 • CTRADER" fontSize={60} color={COLOR_GOLD} delay={0.5} />
            </div>
            <PremiumText text="& CUSTOM PYTHON SOLUTIONS" fontSize={30} color={COLOR_WHITE} delay={1.2} />
          </AbsoluteFill>
        </Series.Sequence>

        {/* CTA (17.5-22s) */}
        <Series.Sequence durationInFrames={4.5 * fps}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
            <QuantumLogo scale={0.8} />
            <div style={{ height: 40 }} />
            <PremiumText text="AUTOMATE YOUR SUCCESS" fontSize={45} color={COLOR_WHITE} />
            <div style={{ height: 60 }} />
            <div style={{
                padding: "25px 60px",
                border: `3px solid ${COLOR_GOLD}`,
                borderRadius: "15px",
                backgroundColor: "rgba(197, 160, 89, 0.05)",
                boxShadow: `0 10px 30px rgba(197, 160, 89, 0.1)`
            }}>
                <PremiumText text="QUANTUMALGOSYSTEMS.COM" fontSize={35} color={COLOR_GOLD} delay={1} letterSpacing={2} />
            </div>
          </AbsoluteFill>
        </Series.Sequence>
      </Series>

      {/* Global Glitch/Scanline effect for transitions */}
      {Math.random() > 0.98 && (
          <AbsoluteFill style={{ backgroundColor: COLOR_GOLD, opacity: 0.1, zIndex: 100 }} />
      )}
    </AbsoluteFill>
  );
};

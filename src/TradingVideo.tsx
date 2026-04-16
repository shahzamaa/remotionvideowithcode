import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
  Series,
} from "remotion";

const COLOR_GOLD = "#FFD700";
const COLOR_BLACK = "#000000";
const COLOR_RED = "#FF4B4B";
const COLOR_GREEN = "#00E676";

const ChartBackground: React.FC<{ blur?: number }> = ({ blur = 0 }) => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ filter: `blur(${blur}px)`, backgroundColor: COLOR_BLACK }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,215,0,0.05)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {Array.from({ length: 25 }).map((_, i) => {
          const x = i * 80 + (frame % 80); // Moving chart
          const baseY = height / 2 + Math.sin(i * 0.5 + frame / 20) * 150;
          const h = 60 + Math.abs(Math.sin(i * 1.5) * 200);
          const isUp = Math.sin(i * 3 + frame / 100) > 0;
          return (
            <g key={i}>
              <line 
                x1={x} y1={baseY - h/2 - 30} 
                x2={x} y2={baseY + h/2 + 30} 
                stroke={isUp ? COLOR_GREEN : COLOR_RED} 
                strokeWidth="2" 
              />
              <rect 
                x={x - 20} y={baseY - h/2} 
                width="40" height={h} 
                fill={isUp ? COLOR_GREEN : COLOR_RED} 
                style={{ opacity: 0.4 }}
              />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

const AnimatedText: React.FC<{ 
    text: string; 
    fontSize?: number; 
    color?: string;
    glow?: boolean;
    style?: React.CSSProperties;
}> = ({ text, fontSize = 80, color = "white", glow = false, style }) => {
    const frame = useCurrentFrame();
    
    const scale = interpolate(frame, [0, 5, 8], [0, 1.2, 1], {
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.back(1)),
    });

    return (
        <div style={{
            transform: `scale(${scale})`,
            fontSize,
            color,
            fontWeight: "900",
            textAlign: "center",
            fontFamily: "Inter, system-ui, sans-serif",
            textShadow: glow ? `0 0 30px ${color}` : "0 4px 10px rgba(0,0,0,0.5)",
            width: "100%",
            ...style
        }}>
            {text}
        </div>
    );
};

const RankingCard: React.FC<{ 
    rank: string; 
    title: string; 
    desc: string; 
    color?: string;
    isPrimary?: boolean;
}> = ({ rank, title, desc, color = "white", isPrimary = false }) => {
    const frame = useCurrentFrame();
    
    const entry = interpolate(frame, [0, 10], [0, 1], {
        easing: Easing.out(Easing.poly(3)),
        extrapolateRight: "clamp"
    });

    const scale = isPrimary ? (1 + Math.sin(frame / 10) * 0.05) : 1;

    return (
        <div style={{
            opacity: entry,
            transform: `scale(${entry * scale})`,
            backgroundColor: isPrimary ? "rgba(255, 215, 0, 0.15)" : "rgba(255, 255, 255, 0.08)",
            padding: "50px",
            borderRadius: "30px",
            border: isPrimary ? `2px solid ${COLOR_GOLD}` : "2px solid rgba(255,255,255,0.1)",
            width: "90%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backdropFilter: "blur(10px)",
            boxShadow: isPrimary ? `0 0 50px rgba(255, 215, 0, 0.3)` : "0 10px 30px rgba(0,0,0,0.5)"
        }}>
            <div style={{ color: isPrimary ? COLOR_GOLD : "rgba(255,255,255,0.6)", fontSize: 40, marginBottom: 10, fontWeight: "bold" }}>{rank}</div>
            <div style={{ color: "white", fontSize: 50, marginBottom: 20, textAlign: "center", fontWeight: "800" }}>{title}</div>
            <div style={{ color: isPrimary ? COLOR_GOLD : "white", fontSize: 60, fontWeight: "900", textAlign: "center" }}>{desc}</div>
        </div>
    );
};

export const TradingVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background audio (conceptual, would be added via <Audio> tag)
  
  return (
    <AbsoluteFill style={{ backgroundColor: COLOR_BLACK, fontFamily: "sans-serif" }}>
      <ChartBackground blur={3} />
      
      {/* Global Vignette */}
      <AbsoluteFill style={{ 
          background: "radial-gradient(circle, transparent 30%, rgba(0,0,0,0.8) 100%)",
          pointerEvents: "none"
      }} />

      <Series>
        {/* Hook Scene (0-3s) */}
        <Series.Sequence durationInFrames={3 * fps}>
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 40 }}>
                <AnimatedText 
                    text="I TESTED" 
                    fontSize={120} 
                    style={{ marginBottom: 20 }}
                />
                <AnimatedText 
                    text="319" 
                    fontSize={250} 
                    color={COLOR_GOLD} 
                    glow 
                    style={{ marginBottom: 20 }}
                />
                <AnimatedText 
                    text="GOLD STRATEGIES" 
                    fontSize={100} 
                />
            </AbsoluteFill>
        </Series.Sequence>

        {/* Intro Transition (3-6s) */}
        <Series.Sequence durationInFrames={3 * fps}>
             <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
                <AnimatedText text="HERE'S WHAT" fontSize={100} style={{ marginBottom: 20 }} />
                <AnimatedText text="HAPPENED:" fontSize={140} color={COLOR_GOLD} glow />
            </AbsoluteFill>
        </Series.Sequence>

        {/* Ranking Sequence (6-18s) - Fast paced cuts */}
        <Series.Sequence durationInFrames={4 * fps}>
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
                <RankingCard rank="#3" title="SUPPORT & RESISTANCE" desc="TOO INCONSISTENT ❌" />
            </AbsoluteFill>
        </Series.Sequence>

        <Series.Sequence durationInFrames={4 * fps}>
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
                <RankingCard rank="#2" title="BREAKOUT STRATEGY" desc="WORKS SOMETIMES ⚠️" />
            </AbsoluteFill>
        </Series.Sequence>

        <Series.Sequence durationInFrames={4 * fps}>
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
                <RankingCard rank="#1" title="QUANTUM ALGO" desc="83% WIN RATE ✅" isPrimary />
            </AbsoluteFill>
        </Series.Sequence>

        {/* Final Reveal (18-24s) */}
        <Series.Sequence durationInFrames={6 * fps}>
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 40 }}>
                <AnimatedText text="ONLY ONE" fontSize={100} style={{ marginBottom: 20 }} />
                <AnimatedText text="SURVIVED" fontSize={160} color={COLOR_GOLD} glow style={{ marginBottom: 40 }} />
                <AnimatedText text="OUT OF 319" fontSize={80} />
            </AbsoluteFill>
        </Series.Sequence>

        {/* Call to Action (24-30s) */}
        <Series.Sequence durationInFrames={6 * fps}>
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 40 }}>
                <AnimatedText text="FULLY AUTOMATED EA" fontSize={70} style={{ marginBottom: 20 }} />
                <AnimatedText text="METATRADER 5" fontSize={90} color={COLOR_GOLD} style={{ marginBottom: 80 }} />
                
                <div style={{
                    padding: "40px 80px",
                    backgroundColor: COLOR_GOLD,
                    color: COLOR_BLACK,
                    borderRadius: "60px",
                    fontSize: 55,
                    fontWeight: "900",
                    transform: `scale(${1 + Math.sin(frame / 6) * 0.08})`,
                    boxShadow: `0 0 50px ${COLOR_GOLD}`,
                    textAlign: "center"
                }}>
                    LINK IN COMMENTS
                </div>
            </AbsoluteFill>
        </Series.Sequence>
      </Series>
      
      {/* Dynamic Flash Overlay for transitions */}
      {frame % (4 * fps) < 3 && frame > 5 * fps && (
        <AbsoluteFill style={{ backgroundColor: "white", opacity: 0.3 }} />
      )}
    </AbsoluteFill>
  );
};

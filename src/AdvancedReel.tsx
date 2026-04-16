import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Series,
  Img,
  staticFile,
} from "remotion";

const COLOR_WHITE = "#FFFFFF";
const COLOR_GOLD = "#D4AF37";
const COLOR_DARK = "#111827";

// High-end Spring Text with Fast Entrance and Exit
const TitleText: React.FC<{ text: string; delay?: number; exitDelay?: number; size?: number; color?: string }> = ({ 
    text, delay = 0, exitDelay = 9999, size = 80, color = COLOR_DARK 
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // High stiffness for fast, snappy movement
  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 220 },
  });

  const exit = spring({
    frame: frame - exitDelay,
    fps,
    config: { damping: 14, stiffness: 220 },
  });

  const move = enter - exit;

  return (
    <div style={{
        fontSize: size,
        fontWeight: 900,
        color,
        fontFamily: "'Inter', sans-serif",
        transform: `translateY(${interpolate(move, [0, 1], [40, 0])}px) scale(${interpolate(move, [0, 1], [0.85, 1])})`,
        opacity: Math.max(0, move),
        textAlign: "center",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textTransform: "uppercase",
        letterSpacing: "4px",
        marginRight: "-4px", // Fixes centering offset caused by letter spacing
    }}>
      {text}
    </div>
  );
};

// Advanced Dynamic Chart using SVG Paths and Gradients
const AdvancedChart: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    
    // Smooth drawing animation
    const progress = spring({
        frame: frame - delay,
        fps,
        config: { damping: 100, stiffness: 40 }, // Faster draw
    });

    // Generate path data
    const points = [
        {x: 0, y: 300},
        {x: 100, y: 280},
        {x: 200, y: 320},
        {x: 300, y: 220},
        {x: 400, y: 250},
        {x: 500, y: 150},
        {x: 600, y: 180},
        {x: 700, y: 80},
        {x: 800, y: 100},
        {x: 900, y: 20},
        {x: 1000, y: 0},
    ];

    const pathData = `M 0 300 ` + points.map(p => `L ${p.x} ${p.y}`).join(" ");
    const areaData = pathData + ` L 1000 400 L 0 400 Z`;

    const pathLength = 1500; // Approximate length of the line

    return (
        <div style={{ width: '100%', height: 400, marginTop: 40, transform: `scale(${interpolate(progress, [0, 1], [0.95, 1])})` }}>
            <svg width="100%" height="400" viewBox="0 0 1000 400">
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={COLOR_GOLD} stopOpacity="0.6" />
                        <stop offset="100%" stopColor={COLOR_GOLD} stopOpacity="0.0" />
                    </linearGradient>
                </defs>

                {/* Filled Area under line */}
                <path 
                    d={areaData} 
                    fill="url(#chartGradient)" 
                    opacity={interpolate(progress, [0.5, 1], [0, 1], { extrapolateLeft: 'clamp' })}
                />

                {/* The animated Line */}
                <path 
                    d={pathData} 
                    fill="none" 
                    stroke={COLOR_GOLD} 
                    strokeWidth="8" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={pathLength}
                    strokeDashoffset={interpolate(progress, [0, 1], [pathLength, 0])}
                />
                
                {/* Data Points / Nodes */}
                {points.map((p, i) => {
                    const nodePop = spring({
                        frame: frame - delay - i * 3, // Staggered intro
                        fps,
                        config: { damping: 10, stiffness: 100 }
                    });
                    return (
                        <circle 
                            key={i}
                            cx={p.x} cy={p.y}
                            r={nodePop * 12}
                            fill={COLOR_WHITE}
                            stroke={COLOR_GOLD}
                            strokeWidth="4"
                        />
                    )
                })}
            </svg>
        </div>
    );
};



export const AdvancedReel: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: COLOR_WHITE, overflow: 'hidden' }}>
      {/* Dynamic Background Elements */}
      <AbsoluteFill>
         {Array.from({ length: 5 }).map((_, i) => (
             <div key={i} style={{
                 position: 'absolute',
                 border: `1px solid rgba(212, 175, 55, 0.1)`,
                 borderRadius: '50%',
                 width: 500 + i * 200,
                 height: 500 + i * 200,
                 top: '50%',
                 left: '50%',
                 transform: `translate(-50%, -50%) rotate(${frame * 0.1 * (i%2===0?1:-1)}deg)`,
             }} />
         ))}
      </AbsoluteFill>

      <Series>
        {/* Scene 1: Logo & Branding (0-4s) */}
        <Series.Sequence durationInFrames={4 * fps}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <div style={{
                transform: `scale(${spring({ frame, fps, config: { damping: 12, stiffness: 150 } })})`
            }}>
                <Img src={staticFile("logo.png")} style={{ width: 400, height: 'auto' }} />
            </div>
            <div style={{ height: 40 }} />
            <TitleText text="INSTITUTIONAL" delay={5} exitDelay={105} size={70} color={COLOR_DARK} />
            <TitleText text="GRADE ALGORITHMS" delay={10} exitDelay={110} size={70} color={COLOR_GOLD} />
          </div>
        </Series.Sequence>

        {/* Scene 2: Advanced Chart Reveal (4-9s) */}
        <Series.Sequence durationInFrames={5 * fps}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center', padding: 40, width: '100%' }}>
            <TitleText text="DATA DRIVEN" size={90} exitDelay={135} />
            <TitleText text="PERFORMANCE" size={60} color={COLOR_GOLD} delay={5} exitDelay={140} />
            <AdvancedChart delay={10} />
          </div>
        </Series.Sequence>

        {/* Scene 3: Analytics & Stats (9-14s) */}
        <Series.Sequence durationInFrames={5 * fps}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
             <TitleText text="83.5%" size={200} color={COLOR_GOLD} exitDelay={135} />
             <TitleText text="WIN RATE" size={50} delay={5} exitDelay={140} />
             <div style={{ height: 60 }} />
             <div style={{ display: 'flex', gap: 40, opacity: Math.max(0, 1 - spring({ frame: frame - 135, fps })) }}>
                 <div style={{ textAlign: 'center', transform: `scale(${spring({ frame: frame - 15, fps, config: {stiffness: 200, damping: 14} })})` }}>
                     <div style={{ fontSize: 60, fontWeight: 900, color: COLOR_DARK }}>24/7</div>
                     <div style={{ fontSize: 30, color: COLOR_GOLD, fontWeight: 'bold' }}>AUTOMATED</div>
                 </div>
                 <div style={{ textAlign: 'center', transform: `scale(${spring({ frame: frame - 20, fps, config: {stiffness: 200, damping: 14} })})` }}>
                     <div style={{ fontSize: 60, fontWeight: 900, color: COLOR_DARK }}>0.2ms</div>
                     <div style={{ fontSize: 30, color: COLOR_GOLD, fontWeight: 'bold' }}>LATENCY</div>
                 </div>
             </div>
          </div>
        </Series.Sequence>

        {/* Scene 4: Call to Action with Logo (14-18s) */}
        <Series.Sequence durationInFrames={4 * fps}>
           <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <div style={{
                transform: `scale(${spring({ frame, fps, config: { damping: 12, stiffness: 150 } })})`
            }}>
                <Img src={staticFile("logo.png")} style={{ width: 400, height: 'auto' }} />
            </div>
            <div style={{ height: 20 }} />
            <TitleText text="SCALE YOUR PORTFOLIO" size={60} delay={5} exitDelay={110} />
            <div style={{ height: 40 }} />
            <div style={{
                padding: "30px 80px",
                backgroundColor: COLOR_GOLD,
                borderRadius: "100px",
                color: COLOR_WHITE,
                fontSize: 45,
                fontWeight: 900,
                transform: `scale(${spring({ frame: frame - 15, fps, config: { damping: 10, stiffness: 220 } })})`,
                boxShadow: "0 20px 40px rgba(212, 175, 55, 0.3)"
            }}>
                LINK IN BIO
            </div>
          </div>
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};


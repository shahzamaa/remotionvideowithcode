import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Series,
  Img,
  staticFile
} from "remotion";

const COLOR_BG_DARK = "#0B0F19";
const COLOR_BG_LIGHT = "#F4F7FC";
const COLOR_GOLD = "#D4AF37";
const COLOR_RED = "#FF4B4B";
const COLOR_GREEN = "#00E676";

// Cinematic Fade-in/out text with slight 3D perspective
const CinematicText: React.FC<{ text: string; subText?: string; delayPop?: number; isPositive?: boolean }> = ({ 
    text, subText, delayPop = 10, isPositive = true 
}) => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    // Fade in
    const opacityIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
    // Fade out at end of sequence
    const opacityOut = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    
    // Slow 3D push forward
    const scale = interpolate(frame, [0, durationInFrames], [0.9, 1.1]);
    const rotateX = interpolate(frame, [0, durationInFrames], [10, -5]);

    // Subtext pop
    const pop = spring({
        frame: frame - delayPop,
        fps,
        config: { damping: 12, stiffness: 180 }
    });

    return (
        <div style={{
            opacity: Math.min(opacityIn, opacityOut),
            transform: `perspective(1000px) scale(${scale}) rotateX(${rotateX}deg)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            textAlign: "center"
        }}>
            <div style={{ 
                fontSize: 80, 
                fontWeight: 900, 
                color: isPositive ? "#FFF" : "#CCC", 
                fontFamily: "'Inter', sans-serif",
                textTransform: "uppercase",
                padding: "0 40px",
                lineHeight: 1.2,
                textShadow: "0 10px 30px rgba(0,0,0,0.5)"
            }}>
                {text}
            </div>
            {subText && (
                <div style={{
                    marginTop: 30,
                    fontSize: 50,
                    fontWeight: 800,
                    color: isPositive ? COLOR_GREEN : COLOR_RED,
                    fontFamily: "'Inter', sans-serif",
                    transform: `scale(${pop}) translateY(${interpolate(pop, [0, 1], [40, 0])}px)`,
                    opacity: pop
                }}>
                    {subText}
                </div>
            )}
        </div>
    );
};

// Glassmorphism Card
const GlassCard: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const slideIn = spring({
        frame: frame - delay,
        fps,
        config: { damping: 16, stiffness: 120 }
    });

    return (
        <div style={{
            padding: "60px 40px",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            borderRadius: 30,
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
            transform: `translateY(${interpolate(slideIn, [0, 1], [100, 0])}px) scale(${interpolate(slideIn, [0, 1], [0.9, 1])})`,
            opacity: slideIn,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }}>
            {children}
        </div>
    );
};

export const LifeChangeReel: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: COLOR_BG_DARK, overflow: 'hidden' }}>
      {/* Immersive Deep Background Gradient */}
      <AbsoluteFill style={{
          background: `radial-gradient(circle at ${50 + Math.sin(frame/40)*20}% ${50 + Math.cos(frame/30)*20}%, rgba(212, 175, 55, 0.15) 0%, ${COLOR_BG_DARK} 70%)`
      }} />

      <Series>
        {/* Scene 1: The Problem (0 - 3.5s) */}
        <Series.Sequence durationInFrames={3.5 * fps}>
            <CinematicText text="TIRED OF STARING" subText="AT CHARTS ALL DAY?" isPositive={false} />
        </Series.Sequence>

        {/* Scene 2: The Pain (3.5 - 7s) */}
        <Series.Sequence durationInFrames={3.5 * fps}>
            <CinematicText text="MANUAL TRADING IS" subText="DRAINING." delayPop={15} isPositive={false} />
        </Series.Sequence>

        {/* Scene 3: The Solution / Logo Reveal (7 - 11.5s) */}
        <Series.Sequence durationInFrames={4.5 * fps}>
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
                <div style={{
                    transform: `scale(${spring({ frame, fps, config: { damping: 12, stiffness: 90 } })})`,
                    marginBottom: 40
                }}>
                    <Img src={staticFile("logo.png")} style={{ width: 350, height: 'auto' }} />
                </div>
                <div style={{ height: 20 }} />
                <div style={{
                    fontSize: 65, color: "#FFF", fontWeight: 900, fontFamily: "Inter",
                    opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" }),
                    transform: `translateY(${interpolate(frame, [15, 30], [20, 0], { extrapolateRight: "clamp" })}px)`,
                    textAlign: "center"
                }}>
                    ENTER THE <span style={{ color: COLOR_GOLD }}>QUANTUM</span> ERA
                </div>
            </AbsoluteFill>
        </Series.Sequence>

        {/* Scene 4: The Transformation - Floating Glass Cards (11.5 - 17.5s) */}
        <Series.Sequence durationInFrames={6 * fps}>
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 40 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 40, width: "100%" }}>
                    <GlassCard delay={5}>
                        <div style={{ fontSize: 40, color: "#ccc", fontWeight: "bold", fontFamily: "Inter", marginBottom: 10 }}>FROM MANUAL</div>
                        <div style={{ fontSize: 60, color: COLOR_GOLD, fontWeight: 900, fontFamily: "Inter" }}>TO 24/7 AUTOMATED</div>
                    </GlassCard>
                    
                    <GlassCard delay={20}>
                        <div style={{ fontSize: 40, color: "#ccc", fontWeight: "bold", fontFamily: "Inter", marginBottom: 10 }}>FROM GUESSWORK</div>
                        <div style={{ fontSize: 60, color: COLOR_GOLD, fontWeight: 900, fontFamily: "Inter" }}>TO PRECISION ALGO</div>
                    </GlassCard>

                    <GlassCard delay={35}>
                        <div style={{ fontSize: 40, color: "#ccc", fontWeight: "bold", fontFamily: "Inter", marginBottom: 10 }}>FROM STRESS</div>
                        <div style={{ fontSize: 60, color: COLOR_GOLD, fontWeight: 900, fontFamily: "Inter" }}>TO PASSIVE SCALING</div>
                    </GlassCard>
                </div>
            </AbsoluteFill>
        </Series.Sequence>

        {/* Scene 5: The Benefit (17.5 - 21s) */}
        <Series.Sequence durationInFrames={3.5 * fps}>
            <CinematicText text="RECLAIM YOUR" subText="TIME & FREEDOM" delayPop={10} isPositive={true} />
        </Series.Sequence>

        {/* Scene 6: Outro CTA (21 - 25s) */}
        <Series.Sequence durationInFrames={4 * fps}>
             <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
                <div style={{
                    transform: `scale(${spring({ frame, fps, config: { damping: 14, stiffness: 120 } })})`,
                    marginBottom: 60
                }}>
                    <Img src={staticFile("logo.png")} style={{ width: 350, height: 'auto' }} />
                </div>
                <div style={{
                    padding: "30px 60px",
                    background: "rgba(212, 175, 55, 0.15)",
                    border: `2px solid ${COLOR_GOLD}`,
                    borderRadius: 20,
                    boxShadow: `0 0 50px rgba(212, 175, 55, 0.2)`,
                    transform: `scale(${spring({ frame: frame - 15, fps, config: { damping: 12, stiffness: 200 } })})`
                }}>
                    <div style={{ fontSize: 45, color: COLOR_GOLD, fontWeight: 900, fontFamily: "Inter" }}>
                        QUANTUMALGOSYSTEMS.COM
                    </div>
                </div>
            </AbsoluteFill>
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

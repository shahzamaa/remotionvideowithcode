import React, { useMemo } from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
  AbsoluteFill,
} from "remotion";

const COLOR_MAIN = "#00d4ff";
const COLOR_BG = "#020617";
const COLOR_LINE = "rgba(0, 212, 255, 0.15)";

const Chip: React.FC<{ x: number; y: number; size: number; label: string }> = ({
  x,
  y,
  size,
  label,
}) => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame / 20) * 0.2 + 0.8;

  return (
    <g transform={`translate(${x - size / 2}, ${y - size / 2})`}>
      <rect
        width={size}
        height={size}
        fill={COLOR_BG}
        stroke={COLOR_MAIN}
        strokeWidth="2"
        rx="2"
        style={{
          filter: `drop-shadow(0 0 ${8 * pulse}px ${COLOR_MAIN})`,
        }}
      />
      <text
        x={size / 2}
        y={size / 2 + 5}
        fill={COLOR_MAIN}
        fontSize="12"
        fontFamily="sans-serif"
        textAnchor="middle"
        style={{ fontWeight: "bold", opacity: pulse }}
      >
        {label}
      </text>
    </g>
  );
};

const DataPulse: React.FC<{ path: string; delay: number; duration: number }> = ({
  path,
  delay,
  duration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = interpolate(
    frame,
    [delay * fps, (delay + duration) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    }
  );

  if (progress <= 0 || progress >= 1) return null;

  return (
    <path
      d={path}
      fill="none"
      stroke={COLOR_MAIN}
      strokeWidth="3"
      strokeLinecap="round"
      style={{
        strokeDasharray: "30 1000",
        strokeDashoffset: interpolate(progress, [0, 1], [800, 0]),
        filter: "drop-shadow(0 0 10px #00d4ff)",
        opacity: Math.sin(progress * Math.PI), // Fade in and out
      }}
    />
  );
};

export const Circuit: React.FC = () => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  const paths = useMemo(() => {
    const p = [];
    const centerX = width / 2;
    const centerY = height / 2;

    // Incoming lines from top/bottom
    for (let i = -5; i <= 5; i++) {
        const x = centerX + i * 40;
        p.push(`M ${x} 0 V ${centerY - 100}`);
        p.push(`M ${x} ${height} V ${centerY + 100}`);
    }

    // Horizontal lines
    for (let i = -3; i <= 3; i++) {
        const y = centerY + i * 40;
        p.push(`M 0 ${y} H ${centerX - 100}`);
        p.push(`M ${width} ${y} H ${centerX + 100}`);
    }

    // Diagonal connections to CPU
    p.push(`M ${centerX - 100} ${centerY - 100} L ${centerX - 50} ${centerY - 50}`);
    p.push(`M ${centerX + 100} ${centerY - 100} L ${centerX + 50} ${centerY - 50}`);
    p.push(`M ${centerX - 100} ${centerY + 100} L ${centerX - 50} ${centerY + 50}`);
    p.push(`M ${centerX + 100} ${centerY + 100} L ${centerX + 50} ${centerY + 50}`);

    return p;
  }, [width, height]);

  // Camera movement (slight zoom and pan for slow motion feel)
  const zoom = interpolate(frame, [0, 300], [1, 1.1], {
    easing: Easing.bezier(0.33, 1, 0.68, 1),
  });
  
  const panX = interpolate(frame, [0, 300], [0, -20]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLOR_BG, overflow: 'hidden' }}>
      <div style={{
          transform: `scale(${zoom}) translateX(${panX}px)`,
          width: '100%',
          height: '100%'
      }}>
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            style={{ width: "100%", height: "100%" }}
        >
            {/* Grid */}
            <defs>
            <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
            >
                <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(0, 212, 255, 0.03)"
                strokeWidth="1"
                />
            </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Static Lines */}
            {paths.map((p, i) => (
                <path
                    key={i}
                    d={p}
                    fill="none"
                    stroke={COLOR_LINE}
                    strokeWidth="1"
                />
            ))}

            {/* Pulses */}
            {paths.map((p, i) => (
                <React.Fragment key={i}>
                    <DataPulse path={p} delay={(i * 0.1) % 5} duration={3} />
                    <DataPulse path={p} delay={((i * 0.1) + 2.5) % 5} duration={3} />
                </React.Fragment>
            ))}

            {/* Components */}
            <Chip x={width / 2} y={height / 2} size={100} label="CPU-TX8" />
            <Chip x={width / 2 - 250} y={height / 2 - 150} size={60} label="MEM_A" />
            <Chip x={width / 2 + 250} y={height / 2 - 150} size={60} label="MEM_B" />
            <Chip x={width / 2 - 250} y={height / 2 + 150} size={60} label="I/O_0" />
            <Chip x={width / 2 + 250} y={height / 2 + 150} size={60} label="I/O_1" />
            
            {/* Scanning light overlay */}
            <rect 
                width={width * 2} 
                height="2" 
                fill={COLOR_MAIN} 
                y={interpolate(frame % 150, [0, 150], [-20, height + 20])}
                style={{ opacity: 0.2, filter: 'blur(4px)' }}
            />
        </svg>
      </div>
      
      {/* Title Overlay */}
      <div style={{
          position: 'absolute',
          bottom: 40,
          left: 40,
          color: COLOR_MAIN,
          fontFamily: 'monospace',
          fontSize: 24,
          opacity: interpolate(frame, [0, 30], [0, 0.8], { extrapolateRight: 'clamp' })
      }}>
          {`> system_status: [OPTIMAL]\n> data_flow: [ACTIVE]`}
      </div>
    </AbsoluteFill>
  );
};

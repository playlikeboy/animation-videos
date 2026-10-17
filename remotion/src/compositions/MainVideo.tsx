import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig
} from "remotion";

export interface MainVideoProps {
  title: string;
  subtitle: string;
}

export const MainVideo: React.FC<MainVideoProps> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring animation
  const titleSpring = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 90
    }
  });

  const subtitleOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp"
  });

  const cardScale = interpolate(frame, [0, 180], [1, 1.05], {
    extrapolateRight: "clamp"
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#070b14",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}
    >
      {/* Background ambient radial glow */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, rgba(0, 0, 0, 0) 70%)",
          filter: "blur(60px)"
        }}
      />

      {/* Main Glassmorphic Card */}
      <div
        style={{
          width: 1100,
          height: 600,
          borderRadius: 24,
          background: "rgba(15, 23, 42, 0.75)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 25px 70px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 60,
          textAlign: "center",
          transform: `scale(${cardScale})`
        }}
      >
        <div
          style={{
            padding: "8px 20px",
            borderRadius: 9999,
            backgroundColor: "rgba(59, 130, 246, 0.15)",
            border: "1px solid rgba(59, 130, 246, 0.4)",
            color: "#60a5fa",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 24
          }}
        >
          REMOTION FRAMEWORK
        </div>

        <h1
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#ffffff",
            margin: 0,
            letterSpacing: -2,
            transform: `scale(${titleSpring})`,
            opacity: titleSpring
          }}
        >
          {title}
        </h1>

        <p
          style={{
            fontSize: 28,
            color: "#94a3b8",
            marginTop: 20,
            maxWidth: 800,
            opacity: subtitleOpacity
          }}
        >
          {subtitle}
        </p>
      </div>
    </AbsoluteFill>
  );
};

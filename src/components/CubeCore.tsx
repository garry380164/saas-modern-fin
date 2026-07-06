"use client";

import React, { useEffect, useRef } from "react";

interface CubeCoreProps {
  /** Canvas pixel width */
  size?: number;
  /** CSS className applied to the canvas element */
  className?: string;
}

/**
 * CubeCore — Standalone 3D rotating nested-cube (Tesseract) with wireframe sphere.
 *
 * Renders the same visual as the central data-ledger core in the Hero section,
 * wrapped inside a transparent wireframe sphere made of longitude/latitude lines.
 *
 * Shared by HeroBackground (via inline drawing on its full-screen canvas) and
 * ScrollStory Stage 2 (via this component).
 */
export default function CubeCore({ size = 200, className = "" }: CubeCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let time = 0;

    // ─── Cube geometry (matches Hero cubeSize1=28, cubeSize2=15) ───
    const s = size / 200; // scale factor relative to default 200
    const sz1 = 28 * s;
    const sz2 = 15 * s;

    const makeVerts = (half: number) => [
      { x: -half, y: -half, z: -half },
      { x: half, y: -half, z: -half },
      { x: half, y: half, z: -half },
      { x: -half, y: half, z: -half },
      { x: -half, y: -half, z: half },
      { x: half, y: -half, z: half },
      { x: half, y: half, z: half },
      { x: -half, y: half, z: half },
    ];

    const vtx1 = makeVerts(sz1);
    const vtx2 = makeVerts(sz2);
    const edges: [number, number][] = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];

    // ─── Sphere wireframe radius ───
    const sphereRadius = 42 * s;

    // ─── Draw loop ───
    const cx = size / 2;
    const cy = size / 2;

    const draw = () => {
      time += 0.008;
      ctx.clearRect(0, 0, size, size);

      const rx = time * 0.5;
      const ry = time * 0.7;

      const project = (x: number, y: number, z: number) => {
        // Rotate Y
        const x1 = x * Math.cos(ry) - z * Math.sin(ry);
        const z1 = x * Math.sin(ry) + z * Math.cos(ry);
        const y1 = y;
        // Rotate X
        const x2 = x1;
        const y2 = y1 * Math.cos(rx) - z1 * Math.sin(rx);
        const z2 = y1 * Math.sin(rx) + z1 * Math.cos(rx);
        // Perspective
        const d = 140 * s;
        const scale = d / (d + z2);
        return { x: cx + x2 * scale, y: cy + y2 * scale, z: z2, scale };
      };

      // 1. Sphere wireframe (longitude + latitude)
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "rgba(6, 182, 212, 0.15)";
      const steps = 32;

      // 4 Longitude rings
      [0, Math.PI / 4, Math.PI / 2, Math.PI * 3 / 4].forEach(phi => {
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const theta = (i / steps) * Math.PI * 2;
          const pt = project(
            sphereRadius * Math.cos(theta) * Math.cos(phi),
            sphereRadius * Math.sin(theta),
            sphereRadius * Math.cos(theta) * Math.sin(phi),
          );
          i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      });

      // 5 Latitude rings
      [-Math.PI / 3, -Math.PI / 6, 0, Math.PI / 6, Math.PI / 3].forEach(lat => {
        ctx.beginPath();
        const rLat = sphereRadius * Math.cos(lat);
        const yLat = sphereRadius * Math.sin(lat);
        for (let i = 0; i <= steps; i++) {
          const theta = (i / steps) * Math.PI * 2;
          const pt = project(rLat * Math.cos(theta), yLat, rLat * Math.sin(theta));
          i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      });

      // 2. Project cubes
      const p1 = vtx1.map(v => project(v.x, v.y, v.z));
      const p2 = vtx2.map(v => project(v.x, v.y, v.z));

      // Tesseract connectors
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        ctx.moveTo(p1[i].x, p1[i].y);
        ctx.lineTo(p2[i].x, p2[i].y);
      }
      ctx.strokeStyle = "rgba(15, 23, 42, 0.08)";
      ctx.lineWidth = 0.6;
      ctx.stroke();

      // Outer cube (emerald)
      ctx.beginPath();
      edges.forEach(([a, b]) => { ctx.moveTo(p1[a].x, p1[a].y); ctx.lineTo(p1[b].x, p1[b].y); });
      ctx.strokeStyle = "rgba(16, 185, 129, 0.38)";
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // Inner cube (cyan)
      ctx.beginPath();
      edges.forEach(([a, b]) => { ctx.moveTo(p2[a].x, p2[a].y); ctx.lineTo(p2[b].x, p2[b].y); });
      ctx.strokeStyle = "rgba(6, 182, 212, 0.45)";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Vertex glow dots
      p1.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2 * pt.scale, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#06b6d4";
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // ─── 5. Two independent orbital rings (fully decoupled from cube rotation) ───
      const ringRadius = 52 * s;
      const ringSteps = 64;
      const d = 140 * s; // perspective distance (same constant)

      // Raw perspective projection — NO global rx/ry rotation applied
      const projectRaw = (x: number, y: number, z: number) => {
        const scale = d / (d + z);
        return { x: cx + x * scale, y: cy + y * scale };
      };

      // Draw a single ring with its own rotation state
      const drawRing = (
        tiltX: number, tiltY: number, tiltZ: number,
        color: string, width: number,
      ) => {
        ctx.beginPath();
        for (let i = 0; i <= ringSteps; i++) {
          const theta = (i / ringSteps) * Math.PI * 2;
          // Start as a circle on XZ plane
          let px = Math.cos(theta) * ringRadius;
          let py = 0;
          let pz = Math.sin(theta) * ringRadius;

          // Rotate X
          let y1 = py * Math.cos(tiltX) - pz * Math.sin(tiltX);
          let z1 = py * Math.sin(tiltX) + pz * Math.cos(tiltX);
          py = y1; pz = z1;

          // Rotate Y
          let x2 = px * Math.cos(tiltY) - pz * Math.sin(tiltY);
          let z2 = px * Math.sin(tiltY) + pz * Math.cos(tiltY);
          px = x2; pz = z2;

          // Rotate Z
          let x3 = px * Math.cos(tiltZ) - py * Math.sin(tiltZ);
          let y3 = px * Math.sin(tiltZ) + py * Math.cos(tiltZ);
          px = x3; py = y3;

          const pt = projectRaw(px, py, pz);
          i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
      };

      // Ring 1 — amber/gold, slow tumble driven by its own time factors
      drawRing(
        time * 0.35,          // X rotation — slow roll
        time * 0.55,          // Y rotation — moderate yaw
        Math.PI / 3,          // Z tilt — fixed 60° offset
        "rgba(251, 191, 36, 0.32)", 1.2,
      );

      // Ring 2 — violet/purple, faster spin on different axes, opposite feel
      drawRing(
        Math.PI * 5 / 12,     // X tilt — fixed 75° offset
        -time * 0.4,          // Y rotation — reverse direction
        time * 0.65,          // Z rotation — independent roll
        "rgba(168, 85, 247, 0.30)", 1.0,
      );

      animFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animFrame);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={`pointer-events-none ${className}`}
    />
  );
}

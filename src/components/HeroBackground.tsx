"use client";

import React, { useEffect, useRef } from "react";

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Parallax mouse position refs (replaces React state to prevent component re-renders)
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });

  // Handle mouse movement for 3D deflection
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const width = window.innerWidth;
      const height = window.innerHeight;
      targetMouseRef.current = {
        x: (clientX / width) * 2 - 1,
        y: (clientY / height) * 2 - 1,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Smooth mouse interpolation (lerp) inside ref
  useEffect(() => {
    let animationFrameId: number;
    const lerp = () => {
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.08;
      animationFrameId = requestAnimationFrame(lerp);
    };
    lerp();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // 3D Financial Data and AI Platform Animation drawing logic (Full-Screen Background)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let time = 0;

    // Use ResizeObserver for robust layout size monitoring
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        const height = entry.contentRect.height;
        
        if (width > 0 && height > 0) {
          canvas.width = width * window.devicePixelRatio;
          canvas.height = height * window.devicePixelRatio;
          const context = canvas.getContext("2d");
          if (context) {
            context.scale(window.devicePixelRatio, window.devicePixelRatio);
          }
        }
      }
    });

    resizeObserver.observe(canvas);

    // Initial orientation angles for 3D environment
    let angleX = 0.25;
    let angleY = 0.35;
    let angleZ = 0.08;

    // LCG pseudorandom helper for stable/deterministic coordinates
    const lcg = (seed: number) => {
      let val = seed;
      return () => {
        val = (val * 1664525 + 1013904223) % 4294967296;
        return val / 4294967296;
      };
    };
    const rand = lcg(101);

    // 1. Generate Background Space Stars for depth (infinite particle space)
    const starCount = 65;
    const stars: { x: number; y: number; z: number; speed: number }[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (rand() - 0.5) * 1500,
        y: (rand() - 0.5) * 1000,
        z: -250 + rand() * 500, // Z from -250 to 250
        speed: 0.15 + rand() * 0.35
      });
    }

    // 2. Generate Central Neural Plexus (Nodes) distributed across wide space
    const nodeCount = 88;
    const nodes: { x: number; y: number; z: number; phase: number; speed: number; amp: number; r: number; id: number }[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const theta = Math.acos((rand() * 2) - 1);
      const phi = rand() * Math.PI * 2;
      // Distribute nodes from 80px out to 520px radius
      const dist = 80 + rand() * 440;
      nodes.push({
        x: Math.sin(theta) * Math.cos(phi) * dist,
        y: Math.sin(theta) * Math.sin(phi) * dist * 0.70, // Flattened vertically to match wide screen aspect ratio
        z: Math.cos(theta) * dist * 0.75,
        phase: rand() * Math.PI * 2,
        speed: 0.008 + rand() * 0.015,
        amp: 4 + rand() * 6,
        r: 0.9 + rand() * 2.0,
        id: i
      });
    }

    // 3. Generate Connections (Edges)
    const connections: { a: number; b: number; distance: number }[] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dz = nodes[i].z - nodes[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        // Connect if nodes are within network range
        if (dist < 135) {
          connections.push({ a: i, b: j, distance: dist });
        }
      }
    }

    // 4. Generate Data Signal Packets flowing along connections
    const packets: { edgeIndex: number; progress: number; speed: number; color: string }[] = [];
    const numPackets = 22;
    for (let p = 0; p < numPackets; p++) {
      packets.push({
        edgeIndex: Math.floor(rand() * connections.length),
        progress: rand(),
        speed: 0.005 + rand() * 0.01,
        color: rand() > 0.45 ? "rgba(16, 185, 129, 0.75)" : "rgba(6, 182, 212, 0.75)"
      });
    }

    // 5. Generate Vortex Particles (flowing transactions)
    const vortexParticles: { radius: number; speed: number; angle: number; y: number; ySpeed: number; color: string; size: number }[] = [];
    const numVortex = 26;
    for (let i = 0; i < numVortex; i++) {
      vortexParticles.push({
        radius: 120 + rand() * 450,
        speed: 0.004 + rand() * 0.006,
        angle: rand() * Math.PI * 2,
        y: -140 + rand() * 280,
        ySpeed: -0.25 - rand() * 0.45,
        color: rand() > 0.5 ? "rgba(16, 185, 129, 0.55)" : "rgba(6, 182, 212, 0.55)",
        size: 0.8 + rand() * 1.2
      });
    }

    // 6. Central 3D Cube core (Nested wireframe data vaults in the screen center)
    const cubeSize1 = 28;
    const cubeVertices1 = [
      { x: -cubeSize1, y: -cubeSize1, z: -cubeSize1 },
      { x: cubeSize1, y: -cubeSize1, z: -cubeSize1 },
      { x: cubeSize1, y: cubeSize1, z: -cubeSize1 },
      { x: -cubeSize1, y: cubeSize1, z: -cubeSize1 },
      { x: -cubeSize1, y: -cubeSize1, z: cubeSize1 },
      { x: cubeSize1, y: -cubeSize1, z: cubeSize1 },
      { x: cubeSize1, y: cubeSize1, z: cubeSize1 },
      { x: -cubeSize1, y: cubeSize1, z: cubeSize1 },
    ];
    const cubeSize2 = 15;
    const cubeVertices2 = [
      { x: -cubeSize2, y: -cubeSize2, z: -cubeSize2 },
      { x: cubeSize2, y: -cubeSize2, z: -cubeSize2 },
      { x: cubeSize2, y: cubeSize2, z: -cubeSize2 },
      { x: -cubeSize2, y: cubeSize2, z: -cubeSize2 },
      { x: -cubeSize2, y: -cubeSize2, z: cubeSize2 },
      { x: cubeSize2, y: -cubeSize2, z: cubeSize2 },
      { x: cubeSize2, y: cubeSize2, z: cubeSize2 },
      { x: -cubeSize2, y: cubeSize2, z: cubeSize2 },
    ];
    const cubeEdges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // back
      [4, 5], [5, 6], [6, 7], [7, 4], // front
      [0, 4], [1, 5], [2, 6], [3, 7]  // connectors
    ];

    // Main animation loop
    const draw = () => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;

      if (w === 0 || h === 0) {
        animFrame = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      // Tame the scale ratio for full screen to prevent massive rendering on ultra-wide screens
      const baseScale = Math.min(1.4, Math.max(0.75, w / 1200));

      // Scroll factors to rotate and push depth
      const scrollVal = window.scrollY / 1000;
      
      // Tame mouse parallax rotations slightly for screen-filling panorama feel
      const rx = angleX + mouseRef.current.y * 0.12 + scrollVal * 0.7;
      const ry = angleY + mouseRef.current.x * 0.16 + scrollVal * 0.9;
      const rz = angleZ + scrollVal * 0.3;

      const cx = w / 2;
      const cy = h / 2;

      // 3D Perspective Projection Helper
      const project = (x: number, y: number, z: number) => {
        const sx = x * baseScale;
        const sy = y * baseScale;
        const sz = z * baseScale;

        // Rotate Z
        const x1 = sx * Math.cos(rz) - sy * Math.sin(rz);
        const y1 = sx * Math.sin(rz) + sy * Math.cos(rz);
        const z1 = sz;

        // Rotate Y
        const x2 = x1 * Math.cos(ry) + z1 * Math.sin(ry);
        const y2 = y1;
        const z2 = -x1 * Math.sin(ry) + z1 * Math.cos(ry);

        // Rotate X
        const x3 = x2;
        const y3 = y2 * Math.cos(rx) - z2 * Math.sin(rx);
        const z3 = y2 * Math.sin(rx) + z2 * Math.cos(rx);

        // Perspective camera projection
        const cameraDist = 550 * baseScale;
        const denom = cameraDist - z3;
        const scale = denom <= 10 ? 0 : cameraDist / denom;
        return {
          x: cx + x3 * scale,
          y: cy + y3 * scale,
          z: z3,
          scale: scale
        };
      };

      // Depth Fade Helper for fog-like spatial cueing
      const getDepthFade = (zVal: number) => {
        const rangeMin = -280 * baseScale;
        const rangeMax = 200 * baseScale;
        const norm = (zVal - rangeMin) / (rangeMax - rangeMin);
        return Math.min(1.0, Math.max(0.08, norm));
      };

      time += 1;

      // === A. DRAW 3D 星空粒子背景 ===
      stars.forEach((s) => {
        s.z += s.speed;
        if (s.z > 250) {
          s.z = -250;
          s.x = (rand() - 0.5) * 1500;
          s.y = (rand() - 0.5) * 1000;
        }

        const pt = project(s.x, s.y, s.z);
        const fade = getDepthFade(pt.z);

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, Math.max(0, 0.8 * pt.scale * baseScale * fade), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(15, 23, 42, ${0.03 + fade * 0.12})`;
        ctx.fill();
      });

      // === B. DRAW BOTTOM 3D FINANCIAL WAVE GRID ===
      const gridCols = 16;
      const gridRows = 10;
      const gridSpacing = Math.max(45, w / 18);
      const gridPoints: { px: number; py: number; z: number; scale: number }[][] = [];

      for (let c = 0; c < gridCols; c++) {
        gridPoints[c] = [];
        for (let r = 0; r < gridRows; r++) {
          const gx = (c - (gridCols - 1) / 2) * gridSpacing;
          const gz = (r - (gridRows - 1) / 2) * 55;
          const wave = Math.sin(c * 0.45 + time * 0.02) * Math.cos(r * 0.45 + time * 0.015) * 18;
          const gy = 170 + wave;
          const pt = project(gx, gy, gz);
          gridPoints[c][r] = { px: pt.x, py: pt.y, z: pt.z, scale: pt.scale };
        }
      }

      // Draw grid lines
      for (let c = 0; c < gridCols; c++) {
        for (let r = 0; r < gridRows; r++) {
          const pCur = gridPoints[c][r];
          const fade = getDepthFade(pCur.z);

          if (c < gridCols - 1) {
            const pNext = gridPoints[c + 1][r];
            ctx.beginPath();
            ctx.moveTo(pCur.px, pCur.py);
            ctx.lineTo(pNext.px, pNext.py);
            const opacity = Math.max(0.005, 0.06 * fade);
            ctx.strokeStyle = `rgba(15, 23, 42, ${opacity})`;
            ctx.lineWidth = 0.5 * baseScale * fade;
            ctx.stroke();
          }
          if (r < gridRows - 1) {
            const pNext = gridPoints[c][r + 1];
            ctx.beginPath();
            ctx.moveTo(pCur.px, pCur.py);
            ctx.lineTo(pNext.px, pNext.py);
            const opacity = Math.max(0.005, 0.06 * fade);
            ctx.strokeStyle = `rgba(15, 23, 42, ${opacity})`;
            ctx.lineWidth = 0.5 * baseScale * fade;
            ctx.stroke();
          }
          ctx.beginPath();
          ctx.arc(pCur.px, pCur.py, Math.max(0, 1.0 * pCur.scale * baseScale * fade), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(15, 23, 42, ${0.08 + fade * 0.08})`;
          ctx.fill();
        }
      }

      // === C. DRAW CONCENTRIC RADAR SCANNING ORBITS ===
      const r1 = 260;
      ctx.beginPath();
      for (let d = 0; d <= 60; d++) {
        const theta = (d / 60) * Math.PI * 2;
        const pt = project(Math.cos(theta) * r1, 0, Math.sin(theta) * r1);
        if (d === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = "rgba(15, 23, 42, 0.07)";
      ctx.lineWidth = 0.8 * baseScale;
      ctx.stroke();

      for (let d = 0; d < 24; d++) {
        const theta = (d / 24) * Math.PI * 2 + time * 0.003;
        const innerPt = project(Math.cos(theta) * (r1 - 6), 0, Math.sin(theta) * (r1 - 6));
        const outerPt = project(Math.cos(theta) * (r1 + 6), 0, Math.sin(theta) * (r1 + 6));
        ctx.beginPath();
        ctx.moveTo(innerPt.x, innerPt.y);
        ctx.lineTo(outerPt.x, outerPt.y);
        const opVal = 0.08 + Math.max(0, Math.cos(theta+time*0.01)) * 0.25;
        ctx.strokeStyle = `rgba(16, 185, 129, ${opVal})`;
        ctx.lineWidth = 1 * baseScale;
        ctx.stroke();
      }

      const r2 = 340;
      const tiltRad = Math.PI / 5.5; 
      ctx.setLineDash([4, 10]);
      ctx.beginPath();
      for (let d = 0; d <= 72; d++) {
        const theta = (d / 72) * Math.PI * 2;
        const lx = Math.cos(theta) * r2;
        const ly = Math.sin(theta) * r2 * Math.cos(tiltRad);
        const lz = Math.sin(theta) * r2 * Math.sin(tiltRad);
        const pt = project(lx, ly, lz);
        if (d === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = "rgba(6, 182, 212, 0.15)";
      ctx.lineWidth = 1.0 * baseScale;
      ctx.stroke();
      ctx.setLineDash([]);

      const satAngle = time * 0.010;
      const satX = Math.cos(satAngle) * r2;
      const satY = Math.sin(satAngle) * r2 * Math.cos(tiltRad);
      const satZ = Math.sin(satAngle) * r2 * Math.sin(tiltRad);
      const satPt = project(satX, satY, satZ);
      
      ctx.beginPath();
      ctx.arc(satPt.x, satPt.y, Math.max(0, 4 * satPt.scale * baseScale), 0, Math.PI * 2);
      ctx.fillStyle = "#06b6d4";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(satPt.x, satPt.y, Math.max(0, (8 + Math.sin(time * 0.1) * 3) * satPt.scale * baseScale), 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(6, 182, 212, 0.25)";
      ctx.lineWidth = 0.8 * baseScale;
      ctx.stroke();

      const r3 = 420;
      const blockTrackTilt = -Math.PI / 8;
      ctx.beginPath();
      for (let d = 0; d <= 60; d++) {
        const theta = (d / 60) * Math.PI * 2;
        const lx = Math.cos(theta) * r3;
        const ly = Math.sin(theta) * r3 * Math.cos(blockTrackTilt);
        const lz = Math.sin(theta) * r3 * Math.sin(blockTrackTilt);
        const pt = project(lx, ly, lz);
        if (d === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = "rgba(15, 23, 42, 0.03)";
      ctx.stroke();

      for (let b = 0; b < 3; b++) {
        const angle = time * 0.004 + (b / 3) * Math.PI * 2;
        const bx = Math.cos(angle) * r3;
        const by = Math.sin(angle) * r3 * Math.cos(blockTrackTilt);
        const bz = Math.sin(angle) * r3 * Math.sin(blockTrackTilt);
        
        const size = 8;
        const c1 = project(bx - size, by - size, bz - size);
        const c2 = project(bx + size, by - size, bz - size);
        const c3 = project(bx + size, by + size, bz - size);
        const c4 = project(bx - size, by + size, bz - size);
        const c5 = project(bx - size, by - size, bz + size);
        const c6 = project(bx + size, by - size, bz + size);
        const c7 = project(bx + size, by + size, bz + size);
        const c8 = project(bx - size, by + size, bz + size);
        
        ctx.beginPath();
        ctx.moveTo(c1.x, c1.y); ctx.lineTo(c2.x, c2.y); ctx.lineTo(c3.x, c3.y); ctx.lineTo(c4.x, c4.y); ctx.closePath();
        ctx.moveTo(c5.x, c5.y); ctx.lineTo(c6.x, c6.y); ctx.lineTo(c7.x, c7.y); ctx.lineTo(c8.x, c8.y); ctx.closePath();
        ctx.moveTo(c1.x, c1.y); ctx.lineTo(c5.x, c5.y);
        ctx.moveTo(c2.x, c2.y); ctx.lineTo(c6.x, c6.y);
        ctx.moveTo(c3.x, c3.y); ctx.lineTo(c7.x, c7.y);
        ctx.moveTo(c4.x, c4.y); ctx.lineTo(c8.x, c8.y);
        ctx.strokeStyle = "rgba(15, 23, 42, 0.15)";
        ctx.lineWidth = 0.8 * baseScale;
        ctx.stroke();

        ctx.fillStyle = "rgba(16, 185, 129, 0.1)";
        ctx.beginPath();
        ctx.moveTo(c5.x, c5.y); ctx.lineTo(c6.x, c6.y); ctx.lineTo(c7.x, c7.y); ctx.lineTo(c8.x, c8.y); ctx.closePath();
        ctx.fill();
      }

      // === D. DRAW VORTEX TRANSACTION PARTICLES ===
      vortexParticles.forEach((vp) => {
        vp.angle += vp.speed;
        vp.y += vp.ySpeed;

        if (vp.y < -150) {
          vp.y = 150;
          vp.radius = 120 + Math.random() * 450;
        }

        const px = Math.cos(vp.angle) * vp.radius;
        const pz = Math.sin(vp.angle) * vp.radius;
        const pt = project(px, vp.y, pz);
        const fade = getDepthFade(pt.z);

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, Math.max(0, vp.size * pt.scale * baseScale * fade), 0, Math.PI * 2);
        ctx.fillStyle = vp.color;
        ctx.fill();

        const trailX = Math.cos(vp.angle - vp.speed * 2.5) * vp.radius;
        const trailZ = Math.sin(vp.angle - vp.speed * 2.5) * vp.radius;
        const trailPt = project(trailX, vp.y - vp.ySpeed * 2.5, trailZ);
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(trailPt.x, trailPt.y);
        ctx.strokeStyle = vp.color.replace("0.55", (0.12 * fade).toString());
        ctx.lineWidth = 0.8 * pt.scale * baseScale * fade;
        ctx.stroke();
      });

      // === E. DRAW CENTRAL DATA LEDGER CORE ===
      const coreSpeedX = time * 0.008;
      const coreSpeedY = time * 0.012;

      const projectCore = (x: number, y: number, z: number, sizeScale: number) => {
        const lx = x * sizeScale;
        const ly = y * sizeScale;
        const lz = z * sizeScale;
        
        const x1 = lx * Math.cos(coreSpeedY) - lz * Math.sin(coreSpeedY);
        const z1 = lx * Math.sin(coreSpeedY) + lz * Math.cos(coreSpeedY);
        const y1 = ly;

        const x2 = x1;
        const y2 = y1 * Math.cos(coreSpeedX) - z1 * Math.sin(coreSpeedX);
        const z2 = y1 * Math.sin(coreSpeedX) + z1 * Math.cos(coreSpeedX);

        return project(x2, y2, z2);
      };

      const projectedCube1 = cubeVertices1.map(v => projectCore(v.x, v.y, v.z, 1.0));
      ctx.beginPath();
      cubeEdges.forEach(([start, end]) => {
        ctx.moveTo(projectedCube1[start].x, projectedCube1[start].y);
        ctx.lineTo(projectedCube1[end].x, projectedCube1[end].y);
      });
      ctx.strokeStyle = "rgba(16, 185, 129, 0.32)"; 
      ctx.lineWidth = 1.0 * baseScale;
      ctx.stroke();

      const projectedCube2 = cubeVertices2.map(v => projectCore(v.x, v.y, v.z, 1.0));
      ctx.beginPath();
      cubeEdges.forEach(([start, end]) => {
        ctx.moveTo(projectedCube2[start].x, projectedCube2[start].y);
        ctx.lineTo(projectedCube2[end].x, projectedCube2[end].y);
      });
      ctx.strokeStyle = "rgba(6, 182, 212, 0.40)"; 
      ctx.lineWidth = 0.8 * baseScale;
      ctx.stroke();

      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        ctx.moveTo(projectedCube1[i].x, projectedCube1[i].y);
        ctx.lineTo(projectedCube2[i].x, projectedCube2[i].y);
      }
      ctx.strokeStyle = "rgba(15, 23, 42, 0.06)";
      ctx.lineWidth = 0.5 * baseScale;
      ctx.stroke();

      // === F. DRAW NEURAL NETWORK GRAPH PLEXUS ===
      const animatedNodes = nodes.map((node) => {
        const offset = Math.sin(node.phase + time * node.speed) * node.amp;
        return {
          x: node.x + (node.x / 120) * offset,
          y: node.y + (node.y / 120) * offset,
          z: node.z + (node.z / 120) * offset,
          r: node.r,
          id: node.id
        };
      });

      const projectedNodes = animatedNodes.map(n => {
        const pt = project(n.x, n.y, n.z);
        return { px: pt.x, py: pt.y, z: pt.z, scale: pt.scale, r: n.r };
      });

      ctx.beginPath();
      connections.forEach((edge) => {
        const nodeA = projectedNodes[edge.a];
        const nodeB = projectedNodes[edge.b];
        
        ctx.moveTo(nodeA.px, nodeA.py);
        ctx.lineTo(nodeB.px, nodeB.py);
      });
      ctx.strokeStyle = "rgba(15, 23, 42, 0.045)";
      ctx.lineWidth = 0.6 * baseScale;
      ctx.stroke();

      packets.forEach((packet) => {
        packet.progress += packet.speed;
        if (packet.progress >= 1.0) {
          packet.progress = 0;
          packet.edgeIndex = Math.floor(Math.random() * connections.length);
        }

        const edge = connections[packet.edgeIndex];
        if (!edge) return;

        const nodeA = animatedNodes[edge.a];
        const nodeB = animatedNodes[edge.b];

        const px = nodeA.x + (nodeB.x - nodeA.x) * packet.progress;
        const py = nodeA.y + (nodeB.y - nodeA.y) * packet.progress;
        const pz = nodeA.z + (nodeB.z - nodeA.z) * packet.progress;

        const pt = project(px, py, pz);
        const fade = getDepthFade(pt.z);

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, Math.max(0, 2.2 * pt.scale * baseScale * fade), 0, Math.PI * 2);
        ctx.fillStyle = packet.color.replace("0.75", (0.75 * fade).toString());
        ctx.fill();
      });

      projectedNodes.forEach((node) => {
        const fade = getDepthFade(node.z);
        ctx.beginPath();
        ctx.arc(node.px, node.py, Math.max(0, node.r * node.scale * baseScale * (0.6 + fade * 0.4)), 0, Math.PI * 2);
        const depthOpacity = 0.08 + fade * 0.28;
        ctx.fillStyle = `rgba(15, 23, 42, ${depthOpacity})`;
        ctx.fill();

        if (node.z > 80 * baseScale) {
          ctx.beginPath();
          ctx.arc(node.px, node.py, Math.max(0, (node.r + 1.2) * node.scale * baseScale * fade), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(16, 185, 129, ${0.2 * fade})`;
          ctx.lineWidth = 0.5 * baseScale * fade;
          ctx.stroke();
        }
      });

      angleX += 0.0004;
      angleY += 0.0006;
      angleZ += 0.0002;

      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-10"
    />
  );
}

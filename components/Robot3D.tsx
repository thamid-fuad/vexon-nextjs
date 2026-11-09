"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

/**
 * The Vexon robot as React Three Fiber curved meshes — the same approach
 * as the approved static build's r3f-bundle.js (head/body as separate
 * curved meshes in one group, rotating together).
 *
 * Spin cycle = 7s, matching the approved timing exactly:
 * spin 0–1.5s (0→360°), hold to 3s, spin 3–4.5s (360→720°), hold to 7s.
 * 720° at the loop point is the same pose as 0°, so the loop is seamless.
 * Head + body always rotate TOGETHER, in place — never separately.
 */
function spinAngle(elapsed: number): number {
  const t = elapsed % 7;
  if (t < 1.5) return (t / 1.5) * Math.PI * 2;
  if (t < 3) return Math.PI * 2;
  if (t < 4.5) return Math.PI * 2 + ((t - 3) / 1.5) * Math.PI * 2;
  return Math.PI * 4;
}

function useCurvedPlane(width: number, height: number) {
  return useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, height, 24, 24);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      // Gentle cylindrical curve so the flat artwork reads as 3D.
      pos.setZ(i, -0.28 * Math.pow(x / (width / 2), 2));
    }
    geo.computeVertexNormals();
    return geo;
  }, [width, height]);
}

function CurvedRobot({ onReady }: { onReady: () => void }) {
  const group = useRef<THREE.Group>(null);
  const headTex = useTexture("/robot-head.png");
  const bodyTex = useTexture("/robot-body.png");
  const headGeo = useCurvedPlane(1.62, 2);
  const bodyGeo = useCurvedPlane(1.62, 2);

  useEffect(() => {
    onReady();
  }, [headTex, bodyTex, onReady]);

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = spinAngle(clock.getElapsedTime());
    }
  });

  return (
    <group ref={group}>
      <mesh geometry={bodyGeo}>
        <meshBasicMaterial map={bodyTex} transparent toneMapped={false} />
      </mesh>
      <mesh geometry={headGeo}>
        <meshBasicMaterial map={headTex} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}

function FitCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    // Keep the whole 593×731 figure in frame at any container size.
    cam.position.set(0, 0, 3.4);
    cam.aspect = size.width / Math.max(size.height, 1);
    cam.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

export default function Robot3D({ onReady }: { onReady: () => void }) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 3.4], fov: 40 }}
      style={{ background: "transparent" }}
    >
      <FitCamera />
      <CurvedRobot onReady={onReady} />
    </Canvas>
  );
}

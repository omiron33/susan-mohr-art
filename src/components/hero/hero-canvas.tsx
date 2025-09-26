"use client";

import { Canvas, useFrame, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

const BrushMaterial = shaderMaterial(
  { uTime: 0 },
  /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    mat2 m = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p = m * p * 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    float time = uTime * 0.25;
    float flowing = fbm(uv * 3.2 + vec2(time * 0.8, -time * 0.5));
    float ripple = sin((uv.x * 4.1 + time * 1.5)) * 0.25;
    float swirl = cos((uv.y * 5.0 - time * 0.9)) * 0.2;

    pos.z += (flowing * 0.8) + ripple * 0.6 + swirl * 0.55;
    pos.x += (fbm(uv * 2.4 + time) - 0.5) * 0.22;
    pos.y += (fbm(uv * 2.7 - time) - 0.5) * 0.18;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`,
  /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    mat2 m = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 6; i++) {
      value += amplitude * noise(p);
      p = m * p * 2.05;
      amplitude *= 0.5;
    }
    return value;
  }

  vec3 palette(float t) {
    vec3 warmSun = vec3(0.98, 0.85, 0.74);
    vec3 blushRose = vec3(0.95, 0.76, 0.80);
    vec3 twilightLilac = vec3(0.82, 0.79, 0.95);
    vec3 coastalMist = vec3(0.78, 0.91, 0.97);
    vec3 meadowGreen = vec3(0.80, 0.94, 0.84);

    float c1 = smoothstep(0.0, 0.4, t);
    float c2 = smoothstep(0.2, 0.7, t);
    float c3 = smoothstep(0.5, 1.0, t);

    vec3 base = mix(warmSun, blushRose, c1);
    base = mix(base, twilightLilac, c2);
    base = mix(base, coastalMist, c3);
    base = mix(base, meadowGreen, smoothstep(0.6, 1.0, 1.0 - t));

    return base;
  }

  void main() {
    vec2 uv = vUv;
    float time = uTime * 0.08;

    vec2 flowUv = uv * 2.6;
    flowUv.x += sin(time * 0.9 + uv.y * 3.4) * 0.6;
    flowUv.y += cos(time * 1.1 + uv.x * 3.8) * 0.45;

    float glaze = fbm(flowUv + vec2(time * 1.4, -time * 0.7));
    float underpaint = fbm(flowUv * 0.7 - vec2(time * 0.4, time * 0.5));
    float highlight = smoothstep(0.35, 0.85, fbm(flowUv * 1.8 + vec2(time * 0.9, time * 0.6)));

    float cycle = fract(time * 0.15 + fbm(flowUv * 0.35));
    float shimmer = 0.5 + 0.5 * sin(time * 0.7 + uv.x * 4.6 + uv.y * 2.8);

    vec3 warmBlend = palette(cycle);
    vec3 coolBlend = palette(fract(cycle + 0.45));
    vec3 accent = palette(fract(cycle + 0.78));

    vec3 color = mix(warmBlend, coolBlend, glaze);
    color = mix(color, accent, 0.25 + 0.35 * highlight);
    color = mix(color, mix(warmBlend, accent, shimmer), 0.18 + 0.22 * underpaint);

    float sheen = 0.82 + 0.18 * sin(time * 3.0 + uv.y * 4.8);
    color *= sheen;

    float vignette = smoothstep(1.05, 0.2, length(vUv - 0.5));
    color = mix(color, color * 0.78, vignette * 0.65);

    gl_FragColor = vec4(color, 0.9);
  }
`);

extend({ BrushMaterial });

type BrushMaterialImpl = THREE.ShaderMaterial & { uTime: number };

function PainterlyCanvas() {
  const materialRef = useRef<BrushMaterialImpl>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uTime = clock.getElapsedTime();
    }
  });

  return (
    <mesh position={[0, 0, -1.6]}>
      <planeGeometry args={[14, 9, 220, 220]} />
      {/* @ts-expect-error R3F shaderMaterial type inference */}
      <brushMaterial ref={materialRef} transparent depthWrite={false} />
    </mesh>
  );
}

function SoftPetalParticles() {
  const groupRef = useRef<THREE.Group>(null);
  const geometry = useMemo(() => new THREE.SphereGeometry(0.08, 16, 16), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#f6cce0"),
        transparent: true,
        opacity: 0.26,
      }),
    [],
  );

  const seededRandom = useMemo(() => {
    let seed = 421;
    return () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
  }, []);

  const randomInRange = useMemo(
    () =>
      function randomInRange(min: number, max: number) {
        return seededRandom() * (max - min) + min;
      },
    [seededRandom],
  );

  const petals = useMemo(
    () =>
      Array.from({ length: 20 }, () => ({
        base: [
          randomInRange(-2.3, 2.3),
          randomInRange(-1.4, 1.4),
          randomInRange(-0.6, 1.0),
        ] as [number, number, number],
        drift: [randomInRange(0.35, 0.9), randomInRange(0.25, 0.7)] as [number, number],
        scale: randomInRange(0.45, 1.2),
        speed: randomInRange(0.16, 0.44),
        offset: randomInRange(0, Math.PI * 2),
      })),
    [randomInRange],
  );

  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group) return;

    const time = clock.elapsedTime;
    group.children.forEach((child, idx) => {
      const petal = petals[idx];
      if (!petal || !(child instanceof THREE.Mesh)) return;

      const t = time * petal.speed + petal.offset;
      const flutter = 0.85 + Math.sin(t * 1.6) * 0.1;
      child.position.set(
        petal.base[0] + Math.sin(t * 0.8) * petal.drift[0],
        petal.base[1] + Math.cos(t * 1.1) * petal.drift[1],
        petal.base[2] + Math.sin(t * 0.6) * 0.9,
      );
      child.scale.setScalar(petal.scale * flutter);
    });
  });

  return (
    <group ref={groupRef}>
      {petals.map((petal, idx) => (
        <mesh key={idx} geometry={geometry} material={material} position={petal.base} scale={petal.scale} />
      ))}
    </group>
  );
}

interface HeroCanvasProps {
  className?: string;
}

export function HeroCanvas({ className }: HeroCanvasProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 h-full w-full overflow-hidden",
        className,
      )}
    >
      <Canvas
        className="h-full w-full"
        camera={{ position: [0, 0, 5], fov: 40 }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#fef8f4"]} />
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[2, 4, 3]}
          intensity={0.35}
          color={new THREE.Color("#ffe2cf")}
        />
        <PainterlyCanvas />
        <SoftPetalParticles />
      </Canvas>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_20%_20%,rgba(250,200,180,0.32),transparent_70%),radial-gradient(50%_50%_at_80%_15%,rgba(165,200,255,0.25),transparent_65%),radial-gradient(70%_70%_at_50%_80%,rgba(195,235,210,0.2),transparent_75%)] opacity-70 blur-3xl mix-blend-screen" />
        <div className="animate-aurora pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_85%,rgba(255,182,193,0.24),transparent_60%),radial-gradient(circle_at_85%_25%,rgba(163,203,255,0.26),transparent_62%),radial-gradient(circle_at_55%_15%,rgba(194,240,215,0.2),transparent_65%)]" />
      </div>
    </div>
  );
}

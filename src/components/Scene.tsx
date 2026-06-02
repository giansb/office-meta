import { Environment, Sky } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import Office from "./Office";

type SkyConfig = {
  sunPosition: [number, number, number];
  turbidity: number;
  rayleigh: number;
  mieCoefficient: number;
  mieDirectionalG: number;
};

type TimeConfig = {
  isNight: boolean;
  ambientColor: string;
  ambientIntensity: number;
  dirColor: string;
  dirIntensity: number;
  sky?: SkyConfig;
};

function getTimeConfig(hour: number): TimeConfig {

  if (hour >= 21 || hour < 6) {
    // Noite / madrugada — sem Sky, fundo escuro
    return {
      isNight: true,
      ambientColor: "#0a0a30",
      ambientIntensity: 0.15,
      dirColor: "#1a1a5a",
      dirIntensity: 0,
    };
  }

  if (hour < 11) {
    // Manhã (6h–10h) — sol baixo a leste, céu rosado/âmbar
    return {
      isNight: false,
      ambientColor: "#ffd580",
      ambientIntensity: 0.7,
      dirColor: "#ffcc66",
      dirIntensity: 2.0,
      sky: {
        sunPosition: [1, 0.2, 0],
        turbidity: 8,
        rayleigh: 2,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8,
      },
    };
  }

  if (hour < 17) {
    // Tarde (11h–16h) — sol alto, céu azul claro
    return {
      isNight: false,
      ambientColor: "#ffffff",
      ambientIntensity: 0.9,
      dirColor: "#fffaee",
      dirIntensity: 3.0,
      sky: {
        sunPosition: [0.3, 1, 0],
        turbidity: 10,
        rayleigh: 3,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8,
      },
    };
  }

  // Pôr do sol (17h–20h) — sol no horizonte, laranja intenso
  return {
    isNight: false,
    ambientColor: "#ff6b35",
    ambientIntensity: 0.6,
    dirColor: "#ff8030",
    dirIntensity: 1.5,
    sky: {
      sunPosition: [-1, 0.05, 0.5],
      turbidity: 20,
      rayleigh: 0.5,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.99,
    },
  };
}

function NightBackground() {
  const { scene } = useThree();
  useEffect(() => {
    scene.background = new THREE.Color("#020208");
    return () => {
      scene.background = null;
    };
  }, [scene]);
  return null;
}

export default function Scene({ hour }: { hour: number }) {
  const config = useMemo(() => getTimeConfig(hour), [hour]);

  return (
    <>
      {config.isNight ? (
        <NightBackground />
      ) : (
        <Sky
          sunPosition={config.sky!.sunPosition}
          turbidity={config.sky!.turbidity}
          rayleigh={config.sky!.rayleigh}
          mieCoefficient={config.sky!.mieCoefficient}
          mieDirectionalG={config.sky!.mieDirectionalG}
        />
      )}

      <ambientLight color={config.ambientColor} intensity={config.ambientIntensity} />

      <directionalLight
        castShadow
        position={[10, 15, 10]}
        color={config.dirColor}
        intensity={config.dirIntensity}
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
      />

      <Environment preset="apartment" />

      <Office />
    </>
  );
}

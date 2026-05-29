import { Environment } from "@react-three/drei";
import Office from "./Office";
import { EffectComposer, Bloom, SSAO } from "@react-three/postprocessing";

export default function Scene() {
  return (
    <>
   

      <directionalLight
        castShadow
        position={[10, 15, 10]}
        intensity={3}
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
      />

      <Environment preset="apartment" />

      <Office />
    </>
  );
}
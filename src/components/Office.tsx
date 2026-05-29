import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";
import type { ThreeEvent } from "@react-three/fiber";
import { useReservationStore } from "../store";

const CHAIR_PATTERN = /^polySurface17_Sep_12\d{3}$/;

function getChairName(mesh: THREE.Mesh): string | null {
  if (CHAIR_PATTERN.test(mesh.name)) return mesh.name;
  if (mesh.parent && CHAIR_PATTERN.test(mesh.parent.name)) return mesh.parent.name;
  return null;
}

export default function Office() {
  const { scene } = useGLTF("/models/chrome_5.glb");
  const { reservedChairs, selectedChair, setSelectedChair } =
    useReservationStore();

  useEffect(() => {
    scene.traverse((obj: any) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }

      if (obj.isMesh && CHAIR_PATTERN.test(obj.name)) {
        const existing = obj.children.find((c: THREE.Object3D) => c.userData.isOutline);
        if (existing) obj.remove(existing);

        const isReserved = reservedChairs.has(obj.name);
        const isSelected = obj.name === selectedChair;
        const color = isReserved ? "#FF4500" : isSelected ? "#FFD700" : "#00BFFF";

        const outlineMat = new THREE.MeshBasicMaterial({ color, side: THREE.BackSide });
        const outline = new THREE.Mesh(obj.geometry, outlineMat);
        outline.scale.setScalar(1.07);
        outline.userData.isOutline = true;
        obj.add(outline);
      }
    });

    return () => {
      scene.traverse((obj: any) => {
        if (obj.isMesh && CHAIR_PATTERN.test(obj.name)) {
          const outline = obj.children.find((c: THREE.Object3D) => c.userData.isOutline);
          if (outline) obj.remove(outline);
        }
      });
    };
  }, [scene, reservedChairs, selectedChair]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const name = getChairName(e.object as THREE.Mesh);
    if (name && !reservedChairs.has(name)) setSelectedChair(name);
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    const name = getChairName(e.object as THREE.Mesh);
    if (name && !reservedChairs.has(name)) {
      document.body.style.cursor = "pointer";
    }
  };

  const handlePointerOut = () => {
    document.body.style.cursor = "default";
  };

  return (
    <primitive
      object={scene}
      scale={1}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    />
  );
}
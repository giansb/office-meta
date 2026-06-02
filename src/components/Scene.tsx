import Office from "./Office";

export default function Scene() {
  return (
    <>
      <color attach="background" args={["#ffffff"]} />
      <ambientLight color="#ffffff" intensity={1.5} />
      <directionalLight position={[10, 15, 10]} color="#ffffff" intensity={2} />
      <Office />
    </>
  );
}

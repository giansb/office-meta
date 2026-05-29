import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Scene from "./components/Scene";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { useReservationStore } from "./store";

function CameraController({ is3D }: { is3D: boolean }) {
  const { camera } = useThree();

  useEffect(() => {
    if (is3D) {
      gsap.to(camera.position, { x: 9, y: 7, z: 14, duration: 2, ease: "power2.inOut" });
    } else {
      gsap.to(camera.position, {
        x: 0, y: 19, z: 2,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => camera.lookAt(0, 0, 0),
      });
    }
  }, [is3D, camera]);

  return null;
}

export default function App() {
  const [is3D, setIs3D] = useState(false);
  const { selectedChair, setSelectedChair, reserveChair } = useReservationStore();

  const chairNumber = selectedChair?.match(/(\d{3})$/)?.[1] ?? "";

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Positioning wrapper — sem overflow:hidden para o modal flutuar acima */}
      <div style={{ position: "relative" }}>

      {/* Coluna direita — info no topo + modal de cadeira abaixo */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "calc(100% + 16px)",
            width: "272px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            paddingTop: "0",
          }}
        >
          {/* Painel de instruções e gabarito */}
          <div
            style={{
              background: "rgba(10,10,20,0.75)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
              padding: "20px 18px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              fontFamily: "'Inter', 'Segoe UI', sans-serif",
            }}
          >
            <h3 style={{ margin: "0 0 6px", fontSize: "14px", fontWeight: "700", letterSpacing: "0.04em" }}>
              Reserva de Assento
            </h3>
            <p style={{ margin: "0 0 18px", fontSize: "12px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
              Clique em uma cadeira disponível para reservar o seu lugar no dia presencial.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { color: "#00BFFF", label: "Disponível" },
                { color: "#FFD700", label: "Selecionada" },
                { color: "#FF4500", label: "Reservada" },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: color, flexShrink: 0, boxShadow: `0 0 7px ${color}99` }} />
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Modal de cadeira selecionada */}
          <div
            style={{
              background: "rgba(10,10,20,0.85)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
              color: "#fff",
              overflow: "hidden",
              fontFamily: "'Inter', 'Segoe UI', sans-serif",
              clipPath: selectedChair ? "inset(0 0% 0 0%)" : "inset(0 100% 0 0%)",
              transition: "clip-path 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
              pointerEvents: selectedChair ? "auto" : "none",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: "linear-gradient(135deg, rgba(0,191,255,0.12), rgba(0,100,180,0.08))",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <p style={{ margin: 0, fontSize: "10px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Assento selecionado
                </p>
                <h3 style={{ margin: "3px 0 0", fontSize: "24px", fontWeight: "800", color: "#FFD700", letterSpacing: "0.04em" }}>
                  #{chairNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedChair(null)}
                title="Fechar"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.5)",
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "16px 18px 20px" }}>
              <p style={{ margin: "0 0 16px", fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                Confirma a reserva deste assento para o próximo dia presencial?
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => reserveChair(selectedChair!)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "linear-gradient(135deg, #00BFFF, #0077cc)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: "13px",
                    cursor: "pointer",
                    letterSpacing: "0.04em",
                    boxShadow: "0 2px 12px rgba(0,191,255,0.35)",
                  }}
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setSelectedChair(null)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    borderRadius: "8px",
                    color: "rgba(255,255,255,0.65)",
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas container */}
        <div
          style={{
            position: "relative",
            width: "1100px",
            height: "680px",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          {/* Toggle switch Plano / 3D */}
          <div
            onClick={() => setIs3D((v) => !v)}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              userSelect: "none",
              background: "rgba(10,10,20,0.65)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "999px",
              padding: "9px 18px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            }}
          >
            {/* Label esquerda */}
            <span
              style={{
                color: !is3D ? "#ffffff" : "rgba(255,255,255,0.3)",
                fontSize: "12px",
                fontWeight: !is3D ? "700" : "500",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                transition: "color 0.35s, font-weight 0.35s",
              }}
            >
              Plano
            </span>

            {/* Pill do switch */}
            <div
              style={{
                position: "relative",
                width: "44px",
                height: "24px",
                background: "rgba(255,255,255,0.07)",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.15)",
                flexShrink: 0,
              }}
            >
              {/* Knob */}
              <div
                style={{
                  position: "absolute",
                  top: "3px",
                  left: "3px",
                  width: "16px",
                  height: "16px",
                  background: "linear-gradient(135deg, #00BFFF, #0077cc)",
                  borderRadius: "50%",
                  transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: is3D ? "translateX(20px)" : "translateX(0px)",
                  boxShadow: "0 2px 10px rgba(0,191,255,0.7)",
                }}
              />
            </div>

            {/* Label direita */}
            <span
              style={{
                color: is3D ? "#ffffff" : "rgba(255,255,255,0.3)",
                fontSize: "12px",
                fontWeight: is3D ? "700" : "500",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                transition: "color 0.35s, font-weight 0.35s",
              }}
            >
              3D
            </span>
          </div>

          <Canvas shadows camera={{ position: [0, 19, 2], fov: 45 }}>
            <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
            <Scene />
            <CameraController is3D={is3D} />
            <OrbitControls target={[0, 0, 0]} enabled={is3D} />
          </Canvas>
        </div>
      </div>
    </div>
  );
}
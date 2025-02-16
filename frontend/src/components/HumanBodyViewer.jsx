import React, { useEffect, useState } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei"; // added Html
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// New component for interactive body markers
const BodyMarker = ({ position, label, data }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <mesh
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial color={hovered ? "#60a5fa" : "#34d399"} />
      {hovered && (
        <Html position={[0, 0.1, 0]} style={{ pointerEvents: "none" }}>
          <div
            style={{
              background: "linear-gradient(145deg, #f6f8fb 0%, #ffffff 100%)",
              padding: "8px 12px",
              borderRadius: "8px",
              fontSize: "14px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              minWidth: "120px",
              textAlign: "center",
            }}
          >
            <strong>{label}</strong>
            <br />
            {data}
          </div>
        </Html>
      )}
    </mesh>
  );
};

const Model = () => {
  const gltf = useLoader(
    GLTFLoader,
    `${import.meta.env.BASE_URL}humanBody/scene.gltf`
  );

  useEffect(() => {
    // Traverse and update material to a very light tone
    gltf.scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.color.set("#fff"); // updated to a very light skin tone
        child.material.transparent = false;
        child.material.opacity = 1;
      }
    });
    // Adjust vertical offset: bring the model slightly upward for a better centered view
    gltf.scene.position.set(0, -0.7, 0); // changed Y offset from -2 to -1
    // Increase model size (adjust scale factor as needed)
    const scaleFactor = 2.0;
    gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
  }, [gltf]);

  return <primitive object={gltf.scene} />;
};

const HumanBodyViewer = ({ googleFitData }) => {
  const [autoRotate, setAutoRotate] = useState(true);

  // Format the data for display
  const formatBP = () => {
    const systolic = googleFitData?.bloodPressure?.systolic || "-";
    const diastolic = googleFitData?.bloodPressure?.diastolic || "-";
    return `${systolic}/${diastolic} mmHg`;
  };

  return (
    <div
      onMouseEnter={() => setAutoRotate(false)}
      onMouseLeave={() => setAutoRotate(true)}
      style={{
        width: "80wh",
        height: "80vh",
      }}
    >
      <Canvas camera={{ position: [0, 4, 0] }}>
        <ambientLight intensity={2} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <directionalLight position={[-10, 10, -5]} intensity={2} />
        <React.Suspense fallback={null}>
          <Model />
          <BodyMarker
            position={[0, 2.15, 0.18]}
            label="Heart Rate"
            data={`${googleFitData?.heartRate || "-"} BPM`}
          />
          <BodyMarker
            position={[-0.15, 2, 0.19]}
            label="Blood Oxygen"
            data={`${googleFitData?.spo2 || "-"}%`}
          />
          <BodyMarker
            position={[0.775, 1.3, 0.10]}
            label="Pulse Rate"
            data={`${googleFitData?.pulseRate || "-"} BPM`}
          />
          <BodyMarker
            position={[0.5, 2, -0.02]}
            label="Blood Pressure"
            data={formatBP()}
          />
          <BodyMarker
            position={[0, 1.6, 0.24]}
            label="Activity"
            data={`Steps: ${googleFitData?.stepsWalked || "-"}
              Calories: ${googleFitData?.caloriesBurned || "-"} kcal
              Distance: ${googleFitData?.distanceWalked || "-"} m`}
          />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            target={[0, 1.5, 0]}
            minPolarAngle={1.3}
            maxPolarAngle={1.3}
            autoRotate={autoRotate}
            autoRotateSpeed={3}
          />
        </React.Suspense>
      </Canvas>
    </div>
  );
};

export default HumanBodyViewer;

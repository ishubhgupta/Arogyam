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
      <meshStandardMaterial color={hovered ? "hotpink" : "#23d8df"} />
      {hovered && (
        <Html position={[0, 0.1, 0]} style={{ pointerEvents: "none" }}>
          <div
            style={{
              background: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            <strong>{label}</strong>: {data}
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

const HumanBodyViewer = () => {
  // new state to control auto rotation
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div
      // when mouse enters, disable auto rotation; when leaves, enable it
      onMouseEnter={() => setAutoRotate(false)}
      onMouseLeave={() => setAutoRotate(true)}
      style={{ width: "100%", height: "90%" }}
    >
      <Canvas camera={{ position: [0, 4, 0] }}>
        <ambientLight intensity={2} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <directionalLight position={[-10, 10, -5]} intensity={2} />
        <React.Suspense fallback={null}>
          <Model />
          {/* Updated marker positions so they appear on the body */}
          <BodyMarker
            position={[0, 2.15, 0.18]} // heart marker placed on the body surface
            label="Heart"
            data="Heart Beat: 72 bpm"
          />
          <BodyMarker
            position={[-0.15, 2, 0.19]} // lungs marker placed on the body surface
            label="Lungs"
            data="Respiration: 16 rpm"
          />
          <BodyMarker
            position={[-0.5, 2, -0.02]} // left hand marker placed on the body surface
            label="Left Hand"
            data="BP: 120/80"
          />
          <BodyMarker
            position={[0.5, 2, -0.02]} // right hand marker placed on the body surface
            label="Right Hand"
            data="BP: 118/76"
          />
          <BodyMarker
            position={[0, 1.6, 0.24]} // stomach marker placed on the body surface
            label="Stomach"
            data="BP: 118/76"
          />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            target={[0, 1.5, 0]}
            minPolarAngle={1.3}
            maxPolarAngle={1.3}
            autoRotate={autoRotate} // auto rotate based on hover state
            autoRotateSpeed={4} // slow rotation speed
          />
        </React.Suspense>
      </Canvas>
    </div>
  );
};

export default HumanBodyViewer;

import React, { useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Model = () => {
  const gltf = useLoader(
    GLTFLoader,
    `${import.meta.env.BASE_URL}humanBody/scene.gltf`
  );

  useEffect(() => {
    // Traverse and update material to a very light tone
    gltf.scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.color.set("#ffefd5"); // updated to a very light skin tone
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
  return (
    <Canvas
      style={{ width: "100%", height: "90%" }} // fixed height for proper display in body card
      camera={{ position: [0, 4, 0] }} // updated camera position to zoom out a little
    >
      <ambientLight intensity={2} /> {/* increased ambient light intensity */}
      <directionalLight position={[10, 10, 5]} intensity={2} />{" "}
      {/* increased directional light intensity */}
      {/* Optionally, add additional directional lights for more balanced lighting */}
      <directionalLight position={[-10, 10, -5]} intensity={2} />
      <React.Suspense fallback={null}>
        <Model />
        <OrbitControls
          enableZoom={false} // disable zoom control
          enablePan={false} // disable panning
          target={[0, 1.5, 0]} // set target lower than camera to mimic a 6ft eye-level looking at a 5ft person
          minPolarAngle={1.3} // lock vertical rotation at a slightly downward angle
          maxPolarAngle={1.3} // lock vertical rotation at a slightly downward angle
        />
      </React.Suspense>
    </Canvas>
  );
};

export default HumanBodyViewer;

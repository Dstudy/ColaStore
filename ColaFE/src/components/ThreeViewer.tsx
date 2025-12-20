"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

type Props = {
  modelUrl: string;
};

export default function ThreeViewer({ modelUrl }: Props) {
  const [error, setError] = React.useState<string | null>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full text-red-500 p-4 border border-red-500">
        {error}
      </div>
    );
  }

  useEffect(() => {
    if (!mountRef.current) return;

    /* Scene */
    const scene = new THREE.Scene();
    scene.background = null;
    const envTexture = new THREE.DataTexture(
      new Uint8Array([255, 255, 255]),
      1,
      1,
      THREE.RGBFormat
    );
    envTexture.needsUpdate = true;

    scene.environment = envTexture;
    /* Camera */
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 3);

    /* Renderer */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    /* Lights */
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    /* Controls (rotate only) */
    const controls = new (OrbitControls as any)(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = false;

    const testCube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: "red" })
    );
    scene.add(testCube);

    /* Load GLTF */
    const loader = new GLTFLoader();
    let model: THREE.Object3D;

    loader.load(
      modelUrl,
      (gltf) => {
        model = gltf.scene;

        /* 🔥 Auto-scale to fit */
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());

        console.log("Model loaded. Size:", size, "Center:", center);

        if (size === 0) {
          console.error("Model has 0 size. Check if it contains meshes.");
        }

        model.position.sub(center);
        const scale = 1.5 / size || 1; // Avoid divide by zero
        model.scale.setScalar(scale);

        scene.add(model);

        console.log("load model successfully " + model.name + "-" + scale);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.error("An error happened loading the model:", error);
        setError("Error loading model: " + (error as Error).message);
      }
    );

    /* Animation */
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    /* Resize */
    const onResize = () => {
      if (!mountRef.current) return;
      camera.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };
    window.addEventListener("resize", onResize);

    /* Cleanup */
    return () => {
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [modelUrl]);

  return <div ref={mountRef} className="w-full h-full" />;
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
/* 1. Import GSAP */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Đăng ký plugin
gsap.registerPlugin(ScrollTrigger);

type Props = {
    modelUrl: string;
};

export default function ThreeViewerHome({ modelUrl }: Props) {
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

        // Clear any existing canvas elements to prevent duplicates (React Strict Mode issue)
        while (mountRef.current.firstChild) {
            mountRef.current.removeChild(mountRef.current.firstChild);
        }

        /* Scene Setup (Giữ nguyên) */
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

        const camera = new THREE.PerspectiveCamera(
            45,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            100
        );
        camera.position.set(0, 0, 3);

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

        scene.add(new THREE.AmbientLight(0xffffff, 1.2));
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(5, 5, 5);
        scene.add(dirLight);

        /* Controls */
        const controls = new (OrbitControls as any)(camera, renderer.domElement);
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.autoRotate = false;
        controls.enabled = false;

        /* Load GLTF & GSAP Animation */
        const loader = new GLTFLoader();
        let loadedModel: THREE.Object3D | null = null;
        // Biến lưu trữ animation để dọn dẹp (cleanup) sau này
        let scrollTween: gsap.core.Tween | null = null;

        loader.load(
            modelUrl,
            (gltf) => {
                loadedModel = gltf.scene;

                // Auto-scale (Giữ nguyên)
                const box = new THREE.Box3().setFromObject(loadedModel);
                const size = box.getSize(new THREE.Vector3()).length();
                loadedModel.position.set(0, -0.5, 0);
                const scale = 1.5 / size || 1;
                loadedModel.scale.setScalar(scale);

                scene.add(loadedModel);

                /* 🔥 LOGIC MỚI: GSAP Scroll Animation */
                // Find the closest parent with a class that contains 'product-'
                let triggerElement: HTMLElement | null = mountRef.current;
                let parent = mountRef.current?.parentElement;

                // Traverse up to find the product container
                while (parent && !parent.className.includes('product-')) {
                    parent = parent.parentElement;
                }

                // Use the product container if found, otherwise use mountRef
                if (parent) {
                    triggerElement = parent;
                }

                // Xoay model trục Y dựa trên cuộn trang
                scrollTween = gsap.to(loadedModel.rotation, {
                    y: Math.PI * 6, // Xoay 360 độ (2 Pi)
                    ease: "none",
                    scrollTrigger: {
                        trigger: triggerElement,
                        start: "top bottom",
                        end: "+=5000",
                        scrub: 1,
                        markers: true,
                    },
                });

                console.log("Model loaded and GSAP animation linked to:", triggerElement);
            },
            undefined,
            (error) => setError("Error: " + (error as Error).message)
        );

        /* Raycasting (Giữ nguyên từ bước trước) */
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const onPointerDown = (event: PointerEvent) => {
            if (!loadedModel) return;
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(loadedModel, true);
            controls.enabled = intersects.length > 0;
        };
        renderer.domElement.addEventListener("pointerdown", onPointerDown, { capture: true });

        /* Animation Loop */
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        /* Resize */
        const onResize = () => {
            if (!mountRef.current) return;
            camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);

            // Quan trọng: Cần refresh ScrollTrigger khi resize để tính toán lại vị trí
            ScrollTrigger.refresh();
        };
        window.addEventListener("resize", onResize);

        /* Cleanup */
        return () => {
            window.removeEventListener("resize", onResize);
            renderer.domElement.removeEventListener("pointerdown", onPointerDown, { capture: true } as any);

            // Dọn dẹp GSAP - Only kill the specific tween created by this component
            if (scrollTween) {
                scrollTween.kill();
                // Also kill its associated ScrollTrigger
                if (scrollTween.scrollTrigger) {
                    scrollTween.scrollTrigger.kill();
                }
            }

            renderer.dispose();
            if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, [modelUrl]);

    return <div ref={mountRef} className="w-full h-full" />;
}
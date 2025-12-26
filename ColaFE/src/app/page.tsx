"use client";
import { ArrowDownIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ThreeViewerHome from "@/components/ThreeViewerHome";
import AboutCard from "@/components/AboutCard";


export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  // Scroll to top on page load/refresh
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-redirect admin users to admin dashboard
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // If user is admin (role_id === 1), redirect to admin dashboard
        if (Number(user.role_id) === 1) {
          window.location.href = "/admin";
        }
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);


  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing canvas elements first
    const container = containerRef.current;
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Initialize Three.js
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Get container dimensions
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Ambient light for base illumination (reduced intensity to avoid flat look)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Main directional light from front-right
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    // Fill light from left side (softer, lower intensity)
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-5, 3, 5);
    scene.add(fillLight);

    // Rim light from behind for edge definition
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
    rimLight.position.set(-3, 2, -5);
    scene.add(rimLight);

    // Hemisphere light for natural sky/ground lighting
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
    hemisphereLight.position.set(0, 5, 0);
    scene.add(hemisphereLight);

    // Point light for highlights
    const pointLight = new THREE.PointLight(0xffffff, 0.8, 100);
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);

    // Load 3D model
    const loader = new GLTFLoader();
    loader.load(
      "https://res.cloudinary.com/dlwenphlw/image/upload/v1766163232/zeroCoke_gbfbnd.glb",
      (gltf: any) => {
        const model = gltf.scene;

        // Center and scale the model
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());

        // Calculate scale to fit in view
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.3 / maxDim;
        model.scale.multiplyScalar(scale);

        console.log(scale);

        // Center the model
        model.position.x = 1.5;
        model.position.y = -1;

        model.rotation.y = -Math.PI / 2;
        model.rotation.z = -Math.PI / 8;

        modelRef.current = model;

        scene.add(model);
        console.log("Model loaded successfully " + model.name);
        setModelLoaded(true); // Mark model as loaded
      },
      (xhr: ProgressEvent<EventTarget>) => {
        if (xhr.lengthComputable) {
          console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}%`);
        }
      },
      (error: unknown) => {
        console.error("Error loading model", error);
      }
    );

    // Animation loop
    const animate = () => {
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current && containerRef.current) {
        const container = containerRef.current;
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;

        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
        rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      console.log("Cleaning up Three.js scene");
      window.removeEventListener("resize", handleResize);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      // Dispose of the model
      if (modelRef.current) {
        modelRef.current.traverse((child: any) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat: any) => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
        if (sceneRef.current) {
          sceneRef.current.remove(modelRef.current);
        }
        modelRef.current = null;
      }

      // Dispose of the scene
      if (sceneRef.current) {
        sceneRef.current.traverse((object: any) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((mat: any) => mat.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
        sceneRef.current.clear();
        sceneRef.current = null;
      }

      // Dispose of the renderer
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
        if (
          containerRef.current &&
          rendererRef.current.domElement.parentNode === containerRef.current
        ) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current = null;
      }

      cameraRef.current = null;
      setModelLoaded(false);
    };
  }, []);

  // GSAP ScrollTrigger setup
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Kill any existing ScrollTrigger instances first
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // Wait for DOM to be ready
    const setupScrollTween = () => {
      const container = document.querySelector(".container-product");
      const sections = gsap.utils.toArray(".container-product .panel");

      // Check if container and sections exist
      if (!container || sections.length === 0) {
        console.warn(
          "Container or sections not found for scrollTween, retrying..."
        );
        // Retry after a short delay
        setTimeout(setupScrollTween, 50);
        return;
      }

      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none", // <-- IMPORTANT!
        scrollTrigger: {
          trigger: ".container-product",
          pin: true,
          scrub: 0.1,
          //snap: directionalSnap(1 / (sections.length - 1)),
          end: "+=3000",
          markers: false,
        },
      });

      gsap.set(".box-1, .box-2, .box-3, .box-4", { y: 300 });
    };

    // Use requestAnimationFrame to ensure DOM is rendered
    let rafId: number;
    const init = () => {
      rafId = requestAnimationFrame(() => {
        setupScrollTween();
      });
    };
    init();

    return () => {
      console.log("Cleaning up ScrollTrigger");
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      // Kill all ScrollTrigger instances on cleanup
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      // Refresh ScrollTrigger to recalculate positions
      ScrollTrigger.refresh();
    };
  }, []);

  // Separate effect to set up model animations only after model is loaded
  useEffect(() => {
    if (!modelLoaded || !modelRef.current) return;

    // Wait for ScrollTrigger to be ready
    const setupModelAnimations = () => {
      const container = document.querySelector(".container-product");
      if (!container) {
        setTimeout(setupModelAnimations, 50);
        return;
      }

      if (modelRef.current) {
        console.log("Model loaded, setting up animations");

        // 1. Rotation Animation
        gsap.to(modelRef.current.rotation, {
          y: Math.PI * 2, // Rotate 360 degrees
          scrollTrigger: {
            trigger: ".container-product",
            start: "top top",
            end: "+=3000",
            scrub: true,
            markers: false,
          },
        });

        // 2. Position Animation (Moving the can as we scroll)
        gsap.to(modelRef.current.position, {
          x: -1.5, // Move from right to left
          scrollTrigger: {
            trigger: ".container-product",
            start: "top top",
            end: "+=3000",
            scrub: true,
            markers: false,
          },
        });

        gsap.to(modelRef.current.scale, {
          x: 0,
          y: 0,
          z: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".features",
            start: "top bottom",
            end: "+=300",
            scrub: true,
            markers: false,
          },
        });
      }
    };

    setupModelAnimations();

    return () => {
      // Cleanup model-specific ScrollTriggers if needed
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars && trigger.vars.trigger === ".container-feature") {
        }
      });
    };
  }, [modelLoaded]);

  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Kill any existing ScrollTrigger instances first
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // Wait for DOM to be ready
    const setupScrollTween = () => {
      const container = document.querySelector(".container-feature");
      const sections = gsap.utils.toArray(".container-feature .panel");

      // Check if container and sections exist
      if (!container || sections.length === 0) {
        console.warn(
          "Container or sections not found for scrollTween, retrying..."
        );
        // Retry after a short delay
        setTimeout(setupScrollTween, 50);
        return;
      }

      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none", // <-- IMPORTANT!
        scrollTrigger: {
          trigger: ".container-feature",
          // start: "top center",
          pin: true,
          scrub: 0.1,
          //snap: directionalSnap(1 / (sections.length - 1)),
          end: "+=4000",
          markers: false,
        },
      });
    };

    // Use requestAnimationFrame to ensure DOM is rendered
    let rafId: number;
    const init = () => {
      rafId = requestAnimationFrame(() => {
        setupScrollTween();
      });
    };
    init();

    return () => {
      console.log("Cleaning up ScrollTrigger");
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      // Kill all ScrollTrigger instances on cleanup
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      // Refresh ScrollTrigger to recalculate positions
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <div className="overflow-x-hidden">
      <section className="bg-black">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center px-40 py-40 gap-12">
          {/* Text */}
          <div className="text-white max-w-xl">
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
              CATCH THE WAVE. <br />
              FEEL THE ZERO.
            </h2>

            <p className="mt-6 text-white/80 text-sm leading-relaxed">
              Zero Sugar, Maximum Flavor – Dive into the crisp, refreshing taste
              of Coca-Cola Zero Sugar, delivering the iconic boldness you love,
              without the sugar.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button className="bg-black text-white px-6 py-3 rounded-full border border-white hover:bg-white hover:text-black transition">
                Shop Now
              </button>

              <button className="bg-red-800 text-white px-6 py-3 rounded-lg flex items-center justify-between gap-2">
                View Nutrition Facts
                <span>
                  <ArrowDownIcon />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full flex items-center justify-center bg-black text-white font-bold">
        Scroll down to animate horizontally
      </section>

      <div className="w-full bg-black">
        <div className="container-product w-full text-white">
          <div className="panel flex items-center justify-center">
            <h2 className="text-6xl font-bold">Scroll to explore →</h2>
          </div>

          <section className="panel flex">
            <div className="box-1 box flex flex-col max-w-2xl px-8">
              <h2 className="text-7xl font-bold mb-8 leading-tight">
                Zero Sugar,<br />Zero Calories
              </h2>
              <p className="text-2xl text-white/80 leading-relaxed">
                Enjoy the classic Coca-Cola taste without sugar or calories.
              </p>
            </div>
          </section>

          <section className="panel flex">
            <div className="box-2 box flex flex-col max-w-2xl px-8">
              <h2 className="text-7xl font-bold mb-8 leading-tight">
                Authentic<br />Coca-Cola Taste
              </h2>
              <p className="text-2xl text-white/80 leading-relaxed">
                Bold, crisp flavor that closely matches the original.
              </p>
            </div>
          </section>

          <section className="panel flex">
            <div className="box-3 box flex flex-col max-w-2xl px-8">
              <h2 className="text-7xl font-bold mb-8 leading-tight">
                No Guilt<br />Refreshment
              </h2>
              <p className="text-2xl text-white/80 leading-relaxed">
                Perfect for an active and health-conscious lifestyle.
              </p>
            </div>
          </section>

          <section className="panel flex">
            <div className="box-4 box flex flex-col max-w-2xl px-8">
              <h2 className="text-7xl font-bold mb-8 leading-tight">
                Perfect for<br />Any Occasion
              </h2>
              <p className="text-2xl text-white/80 leading-relaxed">
                Refreshing enjoyment anytime, anywhere.
              </p>
            </div>
          </section>
        </div>
      </div>

      <div className="features">
        <div className="container-feature flex flex-horizontal">
          {/* Panel 1: Coca-Cola Zero Sugar */}
          <div className="panel">
            <div className="bg-gradient-to-br from-neutral-900 via-black to-neutral-800 h-full flex items-center justify-center p-12">
              <div className="grid grid-cols-2 gap-12 max-w-7xl w-full">
                {/* Left: Product Info */}
                <div className="text-white space-y-8">
                  <div>
                    <h3 className="text-6xl font-black mb-4 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                      Coca-Cola Zero Sugar
                    </h3>
                    <p className="text-xl text-white/70 leading-relaxed">
                      Experience the iconic Coca-Cola taste with zero sugar and zero calories.
                      Perfect for those who want bold flavor without compromise.
                    </p>
                  </div>

                  {/* Available Sizes */}
                  <div>
                    <h4 className="text-2xl font-bold mb-4 text-red-500">Available Sizes</h4>
                    <div className="flex gap-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:border-red-500 transition cursor-pointer">
                        <div className="text-3xl font-bold text-red-500">330ml</div>
                        <div className="text-sm text-white/60">Can</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:border-red-500 transition cursor-pointer">
                        <div className="text-3xl font-bold text-red-500">500ml</div>
                        <div className="text-sm text-white/60">Bottle</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:border-red-500 transition cursor-pointer">
                        <div className="text-3xl font-bold text-red-500">1.5L</div>
                        <div className="text-sm text-white/60">Bottle</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:border-red-500 transition cursor-pointer">
                        <div className="text-3xl font-bold text-red-500">2L</div>
                        <div className="text-sm text-white/60">Bottle</div>
                      </div>
                    </div>
                  </div>

                  {/* Nutrition Facts */}
                  <div>
                    <h4 className="text-2xl font-bold mb-4 text-red-500">Nutrition Facts</h4>
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                      <div className="text-sm text-white/50 mb-3">Per 330ml Serving</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                          <span className="text-white/70">Calories</span>
                          <span className="font-bold text-white">0</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                          <span className="text-white/70">Sugar</span>
                          <span className="font-bold text-white">0g</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                          <span className="text-white/70">Sodium</span>
                          <span className="font-bold text-white">40mg</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                          <span className="text-white/70">Caffeine</span>
                          <span className="font-bold text-white">34mg</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: 3D Model & Product Image */}
                <div className="flex flex-col gap-6">
                  <div className="w-full h-96 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl shadow-2xl overflow-hidden border border-white/10">
                    <ThreeViewerHome modelUrl="https://res.cloudinary.com/dlwenphlw/image/upload/v1766163232/zeroCoke_gbfbnd.glb" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="aspect-square bg-gradient-to-br from-red-900/20 to-black rounded-lg border border-white/10 flex items-center justify-center">
                      <span className="text-6xl">🥤</span>
                    </div>
                    <div className="aspect-square bg-gradient-to-br from-red-900/20 to-black rounded-lg border border-white/10 flex items-center justify-center">
                      <span className="text-6xl">🥤</span>
                    </div>
                    <div className="aspect-square bg-gradient-to-br from-red-900/20 to-black rounded-lg border border-white/10 flex items-center justify-center">
                      <span className="text-6xl">🥤</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel 2: Coca-Cola Classic */}
          <div className="panel">
            <div className="bg-gradient-to-br from-red-900 via-red-800 to-red-950 h-full flex items-center justify-center p-12">
              <div className="grid grid-cols-2 gap-12 max-w-7xl w-full">
                {/* Left: Product Info */}
                <div className="text-white space-y-8">
                  <div>
                    <h3 className="text-6xl font-black mb-4 text-white drop-shadow-lg">
                      Coca-Cola Classic
                    </h3>
                    <p className="text-xl text-white/80 leading-relaxed">
                      The original and iconic taste that has refreshed the world for over a century.
                      Timeless, bold, and unmistakably Coca-Cola.
                    </p>
                  </div>

                  {/* Available Sizes */}
                  <div>
                    <h4 className="text-2xl font-bold mb-4 text-white">Available Sizes</h4>
                    <div className="flex gap-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30 hover:border-white transition cursor-pointer">
                        <div className="text-3xl font-bold text-white">330ml</div>
                        <div className="text-sm text-white/70">Can</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30 hover:border-white transition cursor-pointer">
                        <div className="text-3xl font-bold text-white">500ml</div>
                        <div className="text-sm text-white/70">Bottle</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30 hover:border-white transition cursor-pointer">
                        <div className="text-3xl font-bold text-white">1.5L</div>
                        <div className="text-sm text-white/70">Bottle</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30 hover:border-white transition cursor-pointer">
                        <div className="text-3xl font-bold text-white">2L</div>
                        <div className="text-sm text-white/70">Bottle</div>
                      </div>
                    </div>
                  </div>

                  {/* Nutrition Facts */}
                  <div>
                    <h4 className="text-2xl font-bold mb-4 text-white">Nutrition Facts</h4>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                      <div className="text-sm text-white/60 mb-3">Per 330ml Serving</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex justify-between items-center border-b border-white/20 pb-2">
                          <span className="text-white/80">Calories</span>
                          <span className="font-bold text-white">139</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/20 pb-2">
                          <span className="text-white/80">Sugar</span>
                          <span className="font-bold text-white">35g</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/20 pb-2">
                          <span className="text-white/80">Sodium</span>
                          <span className="font-bold text-white">45mg</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/20 pb-2">
                          <span className="text-white/80">Caffeine</span>
                          <span className="font-bold text-white">34mg</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: 3D Model & Product Image */}
                <div className="flex flex-col gap-6">
                  <div className="w-full h-96 bg-gradient-to-br from-red-700 to-red-950 rounded-2xl shadow-2xl overflow-hidden border border-white/20">
                    <ThreeViewerHome modelUrl="https://res.cloudinary.com/dlwenphlw/image/upload/v1766163232/zeroCoke_gbfbnd.glb" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center">
                      <span className="text-6xl">🥤</span>
                    </div>
                    <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center">
                      <span className="text-6xl">🥤</span>
                    </div>
                    <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center">
                      <span className="text-6xl">🥤</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel 3: Diet Coca-Cola */}
          <div className="panel">
            <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 h-full flex items-center justify-center p-12">
              <div className="grid grid-cols-2 gap-12 max-w-7xl w-full">
                {/* Left: Product Info */}
                <div className="text-white space-y-8">
                  <div>
                    <h3 className="text-6xl font-black mb-4 bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">
                      Diet Coca-Cola
                    </h3>
                    <p className="text-xl text-white/70 leading-relaxed">
                      Light, crisp, and refreshing with a distinct flavor profile.
                      The perfect choice for a lighter alternative with zero calories.
                    </p>
                  </div>

                  {/* Available Sizes */}
                  <div>
                    <h4 className="text-2xl font-bold mb-4 text-slate-300">Available Sizes</h4>
                    <div className="flex gap-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:border-slate-300 transition cursor-pointer">
                        <div className="text-3xl font-bold text-slate-300">330ml</div>
                        <div className="text-sm text-white/60">Can</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:border-slate-300 transition cursor-pointer">
                        <div className="text-3xl font-bold text-slate-300">500ml</div>
                        <div className="text-sm text-white/60">Bottle</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:border-slate-300 transition cursor-pointer">
                        <div className="text-3xl font-bold text-slate-300">1.5L</div>
                        <div className="text-sm text-white/60">Bottle</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:border-slate-300 transition cursor-pointer">
                        <div className="text-3xl font-bold text-slate-300">2L</div>
                        <div className="text-sm text-white/60">Bottle</div>
                      </div>
                    </div>
                  </div>

                  {/* Nutrition Facts */}
                  <div>
                    <h4 className="text-2xl font-bold mb-4 text-slate-300">Nutrition Facts</h4>
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                      <div className="text-sm text-white/50 mb-3">Per 330ml Serving</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                          <span className="text-white/70">Calories</span>
                          <span className="font-bold text-white">1</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                          <span className="text-white/70">Sugar</span>
                          <span className="font-bold text-white">0g</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                          <span className="text-white/70">Sodium</span>
                          <span className="font-bold text-white">40mg</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                          <span className="text-white/70">Caffeine</span>
                          <span className="font-bold text-white">46mg</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: 3D Model & Product Image */}
                <div className="flex flex-col gap-6">
                  <div className="w-full h-96 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-white/10">
                    <ThreeViewerHome modelUrl="https://res.cloudinary.com/dlwenphlw/image/upload/v1766163232/zeroCoke_gbfbnd.glb" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="aspect-square bg-gradient-to-br from-slate-600/20 to-black rounded-lg border border-white/10 flex items-center justify-center">
                      <span className="text-6xl">🥤</span>
                    </div>
                    <div className="aspect-square bg-gradient-to-br from-slate-600/20 to-black rounded-lg border border-white/10 flex items-center justify-center">
                      <span className="text-6xl">🥤</span>
                    </div>
                    <div className="aspect-square bg-gradient-to-br from-slate-600/20 to-black rounded-lg border border-white/10 flex items-center justify-center">
                      <span className="text-6xl">🥤</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <section className="about-us relative min-h-screen bg-gradient-to-br from-neutral-950 via-black to-red-950 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(220,38,38,0.3),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(220,38,38,0.2),transparent_50%)]" />
        </div>

        <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-20 py-20">
          {/* Header Section */}
          <div className="max-w-5xl mx-auto text-center mb-16">
            {/* Title */}
            <h2 className="title text-6xl md:text-8xl font-black mb-8 bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent animate-pulse">
              Coca-Cola
            </h2>

            {/* Decorative Line */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="h-1 w-24 bg-gradient-to-r from-transparent to-red-500 rounded-full" />
              <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
              <div className="h-1 w-24 bg-gradient-to-l from-transparent to-red-500 rounded-full" />
            </div>

            {/* Description */}
            <div className="description text-white/80 text-lg md:text-xl leading-relaxed space-y-6 max-w-4xl mx-auto">
              <p>
                On May 8, 1886, Dr. John Pemberton brought his perfected syrup to Jacobs' Pharmacy in downtown Atlanta where the first glass of Coca‑Cola was poured. From that one iconic drink, we've evolved into a total beverage company. More than 2.2 billion servings of our drinks are enjoyed in more than 200 countries and territories each day.
              </p>
              <p>
                We are constantly transforming our portfolio, from reducing added sugar in our drinks to bringing innovative new products to market. We seek to positively impact people's lives, communities and the planet through water replenishment, packaging recycling, sustainable sourcing practices and carbon emissions reductions across our value chain. Together with our bottling partners, we employ more than 700,000 people, helping bring economic opportunity to local communities worldwide.
              </p>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mt-20">
            <div className="about-card transform transition-all duration-500 hover:-translate-y-2">
              <AboutCard
                image="/about/coke1.jpg"
                title="Our Purpose"
                description="To refresh the world and make a difference. We are committed to offering people more of the drinks they want across a range of categories and sizes while driving sustainable solutions that build resilience into our business and create positive change for the planet."
                variant="glass"
              />
            </div>
            <div className="about-card transform transition-all duration-500 hover:-translate-y-2">
              <AboutCard
                image="/about/coke2.jpg"
                title="Innovation & Quality"
                description="We continuously innovate to bring you the best beverages, from zero sugar options to new flavors. Our commitment to quality ensures every sip delivers the refreshment you expect from Coca-Cola."
                variant="glass"
              />
            </div>
            <div className="about-card transform transition-all duration-500 hover:-translate-y-2">
              <AboutCard
                image="/about/coke3.jpg"
                title="Sustainability"
                description="Building a more sustainable future through water stewardship, packaging innovation, and carbon reduction. Together with our partners, we're creating positive environmental impact in communities worldwide."
                variant="glass"
              />
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto mt-20 pt-16 border-t border-white/10">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent mb-2">
                2.2B
              </div>
              <div className="text-white/60 text-sm md:text-base font-medium">Daily Servings</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent mb-2">
                200+
              </div>
              <div className="text-white/60 text-sm md:text-base font-medium">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent mb-2">
                700K+
              </div>
              <div className="text-white/60 text-sm md:text-base font-medium">Employees</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent mb-2">
                1886
              </div>
              <div className="text-white/60 text-sm md:text-base font-medium">Since</div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </section>

      <div ref={containerRef} id="container3d"></div>
    </div>
  );
}
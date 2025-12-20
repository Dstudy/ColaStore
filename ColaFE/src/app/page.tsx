"use client";
import { ArrowDownIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "./style.css";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

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
    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
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

        model.rotation.y = - Math.PI / 2;
        model.rotation.z = - Math.PI / 8;
        
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
    window.addEventListener('resize', handleResize);



    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // GSAP ScrollTrigger setup
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Wait for DOM to be ready
    const setupScrollTween = () => {
      const container = document.querySelector(".container");
      const sections = gsap.utils.toArray(".container .panel");
      
      // Check if container and sections exist
      if (!container || sections.length === 0) {
        console.warn("Container or sections not found for scrollTween, retrying...");
        // Retry after a short delay
        setTimeout(setupScrollTween, 50);
        return;
      }

      let scrollTween = gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none", // <-- IMPORTANT!
        scrollTrigger: {
          trigger: ".container",
          pin: true,
          scrub: 0.1,
          //snap: directionalSnap(1 / (sections.length - 1)),
          end: "+=3000",
          markers: false
        }
      });

      gsap.set(".box-1, .box-2, .box-3, .box-4", { y: 150 });
      // ScrollTrigger.defaults({ markers: { startColor: "white", endColor: "white" } });

      // red section
      gsap.to(".box-1", {
        ease: "elastic",
        scrollTrigger: {
          trigger: ".box-1",
          containerAnimation: scrollTween,
          start: "left center",
          toggleActions: "play none none reset",
          id: "1",
          markers: false
          
        }
      });

      // gray section
      gsap.to(".box-2", {
        scrollTrigger: {
          trigger: ".box-2",
          containerAnimation: scrollTween,
          start: "center 80%",
          end: "center 20%",
          scrub: true,
          id: "2",
          markers: false
        }
      });

      gsap.to(".box-3", {
        scrollTrigger: {
          trigger: ".box-3",
          containerAnimation: scrollTween,
          start: "center 80%",
          end: "center 20%",
          scrub: true,
          id: "2",
          markers: false
        }
      });

      gsap.to(".box-4", {
        scrollTrigger: {
          trigger: ".box-4",
          containerAnimation: scrollTween,
          start: "center 80%",
          end: "center 20%",
          scrub: true,
          id: "2",
          markers: false
        }
      });

      
      ["red", "gray", "purple", "green"].forEach((triggerClass, i) => {
        ScrollTrigger.create({
          trigger: "." + triggerClass,
          containerAnimation: scrollTween,
          start: "left 30%",
          end: i === 3 ? "right right" : "right 30%",
          markers: false,
          onToggle: (self) =>
            gsap.to(".marker-" + (i + 1), {
              duration: 0.25,
              autoAlpha: self.isActive ? 1 : 0
            })
        });
      });


      return scrollTween;
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
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      // Kill all ScrollTrigger instances on cleanup
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Separate effect to set up model animations only after model is loaded
  useEffect(() => {
    if (!modelLoaded || !modelRef.current) return;

    // Wait for ScrollTrigger to be ready
    const setupModelAnimations = () => {
      const container = document.querySelector(".container");
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
            trigger: ".container", 
            start: "top top",      
            end: "+=3000",         
            scrub: true,     
            markers: true      
          }
        });

        // 2. Position Animation (Moving the can as we scroll)
        gsap.to(modelRef.current.position, {
          x: -1.5, // Move from right to left
          scrollTrigger: {
            trigger: ".container",
            start: "top top",
            end: "+=3000",
            scrub: true,
          }
        });
      }
    };

    setupModelAnimations();

    return () => {
      // Cleanup model-specific ScrollTriggers if needed
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars && (trigger.vars.trigger === ".container")) {
        }
      });
    };
  }, [modelLoaded]);

  return (
    <>
      <section className="bg-black">
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center px-8 py-16 gap-12">  
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
              <span><ArrowDownIcon /></span>
            </button>
          </div>
        </div>
      </div>
      </section>

      <div className="w-full bg-black overflow-hidden">
        <div className="container w-full">
          <div className="panel flex items-center">
            <h2>Scroll down to animate horizontally &gt;</h2>
          </div>

          <section className="panel">
          And this is magic
            <div className="box-1 box flex flex-col w-100">
              <h2>Zero Sugar, Zero Calories</h2>
              <p>Enjoy the classic Coca-Cola taste without sugar or calories. Perfect for those who want to reduce sugar intake while still enjoying a refreshing soda.</p>
            </div>


          </section>

          <section className="panel">
            And this is magic
            <div className="box-2 box flex flex-col">
              <h2>Authentic Coca-Cola Taste</h2>
              <p>Specially formulated to deliver a bold, crisp flavor that closely matches original Coca-Cola, giving you the same satisfaction without compromise.</p>
            </div>
          </section>

          <section className="panel">
          <div className="box-3 box flex flex-col">
              <h2>No Guilt Refreshment</h2>
              <p>Ideal for an active and health-conscious lifestyle. Coca-Cola Zero Sugar fits easily into daily routines without affecting calorie goals.</p>
            </div>
          </section>

          <section className="panel">
            <div className="box-4 box flex flex-col">
              <h2>Perfect for Any Occasion</h2>
              <p>Whether at meals, parties, workouts, or on the go, Coca-Cola Zero Sugar provides refreshing enjoyment anytime, anywhere.</p>
            </div>
          </section>
        </div>
      </div>

      <div ref={containerRef} id="container3d"></div>

      <div className="w-sceen h-screen "></div>
    </>
  );
}

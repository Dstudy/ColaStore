import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";



const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 13;

const scene = new THREE.Scene();
let can;
const loader = new GLTFLoader();
loader.load(
    "https://res.cloudinary.com/<cloud_name>/raw/upload/v1234567890/model.glb",
    (gltf) => {
        can = gltf.scene;
      scene.add(can);
    },
    (xhr) => {
      console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}%`);
    },
    (error) => {
      console.error("Error loading model", error);
    }
  );

  const renderer = new THREE.WebGLRenderer({alpha: true},{ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('container3d').appendChild(renderer.domElement);

  const reRender3D = () => {
    requestAnimationFrame(reRender3D);
    renderer.render(scene, camera);
  }
  reRender3D();


  //Gsap section
  gsap.registerPlugin(ScrollTrigger);

  let sections = gsap.utils.toArray(".container .panel");

let scrollTween = gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: "none", // <-- IMPORTANT!
  scrollTrigger: {
    trigger: ".container",
    pin: true,
    scrub: 0.1,
    //snap: directionalSnap(1 / (sections.length - 1)),
    end: "+=3000",
  }
});

gsap.set(".box-1, .box-2", { y: 100 });
ScrollTrigger.defaults({ markers: { startColor: "white", endColor: "white" } });

// red section
gsap.to(".box-1", {
  y: -130,
  duration: 2,
  ease: "elastic",
  scrollTrigger: {
    trigger: ".box-1",
    containerAnimation: scrollTween,
    start: "left center",
    toggleActions: "play none none reset",
    id: "1",
    
  }
});

// gray section
gsap.to(".box-2", {
  y: -120,
  ease: "none",
  scrollTrigger: {
    trigger: ".box-2",
    containerAnimation: scrollTween,
    start: "center 80%",
    end: "center 20%",
    scrub: true,
    id: "2"
  }
});

// purple section
ScrollTrigger.create({
  trigger: ".box-3",
  containerAnimation: scrollTween,
  toggleClass: "active",
  start: "center 60%",
  id: "3"
});

// green section
ScrollTrigger.create({
  trigger: ".green",
  containerAnimation: scrollTween,
  start: "center 65%",
  end: "center 51%",
  onEnter: () => console.log("enter"),
  onLeave: () => console.log("leave"),
  onEnterBack: () => console.log("enterBack"),
  onLeaveBack: () => console.log("leaveBack"),
  onToggle: (self) => console.log("active", self.isActive),
  id: "4"
});

// only show the relevant section's markers at any given time
gsap.set(
  ".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end",
  { autoAlpha: 0 }
);
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
import Image from "next/image";
import * as THREE from 'three';
import { useRef, useState, useEffect } from "react";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function Home() {
  const [controllerVisible, setControllerVisible] = useState(false);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const [portfolioVisible, setPortfolioVisible] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const sceneRef = useRef<THREE.Scene>(null);
  const controlsRef = useRef<OrbitControls>(null);

  useEffect(() => {
    const controller = document.getElementById("ps5-controller");
    const skills = document.getElementById("skills");
    const portfolio = document.getElementById("portfolio");

    const handleControllerAnimationEnd = () => setControllerVisible(true);
    const handleSkillsAnimationEnd = () => setSkillsVisible(true);
    const handlePortfolioAnimationEnd = () => setPortfolioVisible(true);

    if (controller) {
      controller.addEventListener("animationend", handleControllerAnimationEnd);
    }

    if (skills) {
      skills.addEventListener("animationend", handleSkillsAnimationEnd);
    }

    if (portfolio) {
      portfolio.addEventListener("animationend", handlePortfolioAnimationEnd);
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current ?? undefined, // Use nullish coalescing operator
      antialias: true,
    });
    const controls = new OrbitControls(camera, renderer.domElement);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    controlsRef.current = controls;

    const loader = new GLTFLoader();
    loader.load('/path/to/your/model.gltf', (gltf) => {
      scene.add(gltf.scene);
      setModelLoaded(true);
    }, undefined, (error) => {
      console.error('An error happened while loading the model:', error);
    });

    const resizeHandler = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', resizeHandler);

    const animate = () => {
      requestAnimationFrame(animate);
      if (modelLoaded) {
        controls.update();
        renderer.render(scene, camera);
      }
    };
    animate();

    return () => {
      if (controller) {
        controller.removeEventListener("animationend", handleControllerAnimationEnd);
      }
      if (skills) {
        skills.removeEventListener("animationend", handleSkillsAnimationEnd);
      }
      if (portfolio) {
        portfolio.removeEventListener("animationend", handlePortfolioAnimationEnd);
      }
      window.removeEventListener('resize', resizeHandler);
    };
  }, [modelLoaded]);

  return (
    <div>
      <canvas ref={canvasRef} width={640} height={480} style={{ width: '100%', height: '100vh', display: 'block' }} />
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <div className="relative h-screen w-full">
            <div className="absolute top-0 left-0 h-full w-full bg-black" />
            <div className="absolute top-0 left-0 h-full w-full bg-stars" />
            <h1 className="text-5xl font-bold text-white">FakerPK</h1>
            <p className="text-lg text-white">Faiq Khan</p>
            <div id="ps5-controller" className="absolute bottom-0 left-0 h-64 w-64 bg-ps5-controller animate-fall" />
          </div>
          {controllerVisible && (
            <div id="skills" className="flex flex-col gap-8">
            <h2 className="text-3xl font-bold">My Skills</h2>
            <div className="flex flex-wrap justify-center">
              <div className="w-full md:w-1/2 xl:w-1/3 p-4">
                <Image src="/python-logo.png" alt="Python" width={100} height={100} />
                <h3 className="text-lg font-bold">Python</h3>
              </div>
              <div className="w-full md:w-1/2 xl:w-1/3 p-4">
                <Image src="/javascript-logo.png" alt="JavaScript" width={100} height={100} />
                <h3 className="text-lg font-bold">JavaScript</h3>
              </div>
              <div className="w-full md:w-1/2 xl:w-1/3 p-4">
                <Image src="/typescript-logo.png" alt="TypeScript" width={100} height={100} />
                <h3 className="text-lg font-bold">TypeScript</h3>
              </div>
            </div>
          </div>
        )}
        {skillsVisible && (
          <div id="portfolio" className="flex flex-col gap-8">
            <h2 className="text-3xl font-bold">My Portfolio</h2>
            <div className="flex flex-wrap justify-center">
              <div className="w-full md:w-1/2 xl:w-1/3 p-4">
                <Image src="/github-logo.png" alt="GitHub" width={100} height={100} />
                <h3 className="text-lg font-bold">GitHub</h3>
              </div>
              <div className="w-full md:w-1/2 xl:w-1/3 p-4">
                <Image src="/vercel-logo.png" alt="Vercel" width={100} height={100} />
                <h3 className="text-lg font-bold">Vercel</h3>
              </div>
            </div>
          </div>
        )}
        {portfolioVisible && (
          <div className="flex flex-col gap-8">
            <h2 className="text-3xl font-bold">Donations</h2>
            <p className="text-lg">Support me by donating to my wallet address:</p>
            <p className="text-lg font-bold">0x1234567890abcdef</p>
          </div>
        )}
      </main>
    </div>
  </div>
);
}
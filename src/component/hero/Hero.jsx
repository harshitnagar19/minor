import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const Hero = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);

  // Animation variants for the blob elements
  const blobVariants = {
    animate: {
      x: [0, 10, -10, 0],
      y: [0, -15, 5, 0],
      transition: {
        x: {
          repeat: Infinity,
          duration: 12,
          ease: "easeInOut",
        },
        y: {
          repeat: Infinity,
          duration: 8,
          ease: "easeInOut",
        },
      },
    },
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;

    // Set up scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Create camera with perspective
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    // Position camera in the center
    camera.position.set(0, 0, 5);
    // No rotation - looking straight ahead
    camera.rotation.x = 0;
    
    // Initialize renderer with the dark background color #111828
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      alpha: false, // No alpha since we want a solid background
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x111828, 1); // Set the dark blue-gray background
    
    // CREATE BOTTOM GRID
    const size = 40;
    const divisions = 35;
    
    // Bottom Grid 1 (primary) - using brighter colors for contrast and shine
    const bottomGridHelper = new THREE.GridHelper(
      size, 
      divisions, 
      new THREE.Color(0x3b82f6), // Bright blue for main lines
      new THREE.Color(0x1e3a8a)  // Darker blue for secondary lines
    );
    
    // Position the bottom grid
    bottomGridHelper.position.y = -5;
    
    // Add grid fade-out and pulse effect
    const bottomGridMaterial = bottomGridHelper.material;
    if (Array.isArray(bottomGridMaterial)) {
      bottomGridMaterial.forEach(material => {
        material.opacity = 0.6;
        material.transparent = true;
      });
    } else {
      bottomGridMaterial.opacity = 0.6;
      bottomGridMaterial.transparent = true;
    }
    
    scene.add(bottomGridHelper);
    
    // Bottom Grid 2 (accent grid) - with shinier accent colors
    const bottomGridHelper2 = new THREE.GridHelper(
      size,
      divisions / 2,
    //   new THREE.Color(0x8b5cf6), // Purple
    //   new THREE.Color(0xc4b5fd)  // Light purple
    );
    // bottomGridHelper2.position.y = -5.1;
    
    // Make accent grid slightly transparent
    const bottomGridMaterial2 = bottomGridHelper2.material;
    // if (Array.isArray(bottomGridMaterial2)) {
    //   bottomGridMaterial2.forEach(material => {
    //     material.opacity = 0.5;
    //     material.transparent = true;
    //   });
    // } else {
    //   bottomGridMaterial2.opacity = 0.5;
    //   bottomGridMaterial2.transparent = true;
    // }
    
    // scene.add(bottomGridHelper2);
    
    // CREATE TOP GRID
    
    // Top Grid 1 (primary) - using brighter colors
    const topGridHelper = new THREE.GridHelper(
      size, 
      divisions, 
      new THREE.Color(0x3b82f6), // Bright blue for main lines
      new THREE.Color(0x1e3a8a)  // Darker blue for secondary lines
    );
    
    // Position and flip the top grid
    topGridHelper.position.y = 5;
    topGridHelper.rotation.x = Math.PI;
    
    // Add grid fade-out effect
    const topGridMaterial = topGridHelper.material;
    if (Array.isArray(topGridMaterial)) {
      topGridMaterial.forEach(material => {
        material.opacity = 0.6;
        material.transparent = true;
      });
    } else {
      topGridMaterial.opacity = 0.6;
      topGridMaterial.transparent = true;
    }
    
    scene.add(topGridHelper);
    
    // Top Grid 2 (accent grid) - with shinier accent colors
    const topGridHelper2 = new THREE.GridHelper(
      size,
      divisions / 2,
    //   new THREE.Color(0x8b5cf6), // Purple
    //   new THREE.Color(0xc4b5fd)  // Light purple
    );
    // topGridHelper2.position.y = 5.1;
    // topGridHelper2.rotation.x = Math.PI;
    
    // Make accent grid slightly transparent
    const topGridMaterial2 = topGridHelper2.material;
    // if (Array.isArray(topGridMaterial2)) {
    //   topGridMaterial2.forEach(material => {
    //     material.opacity = 0.5;
    //     material.transparent = true;
    //   });
    // } else {
    //   topGridMaterial2.opacity = 0.5;
    //   topGridMaterial2.transparent = true;
    // }
    
    // scene.add(topGridHelper2);
    
    // Add fog for depth effect - darker fog that matches the background
    scene.fog = new THREE.Fog(0x111828, 15, 25);
    
    // Create a pulse effect for the grids
    let pulseTime = 0;
    
    // Animation loop
    let frameId;
    
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      // Increment pulse time
      pulseTime += 0.02;
      
      // Create more complex flowing motion for bottom grids
      bottomGridHelper.position.z = Math.sin(Date.now() * 0.0005) * 0.8;
      bottomGridHelper2.position.z = Math.sin(Date.now() * 0.0003) * 0.5;
      
      // Create opposite flowing motion for top grids
      topGridHelper.position.z = Math.sin(Date.now() * 0.0005 + Math.PI) * 0.8;
      topGridHelper2.position.z = Math.sin(Date.now() * 0.0003 + Math.PI) * 0.5;
      
      // Add a pulsing glow effect to the grid lines
      const pulse = (Math.sin(pulseTime) * 0.25) + 0.75; // Pulsing between 0.5 and 1.0
      
      // Apply pulse to bottom grids
      if (Array.isArray(bottomGridMaterial)) {
        bottomGridMaterial.forEach(material => {
          material.opacity = 0.6 * pulse;
        });
      }
      
      if (Array.isArray(bottomGridMaterial2)) {
        bottomGridMaterial2.forEach(material => {
          material.opacity = 0.5 * pulse;
        });
      }
      
      // Apply pulse to top grids
      if (Array.isArray(topGridMaterial)) {
        topGridMaterial.forEach(material => {
          material.opacity = 0.6 * pulse;
        });
      }
      
      if (Array.isArray(topGridMaterial2)) {
        topGridMaterial2.forEach(material => {
          material.opacity = 0.5 * pulse;
        });
      }
      
      // Add more sophisticated movement - slight rotation
      bottomGridHelper.rotation.z = Math.sin(Date.now() * 0.0001) * 0.03;
      topGridHelper.rotation.z = Math.sin(Date.now() * 0.0001 + Math.PI) * 0.03;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
    };
  }, []);

  return (
    <header className="pt-32 pb-20 relative overflow-hidden bg-[#111828] text-white">
      {/* Three.js Canvas for 3D Grid */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-0" 
        style={{ pointerEvents: 'none' }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-12 md:mb-0">
            <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white mb-6">
              Transform Your <span className="text-indigo-400">Image & PDF</span> Workflow
            </h1>
            <p className="hero-subtitle text-xl text-gray-300 my-12 max-w-lg">
              The all-in-one solution to process, edit, and convert your images and PDFs with advanced AI-powered tools.
            </p>
            <div className="hero-cta flex flex-wrap gap-4">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                Try For Free
              </button>
              <button className="bg-[#d1d4d6] hover:bg-white text-indigo-400 font-semibold py-3 px-6 rounded-lg border border-indigo-800 shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Watch Demo
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/2 relative">
            <motion.div
              className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-overlay opacity-20"
              variants={blobVariants}
              animate="animate"
            />
            <motion.div
              className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-overlay opacity-20"
              variants={blobVariants}
              animate="animate"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 600 500"
              width={600}
              height={500}
              className="relative z-10"
            >
              {/* Decorative elements with brighter colors */}
              <circle cx="150" cy="150" r="100" fill="#4f46e5" opacity="0.8" />
              <circle cx="300" cy="200" r="120" fill="#ec4899" opacity="0.6" />
              <circle cx="450" cy="150" r="90" fill="#f59e0b" opacity="0.7" />
              <circle cx="200" cy="350" r="110" fill="#10b981" opacity="0.7" />
              <circle cx="400" cy="380" r="95" fill="#8b5cf6" opacity="0.6" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
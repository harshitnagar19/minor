import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';


// Advanced 3D particle system for background
// Updated AdvancedBackground component to ensure continuous animation
const AdvancedBackground = () => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const particlesRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // Initialize three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    cameraRef.current = camera;
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Create particle system with more particles for better visibility
    const particleCount = 1500; // Increased from 1000
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3); // Add velocities for more dynamic motion
    
    const color1 = new THREE.Color(0x4361ee);
    const color2 = new THREE.Color(0x7209b7);
    
    for (let i = 0; i < particleCount; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      
      // Color
      const mixedColor = color1.clone().lerp(color2, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
      
      // Size
      sizes[i] = Math.random() * 2 + 0.5;
      
      // Velocity (for dynamic movement)
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const particleMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float distanceToCenter = length(gl_PointCoord - vec2(0.5));
          if (distanceToCenter > 0.5) {
            discard;
          }
          
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      vertexColors: true
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    particlesRef.current = particleSystem;
    
    // Add subtle animation lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x3a86ff,
      transparent: true,
      opacity: 0.2
    });
    
    for (let i = 0; i < 20; i++) {
      const lineGeometry = new THREE.BufferGeometry();
      const linePoints = [];
      const startPoint = new THREE.Vector3(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      );
      
      linePoints.push(startPoint);
      
      const endPoint = startPoint.clone().add(
        new THREE.Vector3(
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40
        )
      );
      
      linePoints.push(endPoint);
      
      lineGeometry.setFromPoints(linePoints);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
    }
    
    // Track mouse movement
    const handleMouseMove = (event) => {
      mouseRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop with improved particle dynamics
    const animate = () => {
      // Store the animation frame ID for cleanup
      animationFrameRef.current = requestAnimationFrame(animate);
      
      // Update particle positions for more dynamic movement
      const positions = particleSystem.geometry.attributes.position.array;
      
      for (let i = 0; i < particleCount; i++) {
        // Apply velocity to position
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];
        
        // Boundary check - if particles go too far, reset position
        if (Math.abs(positions[i * 3]) > 50) {
          positions[i * 3] = Math.sign(positions[i * 3]) * 50;
          velocities[i * 3] *= -1; // Reverse direction
        }
        if (Math.abs(positions[i * 3 + 1]) > 50) {
          positions[i * 3 + 1] = Math.sign(positions[i * 3 + 1]) * 50;
          velocities[i * 3 + 1] *= -1;
        }
        if (Math.abs(positions[i * 3 + 2]) > 50) {
          positions[i * 3 + 2] = Math.sign(positions[i * 3 + 2]) * 50;
          velocities[i * 3 + 2] *= -1;
        }
      }
      
      particleSystem.geometry.attributes.position.needsUpdate = true;
      
      // Rotate particle system more noticeably
      particleSystem.rotation.x += 0.001;
      particleSystem.rotation.y += 0.001;
      
      // Camera follows mouse position subtly
      camera.position.x += (mouseRef.current.x * 5 - camera.position.x) * 0.01;
      camera.position.y += (mouseRef.current.y * 5 - camera.position.y) * 0.01;
      camera.lookAt(scene.position);
      
      renderer.render(scene, camera);
    };
    
    // Start animation
    animate();
    
    // Proper cleanup function
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (rendererRef.current && rendererRef.current.domElement && container) {
        container.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose of geometries and materials to prevent memory leaks
      if (particlesRef.current) {
        particlesRef.current.geometry.dispose();
        particlesRef.current.material.dispose();
      }
      
      scene.clear();
    };
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ overflow: 'hidden' }}
    />
  );
};

export default AdvancedBackground;
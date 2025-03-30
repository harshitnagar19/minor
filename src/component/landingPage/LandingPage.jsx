import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import img from "../../assets/PlaceholderImage"
import Footer from '../utility/Footer';
import Hero from '../hero/Hero';
import NavBar from '../navBar/NavBar';
// Register ScrollTrigger plugin
 gsap.registerPlugin(ScrollTrigger);

const landingPage = () => {
  useEffect(() => {
    // Header animations
    gsap.from('.hero-title', { 
      duration: 1.2, 
      y: 100,
      opacity:0.8, 
      ease: 'power4.out', 
      delay: 0.5, 
    }); 
      
    gsap.from('.hero-subtitle', { 
      duration: 1.2, y: 50, 
      opacity: 0.7, 
      ease: 'power4.out', 
      delay: 0.8, 
    }); 
      
    gsap.from('.hero-cta', { 
      duration: 1, 
      y: 30, 
      opacity: 0.9, 
      ease: 'power3.out', 
      delay: 1.2, 
    });

  }, []);

  return (
    <div className="font-sans text-gray-900 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
     <NavBar/>
      {/* Hero Section */}
      <Hero></Hero>    
      {/* Footer */}
      <Footer />
    </div>
  )
}
export default landingPage;
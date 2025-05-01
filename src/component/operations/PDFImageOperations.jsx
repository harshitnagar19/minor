import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { imageOperations } from "../../data/imageoperation";
import { pdfOperations } from "../../data/pdfoperation";
import AdvancedBackground from './AdvancedBackground';
import { useNavigate } from 'react-router-dom';
// Advanced 3D particle system for background
// Updated AdvancedBackground component to ensure continuous animation

// Enhanced operation card with hover effects and animations
const OperationCard = ({ title, icon, description, color, onClick }) => {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const iconRef = useRef(null);
  
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 50, opacity: 0, rotateX: -10 },
        { 
          y: 0, 
          opacity: 1, 
          rotateX: 0,
          duration: 0.8, 
          delay: Math.random() * 0.5,
          ease: "power3.out"
        }
      );
    }
  }, []);
  
  const handleMouseEnter = () => {
    if (cardRef.current && glowRef.current && iconRef.current) {
      gsap.to(cardRef.current, {
        scale: 1.05,
        boxShadow: `0 20px 30px -10px rgba(0, 0, 0, 0.2), 0 0 20px rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.3)`,
        duration: 0.3
      });
      
      gsap.to(glowRef.current, {
        opacity: 0.4,
        scale: 1.2,
        duration: 0.4
      });
      
      gsap.to(iconRef.current, {
        y: -5,
        scale: 1.1,
        duration: 0.3
      });
    }
  };
  
  const handleMouseLeave = () => {
    if (cardRef.current && glowRef.current && iconRef.current) {
      gsap.to(cardRef.current, {
        scale: 1,
        boxShadow: `0 10px 15px -5px rgba(0, 0, 0, 0.2)`,
        duration: 0.3
      });
      
      gsap.to(glowRef.current, {
        opacity: 0.2,
        scale: 1,
        duration: 0.4
      });
      
      gsap.to(iconRef.current, {
        y: 0,
        scale: 1,
        duration: 0.3
      });
    }
  };

  return (
    <div 
      ref={cardRef}
      className="bg-gray-900 backdrop-blur-xl rounded-2xl p-6 transition-all duration-300 cursor-pointer overflow-hidden relative border border-gray-800"
      style={{ 
        boxShadow: `0 10px 15px -5px rgba(0, 0, 0, 0.2), 0 0 5px rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.1)`,
        transform: 'perspective(1000px)'
      }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={glowRef}
        className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 transition-all duration-300"
        style={{ backgroundColor: color }}
      ></div>
      
      <div className="flex flex-col h-full justify-between z-10 relative">
        <div 
          ref={iconRef}
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300"
          style={{ backgroundColor: `${color}20`, color: color }}
        >
          <div className="text-2xl">{icon}</div>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 text-sm mb-4">{description}</p>
        
        <div className="flex items-center text-sm font-medium" style={{ color }}>
          <span>Explore</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// Advanced animated tab switcher
const AnimatedTabs = ({ activeTab, setActiveTab }) => {
  const tabsContainerRef = useRef(null);
  const indicatorRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  
  useEffect(() => {
    const updateIndicator = () => {
      const container = tabsContainerRef.current;
      if (!container) return;
      
      const activeButton = container.querySelector(`[data-tab="${activeTab}"]`);
      if (!activeButton) return;
      
      setIndicatorStyle({
        width: `${activeButton.offsetWidth}px`,
        transform: `translateX(${activeButton.offsetLeft}px)`
      });
    };
    
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeTab]);

  return (
    <div ref={tabsContainerRef} className="inline-flex bg-gray-800 bg-opacity-30 backdrop-blur-md p-1 rounded-xl relative">
      <div
        ref={indicatorRef}
        className="absolute  text-center top-1 h-10 bg-indigo-600 rounded-lg transition-all duration-300 ease-out"
        style={indicatorStyle}
      ></div>
      
      <button
        data-tab="pdf"
        className={`px-6 sm:py-2 rounded-lg font-medium  z-10 relative transition-colors ${activeTab === 'pdf' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
        onClick={() => setActiveTab('pdf')}
      >
        PDF Operations
      </button>
      
      <button
        data-tab="image"
        className={`px-6 py-2 rounded-lg font-medium z-10 relative transition-colors ${activeTab === 'image' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
        onClick={() => setActiveTab('image')}
      >
        Image Operations
      </button>
    </div>
  );
};

const PDFImageOperations = () => {
  const [activeTab, setActiveTab] = useState('pdf');
  const [showCards, setShowCards] = useState(false);
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const descriptionRef = useRef(null);
  const navigate=useNavigate();
  
  useEffect(() => {
    if (containerRef.current && headingRef.current && descriptionRef.current) {
      // Initial page animation
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power2.inOut" }
      );
      
      // Heading animation
      const headingText = headingRef.current.innerHTML;
      headingRef.current.innerHTML = '';
      
      let headingHTML = '';
      for (let i = 0; i < headingText.length; i++) {
        if (headingText[i] === '<') {
          // Find the end of this tag
          const endIndex = headingText.indexOf('>', i);
          if (endIndex !== -1) {
            headingHTML += headingText.substring(i, endIndex + 1);
            i = endIndex;
            continue;
          }
        }
        
        headingHTML += `<span class="inline-block opacity-0">${headingText[i]}</span>`;
      }
      
      headingRef.current.innerHTML = headingHTML;
      
      const headingChars = headingRef.current.querySelectorAll('span');
      gsap.to(headingChars, {
        opacity: 1,
        stagger: 0.03,
        delay: 0.2,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          setShowCards(true);
        }
      });
      
      // Description animation
      gsap.fromTo(
        descriptionRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.8, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      <AdvancedBackground />
      
      <main className="container mx-auto px-6 py-36 relative z-10">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 
            ref={headingRef}
            className="text-5xl font-bold mb-8"
          >
            Transform Your 
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"> Image PDF </span>
            Workflow
          </h2>
          
          <p 
            ref={descriptionRef}
            className="text-xl text-gray-300"
          >
            The all-in-one solution to process, edit, and convert your images and PDFs with advanced AI-powered tools.
          </p>
        </div>
        
        <div className="flex justify-center mb-16">
          <AnimatedTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        {showCards && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(activeTab === 'pdf' ? pdfOperations : imageOperations).map((op, index) => (
              <OperationCard
                key={index}
                title={op.title}
                icon={op.icon}
                description={op.description}
                color={op.color}
                onClick={()=>{
                  // console.log(op.url)
                  navigate(op.url)
                }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PDFImageOperations;
import React, { useEffect } from 'react';
import harshitNagar from "../../assets/teamphoto/harshitNagar.jpg";
import hemant from "../../assets/teamphoto/hemant.jpg";
import harshitGawli from "../../assets/teamphoto/harshitGawli.png";
import lucky from "../../assets/teamphoto/lucky.png";
// Import AOS (Animate On Scroll) library
import AOS from 'aos';
import 'aos/dist/aos.css';
// Import for particles background
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const AboutUs = () => {
    // Initialize AOS animation library
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false,
            mirror: true,
        });
    }, []);

    // Particles initialization
    const particlesInit = async (main) => {
        await loadFull(main);
    };

    return (
        <div className="min-h-screen relative bg-gray-900 text-white overflow-hidden" style={{ background: 'linear-gradient(to bottom, #0f172a, #1e293b)' }}>
            {/* Particles Background Effect */}
            <Particles
                id="tsparticles"
                init={particlesInit}
                options={{
                    particles: {
                        number: {
                            value: 40,
                            density: {
                                enable: true,
                                value_area: 800
                            }
                        },
                        color: {
                            value: "#6366f1"
                        },
                        shape: {
                            type: "circle",
                        },
                        opacity: {
                            value: 0.5,
                            random: true,
                        },
                        size: {
                            value: 3,
                            random: true,
                        },
                        move: {
                            enable: true,
                            speed: 1,
                            direction: "none",
                            random: true,
                            out_mode: "out",
                        },
                        line_linked: {
                            enable: true,
                            distance: 150,
                            color: "#6366f1",
                            opacity: 0.2,
                            width: 1
                        },
                    },
                    interactivity: {
                        detect_on: "canvas",
                        events: {
                            onhover: {
                                enable: true,
                                mode: "grab"
                            },
                            onclick: {
                                enable: true,
                                mode: "push"
                            },
                            resize: true
                        },
                    },
                    retina_detect: true
                }}
                style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}
            />

            {/* Navigation Bar */}
            
            {/* Content Container with higher z-index */}
            <div className="container mx-auto px-6 pb-12 pt-20 relative z-10">
                {/* Hero Section with Typing Animation */}
                <div className="text-center mb-16" data-aos="fade-down">
                    <h1 className="text-5xl font-bold mb-4">About <span className="text-indigo-400 animate-pulse">MergX</span></h1>
                    <p
                        className="hidden md:block text-xl italic leading-12 tracking-widest text-gray-300 max-w-4xl mx-auto typewriter"
                        data-aos="fade-up"
                        data-aos-delay="300"
                       
                    >
                        Your all-in-one solution for image and PDF transformation in fastest way.
                    </p>
                    <p
                        className="block md:hidden text-md italic leading-12 tracking-widest text-gray-300 max-w-4xl  mx-auto typewriter"
                        data-aos="fade-up"
                        data-aos-delay="300"
                        
                    >
                        Your all-in-one solution for image & PDF.
                    </p>
                </div>

                {/* Mission Section with Split Animation */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                    <div data-aos="fade-right">
                        <h2 className="text-3xl font-bold mb-6 relative">
                            Our Mission
                            <span className="absolute bottom-0 left-0 w-20 h-1 bg-indigo-500 animate-pulse"></span>
                        </h2>
                        <p className="text-gray-300 mb-4">
                            Our mission is to democratize access to high-quality image processing and PDF management tools
                            through a comprehensive, free-to-use web application. We aim to eliminate the fragmentation and 
                            cost barriers in the current market by providing an all-in-one solution that empowers users to 
                            efficiently manipulate images and documents without switching between multiple platforms.
                            By developing an accessible platform with intuitive interfaces and optimized algorithms, 
                            we serve students, professionals, photographers, designers, and organizations with essential 
                            utilities while maintaining quality and ensuring data security. Through our Image Processing &
                            PDF Utility Application, we strive to bridge the gap between scattered tools and create a unified
                            hub where users can seamlessly accomplish their document and image processing tasks in one place.
                        </p>
                        <p className="text-gray-300">
                            We believe everyone deserves access to advanced document processing capabilities without complexity
                            or high costs. That's why we've built a platform that combines powerful features with intuitive design.
                        </p>
                    </div>
                    <div className="flex justify-center" data-aos="fade-left">
                        <div className="relative w-64 h-64">
                            <div className="absolute w-48 h-48 bg-indigo-600 rounded-full opacity-70 top-0 left-0 animate-blob"></div>
                            <div className="absolute w-40 h-40 bg-green-500 rounded-full opacity-70 bottom-0 left-8 animate-blob animation-delay-2000"></div>
                            <div className="absolute w-44 h-44 bg-orange-400 rounded-full opacity-70 right-0 top-8 animate-blob animation-delay-4000"></div>
                        </div>
                    </div>
                </div>

                {/* Team Section with Hover Effects */}
                <div className="mb-24">
                    <h2 className="text-3xl font-bold mb-10 text-center" data-aos="fade-up">
                        Our Team
                        <div className="h-1 w-24 bg-indigo-500 mx-auto mt-2"></div>
                    </h2>
                    <div className="flex justify-around flex-wrap md:grid-cols-3 gap-8">
                        {[
                            { name: "Harshit Nagar", role: "Designer and Developer", photo: harshitNagar },
                            { name: "Hemant Kamliya", role: "Designer and Developer", photo: hemant },
                            { name: "Harshit Gawli", role: "Designer and Developer", photo: harshitGawli },
                            { name: "Lucky Verma", role: "Designer and Developer", photo: lucky }
                        ].map((member, index) => (
                            <div 
                                key={index} 
                                className="bg-gray-800 rounded-lg p-6 text-center transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-2" 
                                data-aos="flip-up" 
                                data-aos-delay={index * 100}
                            >
                                <div className="relative overflow-hidden rounded-full mx-auto mb-4 group ">
                                    <img 
                                        className="w-24 h-24 rounded-full mx-auto hover:scale-[1.7] transition-transform duration-500 " 
                                        src={member.photo} 
                                        alt={member.name}
                                    />
                                    <div className="absolute inset-0 bg-opacity-30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <h3 className="text-xl font-semibold">{member.name}</h3>
                                <p className="text-gray-400">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Features Section with Staggered Animation */}
                <div className="mb-24">
                    <h2 className="text-3xl font-bold mb-10 text-center" data-aos="fade-up">
                        Why Choose ImaPDF
                        <div className="h-1 w-24 bg-indigo-500 mx-auto mt-2"></div>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "All-in-One Solution", description: "Users can access multiple image processing and PDF utilities in a single platform, eliminating the need to switch between different tools for tasks like compression, conversion, watermarking, splitting, and merging." },
                            { title: "Free and Open Access", description: "Unlike many existing solutions that hide advanced features behind paywalls, your platform offers comprehensive functionality completely free, making professional-grade tools accessible to everyone." },
                            { title: "User-Friendly Interface", description: "The application features an intuitive, responsive design built with React.js/Next.js, ensuring seamless interaction across devices and reducing the learning curve for new users." },
                            { title: "High Performance", description: "Optimized algorithms ensure minimal quality loss during processing while maintaining efficiency, allowing users to quickly complete tasks without sacrificing results." },
                            { title: "Web-Based Accessibility", description: "As a cloud-deployed solution, users can access the platform from anywhere without installation requirements, making it convenient for on-the-go use across different devices and operating systems." },
                            { title: "Data Privacy and Security", description: "The platform prioritizes secure handling of documents and images, ensuring user data remains protected throughout all processing operations without storing sensitive information unnecessarily." }
                        ].map((feature, index) => (
                            <div 
                                key={index} 
                                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30" 
                                data-aos="zoom-in-up" 
                                data-aos-delay={index * 100}
                            >
                                <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center mb-4 animate-pulse">
                                    <span className="text-xl font-bold">{index + 1}</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Animated Gradient Footer */}
            <div className="h-4 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient"></div>
        </div>
    );
};

// Adding custom animations styles
const styles = `
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 15s ease infinite;
}

.typewriter {
   overflow: hidden;
  border-right: .15em solid transparent;
  white-space: nowrap;
  animation: typing 3.5s steps(40, end), blink-caret .75s step-end infinite;
}

@keyframes typing {
  from { width: 0 }
  to { width: 200vw }
}

@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: #6366f1; }
}
`;

// Create a style element and append the CSS
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

export default AboutUs;
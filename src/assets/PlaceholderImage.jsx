import React from 'react';

const PlaceholderImage = () => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 600 500" 
      width={600} 
      height={500}
    >
      {/* Background */}
      <rect width="600" height="500" fill="#f5f5f5"/>
      
      {/* Decorative elements */}
      <circle cx="150" cy="150" r="100" fill="#4285f4" opacity="0.8"/>
      <circle cx="300" cy="200" r="120" fill="#ea4335" opacity="0.6"/>
      <circle cx="450" cy="150" r="90" fill="#fbbc05" opacity="0.7"/>
      <circle cx="200" cy="350" r="110" fill="#34a853" opacity="0.7"/>
      <circle cx="400" cy="380" r="95" fill="#673ab7" opacity="0.6"/>
      
      {/* Text */}
      <text x="300" y="250" fontFamily="Arial" fontSize="32" textAnchor="middle" fill="#333">
        Placeholder Image
      </text>
      <text x="300" y="290" fontFamily="Arial" fontSize="18" textAnchor="middle" fill="#666">
        600 × 500
      </text>
    </svg>
  );
};

export default PlaceholderImage;
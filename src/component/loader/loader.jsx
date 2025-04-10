// component/Loader.jsx
import React from 'react';

const Loader = () => {
  return (
    <div className="bg-slate-900 h-screen flex items-center justify-center">
      <div className="border-4 border-t-transparent border-pink-600 w-[50px] h-[50px] absolute rounded-full animate-spin"></div>
      <div className="border-4 border-l-transparent border-yellow-300 w-[80px] h-[80px] absolute rounded-full animate-spin"></div>
      <div className="border-4 border-b-transparent border-purple-300 w-[100px] h-[100px] absolute rounded-full animate-spin "></div>
      <div className="border-4 border-r-transparent border-green-300 w-[120px] h-[120px] absolute rounded-full animate-spin "></div>
    </div>
  );
};

export default Loader;

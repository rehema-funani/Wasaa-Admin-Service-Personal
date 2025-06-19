import React from 'react';

const GradientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-[-30%] right-[-10%] w-[800px] h-[800px] rounded-full bg-gradient-to-b from-blue-50 to-sky-100 animate-float opacity-60"></div>
      <div className="absolute bottom-[-20%] left-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-indigo-50 to-violet-100 animate-float animation-delay-2000 opacity-50"></div>
      <div className="absolute top-[20%] left-[30%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-rose-50 to-orange-100 animate-float animation-delay-1000 opacity-40"></div>

      <div className="absolute top-[10%] right-[20%] w-[100px] h-[100px] rounded-full bg-gradient-to-r from-white/80 to-white/40 backdrop-blur-sm border border-white/30 animate-float animation-delay-2000"></div>
      <div className="absolute bottom-[15%] right-[10%] w-[80px] h-[80px] rounded-full bg-gradient-to-r from-white/70 to-white/30 backdrop-blur-sm border border-white/20 animate-float animation-delay-1000"></div>
      <div className="absolute top-[40%] left-[10%] w-[60px] h-[60px] rounded-full bg-gradient-to-r from-white/60 to-white/20 backdrop-blur-sm border border-white/20 animate-float animation-delay-3000"></div>
    </div>
  );
};

export default GradientBackground;

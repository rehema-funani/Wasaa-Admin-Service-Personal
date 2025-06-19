import React from 'react';

const GradientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Main large gradients with increased vibrancy */}
      <div className="absolute top-[-30%] right-[-10%] w-[800px] h-[800px] rounded-full bg-gradient-to-b from-primary-100/90 to-accent-blue/25 animate-float opacity-80 blur-xl"></div>
      <div className="absolute bottom-[-20%] left-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-secondary-200/80 to-accent-purple/25 animate-float animation-delay-2000 opacity-70 blur-xl"></div>
      <div className="absolute top-[20%] left-[30%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-money-200/80 to-success-100/50 animate-float animation-delay-1000 opacity-60 blur-xl"></div>

      {/* More vibrant accent gradients */}
      <div className="absolute top-[60%] left-[15%] w-[200px] h-[200px] rounded-full bg-gradient-to-r from-success-200/50 to-money-300/30 animate-float animation-delay-3000 opacity-50 blur-lg"></div>
      <div className="absolute top-[25%] right-[30%] w-[250px] h-[250px] rounded-full bg-gradient-to-l from-warning-200/50 to-warning-100/30 animate-float animation-delay-2500 opacity-50 blur-lg"></div>

      {/* Dynamic pulse glows */}
      <div className="absolute top-[40%] right-[40%] w-[120px] h-[120px] rounded-full bg-gradient-radial from-primary-300/30 to-transparent animate-pulse-slow opacity-70 blur-xl"></div>
      <div className="absolute bottom-[30%] left-[35%] w-[150px] h-[150px] rounded-full bg-gradient-radial from-secondary-300/30 to-transparent animate-pulse-slow animation-delay-1500 opacity-70 blur-xl"></div>

      {/* Financial indicators with enhanced animation */}
      <div className="absolute top-[30%] left-[60%] h-[120px] w-[2px] bg-gradient-to-b from-success-100/0 via-success-400/60 to-success-100/0 animate-data-flow"></div>
      <div className="absolute top-[32%] left-[61%] h-[80px] w-[2px] bg-gradient-to-b from-success-100/0 via-success-400/50 to-success-100/0 animate-data-flow animation-delay-1000"></div>
      <div className="absolute top-[34%] left-[62%] h-[100px] w-[2px] bg-gradient-to-b from-success-100/0 via-success-400/40 to-success-100/0 animate-data-flow animation-delay-2000"></div>

      {/* Additional data lines for more dynamic feel */}
      <div className="absolute top-[28%] left-[63%] h-[90px] w-[2px] bg-gradient-to-b from-primary-100/0 via-primary-400/50 to-primary-100/0 animate-data-flow animation-delay-500"></div>
      <div className="absolute top-[31%] left-[64%] h-[110px] w-[2px] bg-gradient-to-b from-primary-100/0 via-primary-400/40 to-primary-100/0 animate-data-flow animation-delay-1500"></div>

      {/* Horizontal data lines */}
      <div className="absolute top-[40%] left-[55%] h-[2px] w-[80px] bg-gradient-to-r from-primary-100/0 via-primary-400/30 to-primary-100/0 animate-subtle-slide"></div>
      <div className="absolute top-[42%] left-[55%] h-[2px] w-[60px] bg-gradient-to-r from-success-100/0 via-success-400/30 to-success-100/0 animate-subtle-slide animation-delay-1200"></div>

      {/* Enhanced chat/message bubbles */}
      <div className="absolute top-[65%] right-[30%] w-[80px] h-[40px] rounded-2xl bg-gradient-to-r from-primary-200/40 to-primary-100/20 border border-primary-200/30 backdrop-blur-sm rotate-12 animate-float animation-delay-1500 shadow-soft-sm"></div>
      <div className="absolute top-[67%] right-[35%] w-[60px] h-[30px] rounded-2xl bg-gradient-to-r from-secondary-200/40 to-secondary-100/20 border border-secondary-200/30 backdrop-blur-sm -rotate-6 animate-float animation-delay-2500 shadow-soft-sm"></div>
      <div className="absolute top-[63%] right-[25%] w-[70px] h-[35px] rounded-2xl bg-gradient-to-r from-primary-100/30 to-primary-50/15 border border-primary-100/25 backdrop-blur-sm rotate-3 animate-float animation-delay-3500 shadow-soft-sm"></div>

      {/* Grid patterns for administration/data */}
      <div className="absolute inset-0 bg-grid-light bg-grid-lg opacity-10"></div>

      {/* Geometric shapes with subtle rotation */}
      <div className="absolute bottom-[30%] right-[40%] w-[120px] h-[120px] rounded-3xl bg-gradient-to-br from-white/15 to-white/5 border border-white/20 backdrop-blur-sm rotate-12 animate-subtle-rotate animation-delay-3500 shadow-soft-sm"></div>
      <div className="absolute top-[20%] right-[60%] w-[100px] h-[100px] rounded-3xl bg-gradient-to-br from-white/15 to-white/5 border border-white/20 backdrop-blur-sm -rotate-12 animate-subtle-rotate animation-delay-1200 shadow-soft-sm"></div>

      {/* Enhanced currency indicators */}
      <div className="absolute top-[45%] right-[25%] w-[50px] h-[50px] rounded-full bg-gradient-to-r from-warning-200/50 to-warning-100/30 border border-warning-200/40 backdrop-blur-sm flex items-center justify-center animate-breathe animation-delay-2800 shadow-soft">
        <div className="text-warning-500/70 text-xl font-bold">$</div>
      </div>

      <div className="absolute bottom-[35%] left-[20%] w-[50px] h-[50px] rounded-full bg-gradient-to-r from-success-200/50 to-success-100/30 border border-success-200/40 backdrop-blur-sm flex items-center justify-center animate-breathe animation-delay-1800 shadow-soft">
        <div className="text-success-500/70 text-xl font-bold">€</div>
      </div>

      <div className="absolute top-[25%] left-[25%] w-[45px] h-[45px] rounded-full bg-gradient-to-r from-primary-200/50 to-primary-100/30 border border-primary-200/40 backdrop-blur-sm flex items-center justify-center animate-breathe animation-delay-1000 shadow-soft">
        <div className="text-primary-500/70 text-xl font-bold">¥</div>
      </div>

      {/* iOS 18-style soft flares with increased size */}
      <div className="absolute top-[10%] left-[50%] w-[400px] h-[400px] rounded-full radial-gradient from-primary-200/10 to-transparent blur-3xl"></div>
      <div className="absolute bottom-[10%] right-[40%] w-[350px] h-[350px] rounded-full radial-gradient from-secondary-200/10 to-transparent blur-3xl"></div>

      {/* Premium effect light streaks */}
      <div className="absolute top-[15%] left-[30%] w-[2px] h-[150px] bg-gradient-to-b from-white/0 via-white/30 to-white/0 rotate-[45deg] animate-pulse-slow opacity-50"></div>
      <div className="absolute bottom-[25%] right-[35%] w-[2px] h-[120px] bg-gradient-to-b from-white/0 via-white/30 to-white/0 rotate-[-60deg] animate-pulse-slow animation-delay-2000 opacity-50"></div>

      {/* Additional soft glows with shimmer effect */}
      <div className="absolute top-[50%] right-[15%] w-[200px] h-[200px] rounded-full bg-gradient-radial from-primary-200/5 to-transparent blur-2xl animate-pulse-slow animation-delay-2800"></div>
      <div className="absolute bottom-[40%] left-[45%] w-[180px] h-[180px] rounded-full bg-gradient-radial from-money-200/5 to-transparent blur-2xl animate-pulse-slow animation-delay-1300"></div>

      {/* Premium shimmer lines */}
      <div className="absolute top-[37%] left-[20%] w-[120px] h-[1px] bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer"></div>
      <div className="absolute bottom-[45%] right-[25%] w-[150px] h-[1px] bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer animation-delay-1500"></div>
    </div>
  );
};

export default GradientBackground;

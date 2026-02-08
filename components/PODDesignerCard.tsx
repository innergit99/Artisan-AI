import React, { useState, useEffect, useRef } from 'react';
import { ToolType } from '../types';
import { Shirt, ArrowRight, Sparkles, Layers, Zap, Palette, Box, Monitor } from 'lucide-react';

interface PODDesignerCardProps {
  isDarkMode: boolean;
  isPrimary: boolean;
  onNavigate: (toolId: ToolType) => void;
  getCtaLabel: (toolId: ToolType) => string;
}

const productImages = [
  '/assets/dashboard/pod_designer.png',
];

const productLabels = ['T-Shirts', 'Mugs', 'Posters', 'Phone Cases', 'Tote Bags', 'Hoodies'];

const styleChips = [
  { name: '3D Text', icon: Box },
  { name: 'Neon', icon: Zap },
  { name: 'Retro', icon: Palette },
  { name: 'Graffiti', icon: Sparkles },
];

export const PODDesignerCard: React.FC<PODDesignerCardProps> = ({ 
  isDarkMode, 
  isPrimary, 
  onNavigate,
  getCtaLabel 
}) => {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLButtonElement>(null);

  // Auto-rotate products every 3 seconds when not hovered
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setCurrentProductIndex((prev) => (prev + 1) % productImages.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMousePosition({ x, y });
  };

  return (
    <button
      ref={cardRef}
      onClick={() => onNavigate(ToolType.POD_MERCH)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
      className={`group relative h-[450px] rounded-[4rem] overflow-hidden text-left transition-all duration-700 border-2 cursor-pointer
        ${isPrimary 
          ? (isDarkMode 
            ? 'scale-105 z-20 shadow-[0_0_80px_rgba(236,72,153,0.4)] border-pink-500/60' 
            : 'scale-105 z-20 shadow-[0_0_80px_rgba(236,72,153,0.25)] border-pink-300')
          : (isDarkMode 
            ? 'border-white/10 hover:border-pink-500/40' 
            : 'border-slate-900/20 shadow-2xl shadow-black/5 hover:border-pink-400')
        }
        ${isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-pink-950/30 backdrop-blur-3xl' 
          : 'bg-gradient-to-br from-white via-pink-50/50 to-rose-50 shadow-2xl shadow-slate-400/20'
        }`}
      style={{
        transform: `perspective(1000px) rotateX(${-mousePosition.y}deg) rotateY(${mousePosition.x}deg) scale(${isHovered ? 1.02 : 1})`,
        transition: 'transform 0.1s ease-out'
      }}
    >
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div 
          className={`absolute w-[600px] h-[600px] rounded-full blur-[120px] transition-all duration-1000
            ${isDarkMode ? 'bg-pink-600/20' : 'bg-pink-400/30'}`}
          style={{
            top: '10%',
            left: '50%',
            transform: `translate(-50%, -50%) ${isHovered ? 'scale(1.3)' : 'scale(1)'}`
          }}
        />
        <div 
          className={`absolute w-[400px] h-[400px] rounded-full blur-[100px] transition-all duration-1000 delay-75
            ${isDarkMode ? 'bg-purple-600/15' : 'bg-purple-400/20'}`}
          style={{
            bottom: '0%',
            right: '0%',
            transform: isHovered ? 'scale(1.4) translate(10%, 10%)' : 'scale(1)'
          }}
        />
        <div 
          className={`absolute w-[300px] h-[300px] rounded-full blur-[80px] transition-all duration-1000 delay-150
            ${isDarkMode ? 'bg-rose-500/10' : 'bg-rose-300/25'}`}
          style={{
            top: '60%',
            left: '0%',
            transform: isHovered ? 'scale(1.2) translate(-10%, -10%)' : 'scale(1)'
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full animate-float-particle
              ${isDarkMode ? 'bg-pink-400/30' : 'bg-pink-500/40'}`}
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Glassmorphic Overlay Panel with Dynamic Product Label */}
      <div 
        className={`absolute top-8 right-8 w-48 h-64 rounded-[2.5rem] backdrop-blur-xl border transition-all duration-500 overflow-hidden
          ${isDarkMode 
            ? 'bg-slate-900/40 border-white/10' 
            : 'bg-white/60 border-white/40'
          }
          ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-80'}`}
      >
        {/* Product Image */}
        <div className="relative h-40 w-full overflow-hidden rounded-t-[2.5rem]">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ 
              backgroundImage: `url(${productImages[0]})`,
            }}
          />
          <div className={`absolute inset-0 
            ${isDarkMode ? 'bg-gradient-to-t from-slate-900/80 to-transparent' : 'bg-gradient-to-t from-white/60 to-transparent'}`}
          />
        </div>
        
        {/* Cycling Product Label */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-black uppercase tracking-wider
              ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Product
            </span>
            <div className="relative h-5 overflow-hidden">
              {productLabels.map((label, index) => (
                <div
                  key={label}
                  className={`absolute inset-0 text-xs font-black uppercase tracking-tighter transition-all duration-500
                    ${index === currentProductIndex 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-4'
                    }
                    ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-2 flex gap-1">
            {productLabels.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300
                  ${index === currentProductIndex 
                    ? 'flex-1 bg-pink-500' 
                    : 'w-1 bg-slate-400/30'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Status Badge - Top Left */}
      <div className="absolute top-8 left-8 flex flex-col gap-2">
        {isPrimary && (
          <div className="px-4 py-2 rounded-full bg-pink-600 text-white text-[9px] font-black uppercase tracking-[0.2em] shadow-lg animate-pulse flex items-center gap-2">
            <Zap size={12} className="fill-current" />
            Trending Now
          </div>
        )}
        <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center gap-2
          ${isDarkMode 
            ? 'bg-slate-950/50 border-white/10 text-slate-400' 
            : 'bg-white/70 border-slate-200 text-slate-500'
          }`}
        >
          <Layers size={12} />
          30+ Product Types
        </div>
      </div>

      {/* Main Content Area */}
      <div className="absolute inset-0 p-10 flex flex-col justify-end z-10">
        {/* Icon Container with Glow */}
        <div className="relative mb-4">
          <div 
            className={`absolute inset-0 rounded-2xl blur-xl transition-opacity duration-500
              ${isHovered ? 'opacity-100' : 'opacity-60'}
              ${isDarkMode ? 'bg-pink-500/40' : 'bg-pink-400/50'}`}
          />
          <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3
            ${isDarkMode ? 'bg-slate-900 shadow-black' : 'bg-white shadow-pink-200'}`}
          >
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-inner">
              <Shirt size={28} className="text-white" />
            </div>
          </div>
        </div>

        {/* Title with Animated Underline */}
        <div className="relative mb-3">
          <h3 className={`text-4xl font-black uppercase italic tracking-tighter leading-none
            ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            POD Designer
          </h3>
          <div 
            className={`absolute -bottom-1 left-0 h-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500
              ${isHovered ? 'w-full' : 'w-0'}`}
          />
        </div>

        {/* Description */}
        <p className={`text-sm font-bold italic leading-relaxed mb-4 max-w-[280px]
          ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Design covers, interiors, and full-wrap assets for 30+ print-ready product types.
        </p>

        {/* Style Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {styleChips.map((style, index) => {
            const Icon = style.icon;
            return (
              <div
                key={style.name}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all duration-300
                  ${isHovered 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-60 translate-y-1'
                  }
                  ${isDarkMode 
                    ? 'bg-slate-800/80 text-slate-300 border border-white/5' 
                    : 'bg-white/80 text-slate-600 border border-slate-200'
                  }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <Icon size={10} />
                {style.name}
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="flex items-center justify-between">
          {isPrimary && (
            <div className="flex items-center gap-2 text-pink-500 font-black text-[10px] uppercase tracking-widest group-hover:translate-x-2 transition-transform">
              {getCtaLabel(ToolType.POD_MERCH)} <ArrowRight size={14} />
            </div>
          )}
          
          {/* Live Preview Indicator */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider
            ${isDarkMode 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-emerald-100 text-emerald-600 border border-emerald-200'
            }`}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Preview
          </div>
        </div>
      </div>

      {/* Animated Corner Arrow */}
      <div className={`absolute top-8 right-8 mt-[280px] transition-all duration-500 z-20
        ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
      >
        <div className={`p-4 rounded-[1.5rem] shadow-2xl transition-all duration-300
          ${isDarkMode 
            ? 'bg-pink-600 text-white shadow-pink-600/30' 
            : 'bg-pink-500 text-white shadow-pink-500/30'
          }
          ${isHovered ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}`}
        >
          <ArrowRight size={20} />
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className={`absolute bottom-0 left-0 right-0 h-48 pointer-events-none
        ${isDarkMode 
          ? 'bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent' 
          : 'bg-gradient-to-t from-white via-white/90 to-transparent'
        }`}
      />

      {/* Hover Glow Effect */}
      <div 
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
          ${isDarkMode 
            ? 'bg-gradient-to-tr from-pink-600/10 via-transparent to-purple-600/10' 
            : 'bg-gradient-to-tr from-pink-400/20 via-transparent to-purple-400/20'
          }`}
      />
    </button>
  );
};

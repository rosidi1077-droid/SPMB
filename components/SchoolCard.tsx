
import React, { useState } from 'react';
import { SchoolLevel } from '../types.ts';

interface SchoolCardProps {
  level: SchoolLevel;
  title: string;
  description: string;
  image: string;
  onRegister: (level: SchoolLevel) => void;
}

const SchoolCard: React.FC<SchoolCardProps> = ({ level, title, description, image, onRegister }) => {
  const [imgError, setImgError] = useState(false);

  // Map ikon berdasarkan jenjang
  const getIcon = () => {
    switch(level) {
      case SchoolLevel.TPA: return 'fa-baby';
      case SchoolLevel.TK: return 'fa-shapes';
      case SchoolLevel.SD: return 'fa-book-reader';
      case SchoolLevel.SMP: return 'fa-microscope';
      case SchoolLevel.SMA: return 'fa-flask';
      default: return 'fa-graduation-cap';
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-slate-100 group">
      <div className="h-48 overflow-hidden bg-slate-100 relative">
        {!imgError ? (
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-50 text-emerald-600">
            <i className={`fas ${getIcon()} text-5xl mb-2 opacity-40`}></i>
            <span className="text-xs font-bold uppercase tracking-widest">{level}</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded uppercase">{level}</span>
        <h3 className="text-xl font-bold text-slate-800 mt-2">{title}</h3>
        <p className="text-slate-500 text-sm mb-6 line-clamp-2">{description}</p>
        <button 
          onClick={() => onRegister(level)} 
          className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 shadow-md shadow-emerald-100 transition-all active:scale-95"
        >
          Daftar
        </button>
      </div>
    </div>
  );
};

export default SchoolCard;

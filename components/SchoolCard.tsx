
import React from 'react';
import { SchoolLevel } from '../types';

interface SchoolCardProps {
  level: SchoolLevel;
  title: string;
  description: string;
  image: string;
  onRegister: (level: SchoolLevel) => void;
}

const SchoolCard: React.FC<SchoolCardProps> = ({ level, title, description, image, onRegister }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-slate-100 group">
      <div className="h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">{level}</span>
          <div className="flex space-x-1">
             {[1,2,3,4,5].map(i => <i key={i} className="fas fa-star text-yellow-400 text-xs"></i>)}
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-500 text-sm mb-6 line-clamp-2">{description}</p>
        <button 
          onClick={() => onRegister(level)}
          className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center"
        >
          Daftar Sekarang
        </button>
      </div>
    </div>
  );
};

export default SchoolCard;

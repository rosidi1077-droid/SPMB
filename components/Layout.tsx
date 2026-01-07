
import React from 'react';
import { Link } from 'react-router-dom';
import { YAYASAN_NAME, getAdminPhone } from '../constants.tsx';

interface LayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isAdmin }) => {
  const adminPhone = getAdminPhone();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-emerald-700 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <i className="fas fa-graduation-cap text-emerald-700 text-xl"></i>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">{YAYASAN_NAME}</h1>
              <p className="text-xs text-emerald-100 opacity-80">Portal SPMB</p>
            </div>
          </Link>
          <nav>
            <ul className="flex space-x-6 text-sm font-medium">
              <li>
                <Link to="/" className="hover:text-emerald-200 transition-colors">Beranda</Link>
              </li>
              {!isAdmin ? (
                <li>
                  <Link to="/admin" className="hover:text-emerald-200 transition-colors flex items-center">
                    <i className="fas fa-user-lock mr-1"></i> Admin
                  </Link>
                </li>
              ) : (
                <li>
                  <Link to="/" className="bg-white text-emerald-700 px-3 py-1 rounded hover:bg-emerald-50 transition-colors font-bold">
                    Keluar Panel
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-slate-900 text-slate-400 py-10 px-4">
        <div className="container mx-auto text-center">
          <h4 className="text-white font-bold mb-2">{YAYASAN_NAME}</h4>
          <p className="text-xs mb-4">Membentuk Generasi Cerdas & Berakhlak Mulia</p>
          <div className="flex flex-col items-center space-y-2 mb-6">
             <a 
               href={`https://wa.me/${adminPhone}`} 
               target="_blank" 
               rel="noopener noreferrer" 
               className="text-emerald-500 hover:text-emerald-400 flex items-center text-sm font-medium transition-colors"
             >
                <i className="fab fa-whatsapp mr-2"></i>
                WhatsApp Admin: +{adminPhone}
             </a>
          </div>
          <hr className="border-slate-800 mb-6" />
          <p className="text-[10px]">&copy; {new Date().getFullYear()} {YAYASAN_NAME}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

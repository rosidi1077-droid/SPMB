
import React from 'react';
import { YAYASAN_NAME } from '../constants.tsx';

interface LayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isAdmin }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-emerald-700 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <i className="fas fa-graduation-cap text-emerald-700 text-xl"></i>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">{YAYASAN_NAME}</h1>
              <p className="text-xs text-emerald-100 opacity-80">Portal SPMB</p>
            </div>
          </div>
          <nav>
            <ul className="flex space-x-6 text-sm font-medium">
              <li><a href="#/" className="hover:text-emerald-200">Beranda</a></li>
              {!isAdmin ? (
                <li><a href="#/admin" className="hover:text-emerald-200"><i className="fas fa-user-lock mr-1"></i>Admin</a></li>
              ) : (
                <li><a href="#/" className="bg-white text-emerald-700 px-3 py-1 rounded">Keluar</a></li>
              )}
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-sm">
        &copy; {new Date().getFullYear()} {YAYASAN_NAME}
      </footer>
    </div>
  );
};

export default Layout;

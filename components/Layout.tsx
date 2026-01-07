
import React from 'react';
import { YAYASAN_NAME } from '../constants';

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
              <p className="text-xs text-emerald-100 opacity-80">Portal Penerimaan Murid Baru</p>
            </div>
          </div>
          <nav>
            <ul className="flex space-x-6 text-sm font-medium">
              <li><a href="#/" className="hover:text-emerald-200 transition-colors">Beranda</a></li>
              {!isAdmin && <li><a href="#/admin" className="hover:text-emerald-200 transition-colors"><i className="fas fa-user-lock mr-2"></i>Admin</a></li>}
              {isAdmin && <li><a href="#/" className="bg-white text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors">Keluar</a></li>}
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold mb-4">{YAYASAN_NAME}</h3>
              <p className="text-sm">Membentuk generasi cerdas, berakhlak mulia, dan berwawasan luas. Melayani pendidikan dari jenjang TPA hingga SMA.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Kontak Kami</h4>
              <ul className="text-sm space-y-2">
                <li><i className="fas fa-map-marker-alt mr-2 text-emerald-500"></i> Alamat Sekolah Dhia El Widad</li>
                <li><i className="fas fa-phone mr-2 text-emerald-500"></i> +62 812 3456 7890</li>
                <li><i className="fas fa-envelope mr-2 text-emerald-500"></i> info@dhiaelwidad.sch.id</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Jam Operasional</h4>
              <p className="text-sm">Senin - Jumat: 07:30 - 16:00</p>
              <p className="text-sm">Sabtu: 08:00 - 12:00</p>
            </div>
          </div>
          <hr className="my-8 border-slate-800" />
          <p className="text-center text-xs">&copy; {new Date().getFullYear()} {YAYASAN_NAME}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;


import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import SchoolCard from './components/SchoolCard.tsx';
import RegistrationModal from './components/RegistrationModal.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import { SchoolLevel } from './types.ts';
import { SCHOOL_LEVELS, getAdminPhone } from './constants.tsx';

const LandingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<SchoolLevel>(SchoolLevel.SD);

  const handleRegister = (level: SchoolLevel) => {
    setSelectedLevel(level);
    setIsModalOpen(true);
  };

  const contactAdmin = () => {
    const adminPhone = getAdminPhone();
    const message = encodeURIComponent("Halo Admin Yayasan Dhia El Widad, saya butuh bantuan terkait pendaftaran murid baru.");
    window.open(`https://wa.me/${adminPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-emerald-700 text-white pt-20 pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto relative z-10 text-center">
          <span className="bg-emerald-600/50 backdrop-blur-md px-4 py-1 rounded-full text-sm font-semibold mb-6 inline-block border border-emerald-500/30">
            Tahun Ajaran 2024 / 2025
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight max-w-4xl mx-auto">
            Membangun Masa Depan Gemilang di <span className="text-emerald-200">Dhia El Widad</span>
          </h1>
          <p className="text-lg md:text-xl text-emerald-50 opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Daftarkan putra-putri Anda melalui proses yang mudah dan cepat. Cukup isi data inti dan pendaftaran otomatis diarahkan ke WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => handleRegister(SchoolLevel.SD)}
              className="bg-white text-emerald-700 px-8 py-4 rounded-2xl font-bold shadow-xl hover:bg-emerald-50 transition-all flex items-center justify-center space-x-2"
            >
              <span>Daftar Sekarang</span>
              <i className="fas fa-arrow-right"></i>
            </button>
            <a 
              href="#schools"
              className="bg-emerald-600/40 border border-emerald-500/30 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-600/60 transition-all"
            >
              Lihat Jenjang Pendidikan
            </a>
          </div>
        </div>
      </section>

      {/* School Levels Section */}
      <section id="schools" className="py-20 -mt-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <SchoolCard 
            level={SchoolLevel.TPA}
            title="TPA Dhia El Widad"
            description="Layanan penitipan anak terpercaya dengan stimulasi dini yang berkualitas."
            image="https://images.unsplash.com/photo-1502086223501-7ea24ec8f4f6?q=80&w=600&auto=format&fit=crop"
            onRegister={handleRegister}
          />
          <SchoolCard 
            level={SchoolLevel.TK}
            title="TK & PAUD"
            description="Bermain sambil belajar untuk membangun fondasi karakter dan kreativitas."
            image="https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=600&auto=format&fit=crop"
            onRegister={handleRegister}
          />
          <SchoolCard 
            level={SchoolLevel.SD}
            title="Sekolah Dasar"
            description="Pendidikan dasar holistik yang memadukan akademik dan nilai-nilai moral."
            image="https://images.unsplash.com/photo-1503676260728-1c00da096a0b?q=80&w=600&auto=format&fit=crop"
            onRegister={handleRegister}
          />
          <SchoolCard 
            level={SchoolLevel.SMP}
            title="Sekolah Menengah Pertama"
            description="Mengembangkan potensi remaja melalui kurikulum yang adaptif dan inovatif."
            image="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop"
            onRegister={handleRegister}
          />
          <SchoolCard 
            level={SchoolLevel.SMA}
            title="Sekolah Menengah Atas"
            description="Persiapan matang menuju jenjang universitas dan masa depan profesional."
            image="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop"
            onRegister={handleRegister}
          />
          <div className="bg-emerald-900 rounded-2xl p-8 flex flex-col justify-center text-white shadow-xl border border-emerald-800">
             <div className="w-12 h-12 bg-emerald-700 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-question text-xl"></i>
             </div>
             <h3 className="text-2xl font-bold mb-4">Butuh Bantuan?</h3>
             <p className="text-emerald-100 text-sm mb-6 opacity-80">
               Jika Anda mengalami kesulitan, tim Admin kami siap membantu proses pendaftaran dan upload berkas Anda.
             </p>
             <button onClick={contactAdmin} className="flex items-center space-x-2 text-white font-bold group text-left transition-all hover:translate-x-1">
                <span className="border-b border-white pb-1 group-hover:pr-4 transition-all">Hubungi Admin Sekarang</span>
                <i className="fas fa-external-link-alt text-xs"></i>
             </button>
          </div>
        </div>
      </section>

      <RegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialLevel={selectedLevel}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><LandingPage /></Layout>} />
        <Route path="/admin" element={<Layout isAdmin={true}><AdminDashboard /></Layout>} />
      </Routes>
    </Router>
  );
};

export default App;

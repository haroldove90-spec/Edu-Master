
import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar as CalendarIcon, 
  Users, 
  Settings, 
  LogOut,
  UserCircle,
  Menu,
  X,
  GraduationCap
} from 'lucide-react';
import { Role } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeRole: Role;
  onRoleSwitch: (role: Role) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeRole, onRoleSwitch, currentPage, setCurrentPage }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Menú para Administrador
  const adminMenu = [
    { id: 'dashboard', label: 'Panel Control', icon: LayoutDashboard },
    { id: 'courses', label: 'Cursos', icon: BookOpen },
    { id: 'calendar', label: 'Calendario', icon: CalendarIcon },
    { id: 'students', label: 'Estudiantes', icon: Users },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  // Menú para Estudiante (Añadido 'Configuración' como Mi Perfil)
  const studentMenu = [
    { id: 'explorer', label: 'Cursos', icon: BookOpen },
    { id: 'my-enrollments', label: 'Mis Inscripciones', icon: CalendarIcon },
    { id: 'settings', label: 'Mi Perfil', icon: Settings },
  ];

  const menuItems = activeRole === 'ADMIN' ? adminMenu : studentMenu;

  const handlePageChange = (id: string) => {
    setCurrentPage(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#F5F7FF] overflow-hidden relative font-sans text-[#1A1C1E]">
      {/* Mobile Overlay - Tapping outside closes menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 transition-all duration-500 ease-in-out bg-white shadow-2xl md:shadow-none flex flex-col
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'}
        ${isSidebarOpen ? 'md:w-72' : 'md:w-24'}
      `}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="bg-[#2D5AF0] p-3 rounded-[1.25rem] shadow-lg shadow-blue-200 shrink-0">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            {(isSidebarOpen || isMobileMenuOpen) && (
              <span className="font-extrabold text-2xl tracking-tight text-[#001A72] animate-in fade-in slide-in-from-left-2">EduMaster</span>
            )}
          </div>
          <button className="md:hidden p-2 text-gray-400 hover:bg-gray-100 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-6 mt-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handlePageChange(item.id)}
                className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-[#2D5AF0] text-white shadow-xl shadow-blue-100' 
                    : 'text-[#8E94BB] hover:bg-blue-50 hover:text-[#2D5AF0]'
                }`}
              >
                <item.icon size={22} className={`shrink-0 ${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                {(isSidebarOpen || isMobileMenuOpen) && (
                  <span className="font-bold text-[15px] whitespace-nowrap animate-in fade-in slide-in-from-left-1">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-6 space-y-3">
          <button 
            onClick={() => {
              onRoleSwitch(activeRole === 'ADMIN' ? 'STUDENT' : 'ADMIN');
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-4 w-full p-4 text-[#8E94BB] hover:bg-gray-100 rounded-2xl transition-all font-bold"
          >
            <UserCircle size={22} className="shrink-0" />
            {(isSidebarOpen || isMobileMenuOpen) && <span className="text-[14px]">Modo {activeRole === 'ADMIN' ? 'Estudiante' : 'Admin'}</span>}
          </button>
          <button className="flex items-center gap-4 w-full p-4 text-[#FF4D4D] hover:bg-red-50 rounded-2xl transition-all font-bold">
            <LogOut size={22} className="shrink-0" />
            {(isSidebarOpen || isMobileMenuOpen) && <span className="text-[14px]">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="h-24 bg-transparent flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              className="p-3 bg-white shadow-sm rounded-2xl text-gray-500 hover:text-[#2D5AF0] transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-[#001A72] leading-none">
                {menuItems.find(m => m.id === currentPage)?.label || 'Dashboard'}
              </h1>
              <p className="hidden md:block text-[12px] font-bold text-[#8E94BB] uppercase tracking-widest mt-1.5">Gestión de Aprendizaje Inteligente</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-5">
            <div className="text-right hidden sm:block">
              <p className="text-[15px] font-black text-[#001A72] leading-tight">
                {activeRole === 'ADMIN' ? 'Administrador' : 'Estudiante'}
              </p>
              <p className="text-[10px] font-black text-[#2D5AF0] uppercase tracking-wider">Perfil Activo</p>
            </div>
            <div className="p-1 bg-white rounded-2xl shadow-sm border-2 border-white cursor-pointer hover:scale-105 transition-transform" onClick={() => setCurrentPage('settings')}>
              <img 
                src={`https://ui-avatars.com/api/?name=${activeRole === 'ADMIN' ? 'Admin' : 'Student'}&background=2D5AF0&color=fff&bold=true`} 
                alt="User" 
                className="w-10 h-10 md:w-12 md:h-12 rounded-[1rem] object-cover"
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-2 scroll-smooth no-scrollbar">
          <div className="max-w-[1400px] mx-auto pb-20">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;

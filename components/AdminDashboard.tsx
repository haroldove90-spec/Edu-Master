
import React from 'react';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Course, Enrollment, Session } from '../types';

interface AdminDashboardProps {
  courses: Course[];
  sessions: Session[];
  enrollments: Enrollment[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ courses, sessions, enrollments }) => {
  const stats = [
    { label: 'Cursos Activos', value: courses.filter(c => c.status === 'active').length, icon: BookOpen, color: '#2D5AF0', bg: 'bg-blue-50' },
    { label: 'Total Inscritos', value: enrollments.length, icon: Users, color: '#9333EA', bg: 'bg-purple-50' },
    { label: 'Ocupación Media', value: '78%', icon: TrendingUp, color: '#059669', bg: 'bg-green-50' },
    { label: 'Nuevas Reservas', value: 12, icon: Clock, color: '#D97706', bg: 'bg-orange-50' },
  ];

  const chartData = courses.map(course => {
    const courseSessions = sessions.filter(s => s.courseId === course.id);
    const totalCap = courseSessions.reduce((acc, s) => acc + s.capacity, 0);
    const totalEnrolled = courseSessions.reduce((acc, s) => acc + s.enrolledCount, 0);
    return {
      name: course.title.substring(0, 12),
      enrolled: totalEnrolled,
      available: totalCap - totalEnrolled
    };
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#2D5AF0] to-[#001A72] rounded-[3rem] p-12 text-white shadow-2xl shadow-blue-200 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-3">¡Bienvenido de nuevo!</h2>
          <p className="text-blue-100 text-lg font-medium opacity-80">Tu plataforma educativa ha crecido un 12% este mes.</p>
        </div>
        <button className="relative z-10 bg-white text-[#2D5AF0] px-8 py-5 rounded-[1.5rem] font-black shadow-xl hover:scale-105 transition-transform flex items-center gap-3">
          Ver Reportes
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className={`${stat.bg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <stat.icon size={28} style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-sm font-black text-[#8E94BB] uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-4xl font-black text-[#001A72]">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-white relative">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-[#001A72] mb-1">Rendimiento de Cursos</h3>
              <p className="text-sm font-bold text-[#8E94BB]">Comparativa de ocupación y vacantes</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#2D5AF0]"></div>
                <span className="text-xs font-black text-[#8E94BB] uppercase">Inscritos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-100"></div>
                <span className="text-xs font-black text-[#8E94BB] uppercase">Vacantes</span>
              </div>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F2F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#8E94BB', fontWeight: 800, fontSize: 10 }}
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#8E94BB', fontWeight: 800, fontSize: 10 }}
                />
                <Tooltip 
                  cursor={{fill: '#F5F7FF', radius: 20}}
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: 'none', 
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)',
                    padding: '16px'
                  }}
                  itemStyle={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '10px' }}
                />
                <Bar dataKey="enrolled" stackId="a" fill="#2D5AF0" radius={[0, 0, 0, 0]} barSize={50} />
                <Bar dataKey="available" stackId="a" fill="#F0F2F9" radius={[15, 15, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Enrollments */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-white">
          <h3 className="text-2xl font-black text-[#001A72] mb-8">Nuevos Alumnos</h3>
          <div className="space-y-6">
            {enrollments.slice(0, 5).map((enrollment) => {
              const session = sessions.find(s => s.id === enrollment.sessionId);
              const course = courses.find(c => c.id === session?.courseId);
              return (
                <div key={enrollment.id} className="flex items-center gap-4 group cursor-pointer">
                  <div className="relative">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${enrollment.studentName}&background=F5F7FF&color=2D5AF0&bold=true`} 
                      className="w-14 h-14 rounded-2xl group-hover:scale-105 transition-transform border border-gray-50 shadow-sm"
                      alt=""
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-[#001A72] truncate">{enrollment.studentName}</p>
                    <p className="text-[11px] font-bold text-[#8E94BB] truncate uppercase tracking-wider">{course?.title}</p>
                  </div>
                  <div className="shrink-0">
                    <span className="p-2 bg-blue-50 text-[#2D5AF0] rounded-xl block">
                      <CheckCircle2 size={16} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="w-full mt-12 py-5 text-sm font-black text-[#2D5AF0] bg-blue-50/50 hover:bg-blue-50 rounded-[1.5rem] transition-all uppercase tracking-widest">
            Historial Completo
          </button>
        </div>
      </div>

      {/* Course Alerts */}
      <div className="bg-[#FFF4F4] p-10 rounded-[3rem] border border-red-100/50">
        <h3 className="text-2xl font-black text-[#FF4D4D] mb-8 flex items-center gap-4">
          <AlertCircle size={28} />
          Acciones Necesarias
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sessions.filter(s => s.enrolledCount / s.capacity > 0.8).map(session => {
            const course = courses.find(c => c.id === session.courseId);
            const percent = Math.round((session.enrolledCount / session.capacity) * 100);
            return (
              <div key={session.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-red-50 relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FF4D4D]"></div>
                <p className="font-black text-[#001A72] mb-4">{course?.title}</p>
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest mb-3">
                  <span className="text-[#FF4D4D]">{percent}% Completo</span>
                  <span className="text-[#8E94BB]">{session.capacity - session.enrolledCount} Libres</span>
                </div>
                <div className="w-full bg-gray-50 h-3 rounded-full overflow-hidden">
                  <div className="bg-[#FF4D4D] h-full group-hover:scale-x-105 transition-transform origin-left" style={{ width: `${percent}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

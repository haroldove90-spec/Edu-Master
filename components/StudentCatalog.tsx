
import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Check, 
  Users,
  X,
  Plus
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday, startOfWeek, endOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { Course, Session, Enrollment } from '../types';

interface StudentCatalogProps {
  courses: Course[];
  sessions: Session[];
  enrollments: Enrollment[];
  onEnroll: (session: Session) => void;
}

const StudentCatalog: React.FC<StudentCatalogProps> = ({ courses, sessions, enrollments, onEnroll }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDay, setSelectedDay] = React.useState<Date | null>(new Date());
  const [viewingCourse, setViewingCourse] = React.useState<Course | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(monthStart, { weekStartsOn: 0 }),
    end: endOfWeek(monthEnd, { weekStartsOn: 0 }),
  });

  const getDaySessions = (day: Date) => {
    return sessions.filter(s => isSameDay(s.startDate, day));
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const selectedDaySessions = selectedDay ? getDaySessions(selectedDay) : [];

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-700">
      {/* Calendar Section */}
      <div className="flex-1 space-y-8">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 p-8 border border-white/50 relative overflow-hidden">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2D5AF0 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-6">
                <h2 className="text-3xl font-black text-[#001A72] flex items-center gap-4">
                  <span className="opacity-20">{format(currentDate, 'yyyy')}</span>
                  <span className="capitalize">{format(currentDate, 'MMMM', { locale: es })}</span>
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="p-3 hover:bg-blue-50 text-[#2D5AF0] rounded-2xl transition-all">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={nextMonth} className="p-3 hover:bg-blue-50 text-[#2D5AF0] rounded-2xl transition-all">
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 mb-6">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-[11px] font-black text-[#8E94BB] uppercase tracking-[0.2em] py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-2">
              {daysInMonth.map((day, idx) => {
                const daySessions = getDaySessions(day);
                const isSelected = selectedDay && isSameDay(day, selectedDay);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isTodayDate = isToday(day);

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDay(day)}
                    className={`h-20 md:h-24 flex flex-col items-center justify-center rounded-[1.5rem] transition-all duration-300 relative group ${
                      !isCurrentMonth ? 'opacity-20 grayscale' : ''
                    } ${isSelected ? 'bg-[#2D5AF0] text-white shadow-2xl shadow-blue-300 scale-105 z-10' : 'hover:bg-blue-50 text-[#001A72]'}`}
                  >
                    <span className={`text-lg font-black mb-1 ${isSelected ? 'text-white' : ''}`}>
                      {format(day, 'd')}
                    </span>
                    
                    {daySessions.length > 0 && !isSelected && (
                      <div className="flex gap-1 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#2D5AF0]"></div>
                        {daySessions.length > 1 && <div className="w-1.5 h-1.5 rounded-full bg-[#2D5AF0] opacity-40"></div>}
                      </div>
                    )}

                    {isTodayDate && !isSelected && (
                      <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#FF4D4D]"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Day View - Cards Style from Screen 1 */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-xl font-black text-[#001A72]">Próximos Cursos</h3>
            <span className="text-xs font-black text-[#8E94BB] uppercase tracking-widest">{selectedDay ? format(selectedDay, "d 'de' MMMM", { locale: es }) : ''}</span>
          </div>

          <div className="space-y-4">
            {selectedDaySessions.length > 0 ? (
              selectedDaySessions.map(session => {
                const course = courses.find(c => c.id === session.courseId);
                const isFull = session.enrolledCount >= session.capacity;

                return (
                  <div key={session.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-white hover:shadow-xl transition-all duration-500 group relative overflow-hidden flex items-center justify-between">
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#2D5AF0]"></div>
                    
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-[#F5F7FF] flex items-center justify-center p-0.5 overflow-hidden">
                        <img src={course?.image} alt="" className="w-full h-full object-cover rounded-xl" />
                      </div>
                      <div>
                        <h4 className="font-black text-lg text-[#001A72]">{course?.title}</h4>
                        <div className="flex items-center gap-4 mt-1.5">
                          <span className="text-[12px] font-bold text-[#8E94BB] flex items-center gap-1.5">
                            <Clock size={14} className="text-[#2D5AF0]" /> {format(session.startDate, 'hh:mm a')}
                          </span>
                          <span className="text-[12px] font-bold text-[#8E94BB] flex items-center gap-1.5">
                            <Users size={14} className="text-[#2D5AF0]" /> {session.enrolledCount}/{session.capacity} inscritos
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right mr-4">
                        <p className="text-[10px] font-black text-[#8E94BB] uppercase tracking-wider">Inversión</p>
                        <p className="text-2xl font-black text-[#2D5AF0]">${course?.price}</p>
                      </div>
                      <button 
                        onClick={() => !isFull && onEnroll(session)}
                        disabled={isFull}
                        className={`p-4 rounded-2xl transition-all ${
                          isFull 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-[#2D5AF0] text-white hover:bg-[#001A72] shadow-lg shadow-blue-100'
                        }`}
                      >
                        <Plus size={24} />
                      </button>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="bg-white/40 border border-dashed border-[#8E94BB]/30 p-12 rounded-[2.5rem] text-center">
                <p className="font-bold text-[#8E94BB]">No hay sesiones programadas para hoy.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Side Promotion Area - Modern Screen 4 Look */}
      <div className="lg:w-96 shrink-0 space-y-8">
        <div className="bg-[#2D5AF0] rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-200 relative overflow-hidden min-h-[400px] flex flex-col justify-between">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-900/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <p className="text-[12px] font-black uppercase tracking-[0.3em] opacity-60 mb-4">Destacado de la Semana</p>
            <h3 className="text-4xl font-black leading-tight mb-6">Impulsa tu carrera creativa hoy.</h3>
            <p className="text-[#F5F7FF] text-lg font-medium opacity-80 leading-relaxed mb-8">
              Aprovecha nuestras masterclasses con expertos de la industria. Cupos limitados para este mes.
            </p>
          </div>

          <button className="relative z-10 w-full bg-white text-[#2D5AF0] py-5 rounded-3xl font-black text-lg shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-3 group">
            Explorar Catálogo
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Quick Stats Sidebar */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white">
          <h4 className="font-black text-[#001A72] mb-6">Tu Actividad</h4>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                <Check size={20} />
              </div>
              <div>
                <p className="text-sm font-black text-[#001A72]">4 Cursos Terminados</p>
                <p className="text-xs font-bold text-[#8E94BB]">Este año</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <CalendarIcon size={20} />
              </div>
              <div>
                <p className="text-sm font-black text-[#001A72]">2 Próximas Clases</p>
                <p className="text-xs font-bold text-[#8E94BB]">En los próximos 7 días</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Detail Modal (Keep existing logic but update styling) */}
      {viewingCourse && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in zoom-in duration-300 overflow-y-auto">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl my-auto overflow-hidden shadow-2xl">
            <div className="h-64 relative">
              <img src={viewingCourse.image} alt={viewingCourse.title} className="w-full h-full object-cover" />
              <button 
                onClick={() => setViewingCourse(null)}
                className="absolute top-6 right-6 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all shadow-xl"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-blue-50 text-[#2D5AF0] px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest">
                  Curso Certificado
                </span>
                <span className="bg-gray-50 text-gray-500 px-4 py-1.5 rounded-full text-[11px] font-black">
                  {viewingCourse.duration}
                </span>
              </div>
              <h3 className="text-3xl font-black text-[#001A72] mb-6">{viewingCourse.title}</h3>
              <p className="text-[#8E94BB] text-lg font-medium leading-relaxed mb-10">
                {viewingCourse.description}
              </p>
              
              <div className="flex items-center justify-between border-t border-gray-100 pt-8">
                <div>
                  <p className="text-[11px] text-[#8E94BB] font-black uppercase tracking-[0.2em] mb-1">Inversión</p>
                  <p className="text-4xl font-black text-[#2D5AF0]">${viewingCourse.price}</p>
                </div>
                <button 
                  onClick={() => setViewingCourse(null)}
                  className="bg-[#001A72] text-white px-10 py-5 rounded-3xl font-black text-lg shadow-xl shadow-blue-900/10"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCatalog;

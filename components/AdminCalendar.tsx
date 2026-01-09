
import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Clock,
  LayoutGrid,
  List
} from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths, 
  isToday, 
  startOfWeek, 
  endOfWeek 
} from 'date-fns';
import { es } from 'date-fns/locale';
import { Course, Session } from '../types';

interface AdminCalendarProps {
  courses: Course[];
  sessions: Session[];
  onAddSession: () => void;
}

const AdminCalendar: React.FC<AdminCalendarProps> = ({ courses, sessions, onAddSession }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-black capitalize flex items-center gap-4 text-[#001A72]">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </h2>
            <p className="text-[#8E94BB] text-sm font-bold uppercase tracking-widest mt-1">Gestión de horarios y disponibilidad</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-3 hover:bg-blue-50 text-[#2D5AF0] rounded-2xl transition-all border border-transparent hover:border-blue-100">
                <ChevronLeft size={24} />
              </button>
              <button onClick={nextMonth} className="p-3 hover:bg-blue-50 text-[#2D5AF0] rounded-2xl transition-all border border-transparent hover:border-blue-100">
                <ChevronRight size={24} />
              </button>
            </div>
            <button 
              onClick={onAddSession}
              className="bg-[#2D5AF0] hover:bg-[#001A72] text-white px-8 py-4 rounded-[1.5rem] font-black text-sm transition-all shadow-xl shadow-blue-100"
            >
              Programar Curso
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 mb-6">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="text-center text-[11px] font-black text-[#8E94BB] uppercase tracking-[0.2em] py-4">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-3">
          {daysInMonth.map((day, idx) => {
            const daySessions = getDaySessions(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isTodayDate = isToday(day);

            return (
              <div
                key={idx}
                className={`min-h-[140px] p-4 rounded-3xl border transition-all flex flex-col gap-3 group ${
                  !isCurrentMonth ? 'bg-gray-50/30 border-transparent opacity-20' : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-lg'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-lg font-black w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
                    isTodayDate ? 'bg-[#FF4D4D] text-white shadow-lg shadow-red-100' : 'text-[#001A72]'
                  }`}>
                    {format(day, 'd')}
                  </span>
                </div>
                
                <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
                  {daySessions.map(session => {
                    const course = courses.find(c => c.id === session.courseId);
                    
                    return (
                      <div 
                        key={session.id} 
                        className={`text-[10px] font-black p-3 rounded-2xl border flex flex-col gap-1 transition-all hover:scale-[1.02] bg-[#F5F7FF] text-[#2D5AF0] border-blue-50`}
                      >
                        <div className="truncate uppercase tracking-tight">{course?.title}</div>
                        <div className="flex items-center justify-between opacity-60">
                          <span className="flex items-center gap-1"><Clock size={10}/> {format(session.startDate, 'HH:mm')}</span>
                          <span className="flex items-center gap-1"><Users size={10}/> {session.enrolledCount}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-8 p-6 bg-[#F5F7FF] rounded-[2rem]">
          <p className="text-[11px] font-black text-[#8E94BB] uppercase tracking-[0.2em]">Leyenda de Ocupación:</p>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-white border-2 border-blue-100 rounded-lg"></div>
            <span className="text-[11px] font-black text-[#001A72] uppercase tracking-wider">Disponible</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-[#FF4D4D] rounded-lg"></div>
            <span className="text-[11px] font-black text-[#001A72] uppercase tracking-wider">Hoy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCalendar;

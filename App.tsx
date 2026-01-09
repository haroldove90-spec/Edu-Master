
import React, { useState, useEffect } from 'react';
import { Role, Course, Session, Enrollment } from './types';
import { INITIAL_COURSES, INITIAL_SESSIONS, INITIAL_ENROLLMENTS } from './constants';
import { supabase, isDbConnected } from './supabase';
import Layout from './components/Layout';
import AdminDashboard from './components/AdminDashboard';
import AdminCourses from './components/AdminCourses';
import AdminCalendar from './components/AdminCalendar';
import StudentCatalog from './components/StudentCatalog';
import EnrollmentForm from './components/EnrollmentForm';
import Profile from './components/Profile';
import { CheckCircle2, Search, User, Mail, Calendar, Trash2, X, Clock } from 'lucide-react';

const App: React.FC = () => {
  const [role, setRole] = useState<Role>('ADMIN');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(INITIAL_ENROLLMENTS);
  const [loading, setLoading] = useState(false);
  
  const [userData, setUserData] = useState({
    name: 'Usuario EduMaster',
    email: 'usuario@tritex.com.mx',
    phone: '55 1234 5678',
    avatar: '',
    bio: 'Pasión por el aprendizaje continuo.'
  });
  
  const [enrollingSession, setEnrollingSession] = useState<Session | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [newSessionData, setNewSessionData] = useState({
    courseId: '',
    startDate: '',
    startTime: '',
    capacity: 20
  });

  // Lógica de carga desde Supabase
  useEffect(() => {
    const fetchData = async () => {
      if (!isDbConnected()) return;
      
      setLoading(true);
      try {
        const { data: dbCourses } = await supabase!.from('courses').select('*');
        const { data: dbSessions } = await supabase!.from('sessions').select('*');
        const { data: dbEnrollments } = await supabase!.from('enrollments').select('*');

        if (dbCourses) setCourses(dbCourses);
        if (dbSessions) {
          const formattedSessions = dbSessions.map(s => ({
            ...s,
            startDate: new Date(s.start_date),
            endDate: new Date(s.end_date)
          }));
          setSessions(formattedSessions);
        }
        if (dbEnrollments) setEnrollments(dbEnrollments);
      } catch (error) {
        console.error("Error cargando de Supabase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (role === 'ADMIN') {
      if (!['dashboard', 'courses', 'calendar', 'students', 'settings'].includes(currentPage)) {
        setCurrentPage('dashboard');
      }
    } else {
      if (!['explorer', 'my-enrollments', 'settings'].includes(currentPage)) {
        setCurrentPage('explorer');
      }
    }
  }, [role]);

  const handleEnrollment = async (formData: any) => {
    if (!enrollingSession) return;
    
    const newEnrollmentData = {
      session_id: enrollingSession.id,
      student_name: formData.name,
      student_email: formData.email,
      student_phone: formData.phone,
      status: 'confirmed'
    };

    // Intentar guardar en Supabase si está disponible
    if (isDbConnected()) {
      const { error } = await supabase!.from('enrollments').insert([newEnrollmentData]);
      if (error) {
        alert("Error al guardar en la base de datos.");
        return;
      }
    }

    // Actualización local para feedback inmediato
    const newEnrollment: Enrollment = {
      id: `e${Date.now()}`,
      sessionId: enrollingSession.id,
      studentName: formData.name,
      studentEmail: formData.email,
      studentPhone: formData.phone,
      enrollmentDate: new Date(),
      status: 'confirmed'
    };
    
    setEnrollments(prev => [newEnrollment, ...prev]);
    setSessions(prev => prev.map(s => 
      s.id === enrollingSession.id 
        ? { ...s, enrolledCount: s.enrolledCount + 1 } 
        : s
    ));
    
    setEnrollingSession(null);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 5000);
  };

  const addCourse = async (courseData: Partial<Course>) => {
    if (isDbConnected()) {
      const { data, error } = await supabase!.from('courses').insert([courseData]).select();
      if (!error && data) {
        setCourses(prev => [...data, ...prev]);
        return;
      }
    }
    // Fallback local
    const newC: Course = { ...courseData as Course, id: Date.now().toString() };
    setCourses(prev => [newC, ...prev]);
  };

  const handleScheduleSession = async (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date(`${newSessionData.startDate}T${newSessionData.startTime}`);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

    if (isDbConnected()) {
      const { error } = await supabase!.from('sessions').insert([{
        course_id: newSessionData.courseId,
        start_date: start.toISOString(),
        end_date: end.toISOString(),
        capacity: newSessionData.capacity
      }]);
      if (error) {
        alert("Error al programar sesión.");
        return;
      }
    }

    const newS: Session = {
      id: `s-${Date.now()}`,
      courseId: newSessionData.courseId,
      startDate: start,
      endDate: end,
      capacity: newSessionData.capacity,
      enrolledCount: 0
    };

    setSessions(prev => [...prev, newS]);
    setIsScheduling(false);
  };

  const deleteCourse = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este curso?')) {
      if (isDbConnected()) {
        const { error } = await supabase!.from('courses').delete().eq('id', id);
        if (error) {
          alert("Error al eliminar de la base de datos.");
          return;
        }
      }
      setCourses(prev => prev.filter(c => c.id !== id));
      setSessions(prev => prev.filter(s => s.courseId !== id));
    }
  };

  const renderContent = () => {
    if (currentPage === 'settings') {
      return <Profile role={role} userData={userData} onUpdate={setUserData} />;
    }

    if (role === 'ADMIN') {
      switch (currentPage) {
        case 'dashboard':
          return <AdminDashboard courses={courses} sessions={sessions} enrollments={enrollments} />;
        case 'courses':
          return <AdminCourses courses={courses} onAddCourse={addCourse} onDeleteCourse={deleteCourse} />;
        case 'calendar':
          return <AdminCalendar courses={courses} sessions={sessions} onAddSession={() => setIsScheduling(true)} />;
        case 'students':
          return (
            <div className="space-y-6 animate-in fade-in duration-500">
               <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                   <div>
                     <h2 className="text-2xl font-black text-[#001A72]">Directorio de Estudiantes</h2>
                     <p className="text-gray-500 text-sm font-bold">Control de inscripciones y actividad</p>
                   </div>
                   <div className="relative w-full md:w-64">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                     <input 
                       type="text" 
                       placeholder="Buscar alumno..." 
                       className="w-full pl-10 pr-4 py-2.5 bg-gray-100 text-black border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold placeholder:text-gray-500 shadow-sm" 
                     />
                   </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {enrollments.map(e => {
                     const session = sessions.find(s => s.id === e.sessionId);
                     const course = courses.find(c => c.id === session?.courseId);
                     return (
                       <div key={e.id} className="p-6 bg-white border border-gray-100 rounded-[2rem] hover:shadow-lg transition-all group">
                         <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center font-black text-blue-600 text-xl overflow-hidden shadow-inner">
                              {/* @ts-ignore */}
                              {e.studentAvatar ? <img src={e.studentAvatar} className="w-full h-full object-cover" /> : e.studentName[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-black text-[#001A72] leading-tight truncate">{e.studentName}</p>
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 font-bold truncate"><Mail size={12} /> {e.studentEmail}</p>
                            </div>
                         </div>
                         <div className="space-y-3 p-4 bg-gray-50 rounded-2xl">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Curso Inscrito</p>
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-[#2D5AF0]" />
                              <p className="text-xs font-bold text-gray-800 truncate">{course?.title}</p>
                            </div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase">Fecha: {e.enrollmentDate?.toLocaleDateString() || 'N/A'}</p>
                         </div>
                       </div>
                     );
                   })}
                 </div>
               </div>
            </div>
          );
        default: return null;
      }
    } else {
      switch (currentPage) {
        case 'explorer':
          return <StudentCatalog courses={courses} sessions={sessions} enrollments={enrollments} onEnroll={setEnrollingSession} />;
        case 'my-enrollments':
          return (
            <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-8 px-2">
                <div>
                  <h2 className="text-2xl font-black text-[#001A72]">Mis Inscripciones</h2>
                  <p className="text-gray-500 text-sm font-bold">Gestiona tus clases y material de estudio</p>
                </div>
                <div className="bg-blue-50 text-[#2D5AF0] px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
                  Total: {enrollments.length}
                </div>
              </div>
              <div className="space-y-4">
                {enrollments.map(e => {
                   const session = sessions.find(s => s.id === e.sessionId);
                   const course = courses.find(c => c.id === session?.courseId);
                   return (
                     <div key={e.id} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center gap-5 group hover:border-blue-200 transition-all">
                        <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden shrink-0">
                          <img src={course?.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <h3 className="font-black text-xl text-[#001A72]">{course?.title}</h3>
                           <div className="flex flex-wrap gap-4 mt-3">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                                <Calendar size={14} className="text-[#2D5AF0]" /> {session?.startDate.toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                                <User size={14} className="text-[#2D5AF0]" /> {course?.instructor}
                              </div>
                           </div>
                           <div className="mt-4 flex gap-2">
                             <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black rounded-lg uppercase tracking-wider">Confirmado</span>
                             <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase tracking-wider">Acceso al Aula</span>
                           </div>
                        </div>
                        <button className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all self-end md:self-center">
                          <Trash2 size={20} />
                        </button>
                     </div>
                   );
                })}
              </div>
            </div>
          );
        default: return null;
      }
    }
  };

  return (
    <Layout activeRole={role} onRoleSwitch={setRole} currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="w-16 h-16 border-4 border-[#2D5AF0] border-t-transparent rounded-full animate-spin"></div>
          <p className="font-black text-[#001A72] animate-pulse">Sincronizando con la nube...</p>
        </div>
      ) : renderContent()}
      
      {/* Modal para Programar Curso (Admin) */}
      {isScheduling && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
            <div className="p-8 md:p-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-[#001A72]">Programar Sesión</h3>
                <button onClick={() => setIsScheduling(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleScheduleSession} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Seleccionar Curso</label>
                  <select 
                    required
                    className="w-full px-4 py-4 bg-gray-100 text-black border border-gray-200 rounded-2xl focus:bg-white outline-none font-bold"
                    value={newSessionData.courseId}
                    onChange={(e) => setNewSessionData({...newSessionData, courseId: e.target.value})}
                  >
                    <option value="">Elegir un curso...</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Fecha</label>
                    <input 
                      required
                      type="date"
                      className="w-full px-4 py-4 bg-gray-100 text-black border border-gray-200 rounded-2xl outline-none font-bold"
                      value={newSessionData.startDate}
                      onChange={(e) => setNewSessionData({...newSessionData, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Hora de Inicio</label>
                    <input 
                      required
                      type="time"
                      className="w-full px-4 py-4 bg-gray-100 text-black border border-gray-200 rounded-2xl outline-none font-bold"
                      value={newSessionData.startTime}
                      onChange={(e) => setNewSessionData({...newSessionData, startTime: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Capacidad Máxima</label>
                  <input 
                    required
                    type="number"
                    min="1"
                    className="w-full px-4 py-4 bg-gray-100 text-black border border-gray-200 rounded-2xl outline-none font-bold"
                    value={newSessionData.capacity}
                    onChange={(e) => setNewSessionData({...newSessionData, capacity: Number(e.target.value)})}
                  />
                </div>

                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsScheduling(false)}
                    className="flex-1 py-5 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                  >
                    Cerrar
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-5 bg-[#2D5AF0] text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-[#001A72] transition-all"
                  >
                    Confirmar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {enrollingSession && (
        <EnrollmentForm 
          session={enrollingSession}
          course={courses.find(c => c.id === enrollingSession.courseId)!}
          onSubmit={handleEnrollment}
          onCancel={() => setEnrollingSession(null)}
        />
      )}
      
      {showConfirmation && (
        <div className="fixed bottom-10 right-4 md:right-10 z-[200] bg-white border-l-[10px] border-green-500 shadow-2xl p-6 rounded-[2rem] flex items-center gap-4 animate-in slide-in-from-right-10 duration-500">
          <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0 shadow-sm">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <h4 className="font-black text-[#001A72] text-lg">¡Lugar Reservado!</h4>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wide">Confirmación enviada con éxito</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;

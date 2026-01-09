
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Eye,
  CheckCircle2,
  XCircle,
  X,
  Image as ImageIcon,
  DollarSign,
  Clock
} from 'lucide-react';
import { Course } from '../types';

interface AdminCoursesProps {
  courses: Course[];
  onAddCourse: (course: Partial<Course>) => void;
  onDeleteCourse: (id: string) => void;
}

const AdminCourses: React.FC<AdminCoursesProps> = ({ courses, onAddCourse, onDeleteCourse }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    title: '',
    description: '',
    instructor: '',
    price: 0,
    duration: '',
    image: '',
    status: 'active'
  });

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCourse({ ...newCourse, id: Date.now().toString() });
    setIsModalOpen(false);
    setNewCourse({ title: '', description: '', instructor: '', price: 0, duration: '', image: '', status: 'active' });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
          <input 
            type="text" 
            placeholder="Buscar cursos..." 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 text-black border border-gray-300 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold placeholder:text-gray-500 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-100"
        >
          <Plus size={20} />
          Nuevo Curso
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                <th className="px-6 py-5">Curso</th>
                <th className="px-6 py-5">Instructor</th>
                <th className="px-6 py-5">Precio</th>
                <th className="px-6 py-5">Estado</th>
                <th className="px-6 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={course.image || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200'} className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                      <div>
                        <p className="font-bold text-gray-900 leading-tight">{course.title}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{course.duration}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-700">{course.instructor}</td>
                  <td className="px-6 py-4 font-black text-blue-600">${course.price}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      course.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {course.status === 'active' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {course.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => onDeleteCourse(course.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
            <div className="p-8 md:p-12 overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-black">Crear Nuevo Curso</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Título del Curso</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-4 py-3 bg-gray-100 text-black border border-gray-200 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold placeholder:text-gray-400"
                        placeholder="Ej: Master en React"
                        value={newCourse.title}
                        onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Instructor</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-4 py-3 bg-gray-100 text-black border border-gray-200 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold placeholder:text-gray-400"
                        placeholder="Nombre del docente"
                        value={newCourse.instructor}
                        onChange={(e) => setNewCourse({...newCourse, instructor: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Precio ($)</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                          <input 
                            required
                            type="number" 
                            className="w-full pl-10 pr-4 py-3 bg-gray-100 text-black border border-gray-200 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-black placeholder:text-gray-400"
                            value={newCourse.price}
                            onChange={(e) => setNewCourse({...newCourse, price: Number(e.target.value)})}
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Duración</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                          <input 
                            required
                            type="text" 
                            className="w-full pl-10 pr-4 py-3 bg-gray-100 text-black border border-gray-200 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold placeholder:text-gray-400"
                            placeholder="Ej: 20h"
                            value={newCourse.duration}
                            onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">URL Imagen (Unsplash/Web)</label>
                      <div className="relative">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                        <input 
                          required
                          type="url" 
                          className="w-full pl-10 pr-4 py-3 bg-gray-100 text-black border border-gray-200 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold placeholder:text-gray-400"
                          placeholder="https://..."
                          value={newCourse.image}
                          onChange={(e) => setNewCourse({...newCourse, image: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Descripción Corta</label>
                  <textarea 
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-100 text-black border border-gray-200 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all resize-none font-bold placeholder:text-gray-400"
                    placeholder="Describe los beneficios del curso..."
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-300 transition-all"
                  >
                    Descartar
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
                  >
                    Crear Curso Ahora
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;

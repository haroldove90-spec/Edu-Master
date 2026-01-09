
import React from 'react';
import { Mail, User, Phone, CheckCircle2, ArrowRight } from 'lucide-react';
import { Session, Course } from '../types';

interface EnrollmentFormProps {
  session: Session;
  course: Course;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ session, course, onSubmit, onCancel }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    terms: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.terms) return;
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in zoom-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 overflow-hidden">
              <img src={course.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-black">{course.title}</h3>
              <p className="text-blue-600 font-bold text-sm">Reserva de Plaza</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input 
                  required
                  type="text" 
                  placeholder="Nombre y Apellidos" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-100 text-black border border-gray-200 rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none font-bold placeholder:text-gray-500"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input 
                  required
                  type="email" 
                  placeholder="Correo Electrónico" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-100 text-black border border-gray-200 rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none font-bold placeholder:text-gray-500"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input 
                  required
                  type="tel" 
                  placeholder="Teléfono de Contacto" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-100 text-black border border-gray-200 rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none font-bold placeholder:text-gray-500"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center mt-1">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={formData.terms}
                  onChange={(e) => setFormData({...formData, terms: e.target.checked})}
                />
                <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${
                  formData.terms ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'
                }`}>
                  {formData.terms && <CheckCircle2 className="text-white" size={14} />}
                </div>
              </div>
              <span className="text-xs font-bold text-gray-600 leading-normal">
                Acepto los <a href="#" className="text-blue-600 font-black hover:underline">términos y condiciones</a> de la academia y la política de privacidad.
              </span>
            </label>

            <div className="flex gap-3 pt-4">
              <button 
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-4 rounded-2xl font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="flex-[2] px-4 py-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2 group"
              >
                Confirmar Reserva
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentForm;

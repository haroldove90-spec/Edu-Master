
import React, { useState, useRef } from 'react';
import { User, Mail, Phone, Camera, Save, RefreshCw, X } from 'lucide-react';
import { Role } from '../types';

interface ProfileProps {
  role: Role;
  userData: any;
  onUpdate: (data: any) => void;
}

const Profile: React.FC<ProfileProps> = ({ role, userData, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userData);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("No se pudo acceder a la cámara.");
      setShowCamera(false);
    }
  };

  const takeSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL('image/png');
        setFormData({ ...formData, avatar: imageData });
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <div className="px-8 pb-8">
          <div className="relative -mt-16 flex items-end justify-between">
            <div className="relative group">
              <img 
                src={formData.avatar || `https://ui-avatars.com/api/?name=${formData.name}&background=random`} 
                className="w-32 h-32 rounded-3xl border-4 border-white object-cover bg-white shadow-lg"
                alt="Profile"
              />
              <button 
                onClick={startCamera}
                className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all scale-0 group-hover:scale-100"
              >
                <Camera size={18} />
              </button>
            </div>
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm ${
                isEditing ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {isEditing ? <Save size={18} /> : <RefreshCw size={18} />}
              {isEditing ? 'Guardar Cambios' : 'Editar Perfil'}
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 text-black border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all disabled:opacity-60 font-black"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                  <input 
                    type="email" 
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 text-black border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all disabled:opacity-60 font-black"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                  <input 
                    type="tel" 
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 text-black border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all disabled:opacity-60 font-black"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Biografía / Rol</label>
                <textarea 
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-100 text-black border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all disabled:opacity-60 resize-none font-bold"
                  value={formData.bio || (role === 'ADMIN' ? 'Administrador de EduMaster' : 'Estudiante apasionado')}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCamera && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-lg aspect-video bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform -scale-x-100" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute inset-0 border-[40px] border-black/30 pointer-events-none rounded-3xl"></div>
          </div>
          <div className="flex gap-4 mt-8">
            <button 
              onClick={stopCamera}
              className="p-4 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all"
            >
              <X size={24} />
            </button>
            <button 
              onClick={takeSelfie}
              className="p-6 bg-blue-600 text-white rounded-full shadow-xl shadow-blue-500/50 hover:bg-blue-700 transition-all hover:scale-105"
            >
              <Camera size={32} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

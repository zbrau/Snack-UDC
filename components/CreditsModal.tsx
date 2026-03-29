import React from 'react';
import { X, Github, Code, Sparkles } from 'lucide-react';

interface CreditsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreditsModal: React.FC<CreditsModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal Content */}
            <div 
                className="relative z-10 w-full max-w-sm bg-white dark:bg-[#1e2330] rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-scale-in"
                onClick={e => e.stopPropagation()}
            >
                {/* Decorative header background */}
                <div className="h-24 bg-gradient-to-br from-gray-900 to-black dark:from-[#0f1218] dark:to-black relative">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                </div>

                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
                >
                    <X size={16} />
                </button>

                <div className="px-6 pb-8 pt-0 text-center relative">
                    {/* Avatar Icon Overlay */}
                    <div className="w-20 h-20 bg-[#18181b] rounded-2xl border-4 border-white dark:border-[#1e2330] shadow-lg flex items-center justify-center text-white mx-auto -mt-10 mb-4 transform rotate-3 hover:rotate-0 transition-transform">
                        <Code size={32} />
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
                        <Sparkles size={12} /> Creador de la App
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Braulio</h2>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-6">Desarrollador Principal</p>

                    <div className="space-y-3">
                        <a 
                            href="https://github.com/zbrau" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 bg-[#18181b] hover:bg-[#27272a] text-white py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                            <Github size={20} />
                            Ver otros proyectos en GitHub
                        </a>
                        <button 
                            onClick={onClose}
                            className="w-full py-3.5 rounded-xl font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreditsModal;


import React, { useState, useEffect, useCallback } from 'react';
import { X, Coins, ArrowLeft, QrCode, Copy, Check, Clock, History } from 'lucide-react';

const PRESET_AMOUNTS = [20, 50, 100, 200, 500];
const MIN_UC = 10;
const MAX_UC = 1000;
const CODE_DURATION_SECONDS = 15 * 60; // 15 minutes
const LS_KEY = 'apera_last_recharge';

interface RechargeModalProps {
    showRechargeModal: boolean;
    setShowRechargeModal: (show: boolean) => void;
    rechargeStep: 'SELECT_AMOUNT' | 'SHOW_CODE';
    setRechargeStep: (step: 'SELECT_AMOUNT' | 'SHOW_CODE') => void;
    selectedRechargeAmount: number;
    handleSelectAmount: (amount: number) => void;
    customRechargeInput: string;
    setCustomRechargeInput: (input: string) => void;
    handleFinishRecharge: () => void;
    rechargeCode: string;
}

const RechargeModal: React.FC<RechargeModalProps> = ({
    showRechargeModal,
    setShowRechargeModal,
    rechargeStep,
    setRechargeStep,
    selectedRechargeAmount,
    handleSelectAmount,
    customRechargeInput,
    setCustomRechargeInput,
    handleFinishRecharge,
    rechargeCode
}) => {
    // --- Copy to clipboard ---
    const [copied, setCopied] = useState(false);

    // --- Countdown timer ---
    const [timeLeft, setTimeLeft] = useState(CODE_DURATION_SECONDS);

    // --- Custom amount validation ---
    const [validationError, setValidationError] = useState<string | null>(null);

    // --- Last recharge from localStorage ---
    const [lastRecharge, setLastRecharge] = useState<{ amount: number; date: string } | null>(null);

    // ---- Load last recharge from localStorage on mount ----
    useEffect(() => {
        try {
            const stored = localStorage.getItem(LS_KEY);
            if (stored) setLastRecharge(JSON.parse(stored));
        } catch (_) { }
    }, [showRechargeModal]);

    // ---- Save recharge to localStorage when code is shown ----
    useEffect(() => {
        if (rechargeStep === 'SHOW_CODE' && selectedRechargeAmount > 0) {
            const record = { amount: selectedRechargeAmount, date: new Date().toISOString() };
            try { localStorage.setItem(LS_KEY, JSON.stringify(record)); } catch (_) { }
            // Reset timer every time we enter SHOW_CODE
            setTimeLeft(CODE_DURATION_SECONDS);
        }
    }, [rechargeStep, selectedRechargeAmount]);

    // ---- Countdown ticker ----
    useEffect(() => {
        if (rechargeStep !== 'SHOW_CODE' || !showRechargeModal) return;
        if (timeLeft <= 0) return;
        const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(id);
    }, [rechargeStep, showRechargeModal, timeLeft]);

    // ---- Reset copied state after 2s ----
    useEffect(() => {
        if (!copied) return;
        const id = setTimeout(() => setCopied(false), 2000);
        return () => clearTimeout(id);
    }, [copied]);

    // ---- Format seconds to MM:SS ----
    const formatTime = (s: number) => {
        const m = Math.floor(s / 60).toString().padStart(2, '0');
        const sec = (s % 60).toString().padStart(2, '0');
        return `${m}:${sec}`;
    };

    // ---- Copy handler ----
    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(rechargeCode).then(() => setCopied(true));
    }, [rechargeCode]);

    // ---- Custom amount validation ----
    const handleCustomChange = (val: string) => {
        setCustomRechargeInput(val);
        if (val === '' || val === '0') { setValidationError(null); return; }
        const n = Math.floor(parseFloat(val));
        if (isNaN(n) || n < MIN_UC) setValidationError(`El mínimo es ${MIN_UC} UC`);
        else if (n > MAX_UC) setValidationError(`El máximo es ${MAX_UC} UC`);
        else setValidationError(null);
    };

    // ---- Generate custom amount ----
    const handleGenerateCustom = () => {
        const val = Math.floor(parseFloat(customRechargeInput));
        if (!isNaN(val) && val >= MIN_UC && val <= MAX_UC) handleSelectAmount(val);
    };

    // ---- Relative time for last recharge ----
    const relativeTime = (dateStr: string) => {
        const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
        if (diff < 60) return 'hace un momento';
        if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
        if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
        return `hace ${Math.floor(diff / 86400)} día(s)`;
    };

    // ---- Countdown color ----
    const countdownColor = timeLeft > 300 ? 'text-green-400' : timeLeft > 60 ? 'text-yellow-400' : 'text-red-400';

    if (!showRechargeModal) return null;

    const customVal = customRechargeInput && !isNaN(parseFloat(customRechargeInput))
        ? Math.floor(parseFloat(customRechargeInput))
        : null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowRechargeModal(false)} />
            <div className="bg-[#1e2330] rounded-3xl p-6 w-full max-w-sm relative z-10 shadow-2xl animate-scale-in border border-gray-700/50 text-white overflow-hidden">
                <button onClick={() => setShowRechargeModal(false)} className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white transition-colors z-50"><X size={24} /></button>

                {rechargeStep === 'SELECT_AMOUNT' ? (
                    <div className="flex flex-col items-center space-y-5 animate-fade-in pt-4">
                        {/* Header */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 bg-green-900/30 rounded-full flex items-center justify-center border border-green-500/20">
                                <Coins className="w-7 h-7 text-green-500" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-white">Elige la cantidad</h3>
                                <p className="text-xs text-gray-400 mt-1">¿Cuántos Ucol Coins quieres recargar hoy?</p>
                            </div>
                        </div>

                        {/* Last recharge banner */}
                        {lastRecharge && (
                            <div className="w-full flex items-center gap-2 bg-gray-800/60 border border-gray-700 rounded-xl px-3 py-2">
                                <History size={14} className="text-gray-400 shrink-0" />
                                <p className="text-[11px] text-gray-400">
                                    Última recarga: <span className="text-white font-bold">{lastRecharge.amount} UC</span>
                                    <span className="ml-1 text-gray-500">{relativeTime(lastRecharge.date)}</span>
                                </p>
                            </div>
                        )}

                        {/* Preset amounts 2x2 */}
                        <div className="grid grid-cols-2 gap-3 w-full">
                            {PRESET_AMOUNTS.slice(0, 4).map(amount => (
                                <button
                                    key={amount}
                                    onClick={() => handleSelectAmount(amount)}
                                    className={`bg-[#2a3040] hover:bg-[#323a4d] border rounded-xl py-4 px-2 flex flex-col items-center gap-1 transition-all group
                                        ${selectedRechargeAmount === amount
                                            ? 'border-green-500 ring-1 ring-green-500/40 bg-[#1a3028]'
                                            : 'border-gray-700 hover:border-green-500/50'
                                        }`}
                                >
                                    <span className="text-green-500 font-bold text-lg group-hover:scale-105 transition-transform">{amount} UC</span>
                                    <span className="text-[10px] text-gray-400 font-medium">${amount}.00 MXN</span>
                                </button>
                            ))}
                        </div>

                        {/* 500 UC full-width */}
                        <button
                            onClick={() => handleSelectAmount(500)}
                            className={`w-full bg-[#2a3040] hover:bg-[#323a4d] border rounded-xl py-4 flex flex-row items-center justify-center gap-3 transition-all group
                                ${selectedRechargeAmount === 500
                                    ? 'border-green-500 ring-1 ring-green-500/40 bg-[#1a3028]'
                                    : 'border-gray-700 hover:border-green-500/50'
                                }`}
                        >
                            <span className="text-green-500 font-bold text-lg group-hover:scale-105 transition-transform">500 UC</span>
                            <span className="text-xs text-gray-400 font-medium">($500.00 MXN)</span>
                        </button>

                        {/* Custom amount */}
                        <div className="w-full border-t border-gray-700 pt-4 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-400">Monto Personalizado</span>
                                <span className="text-[10px] bg-gray-700 px-2 py-0.5 rounded text-gray-300">1 MXN = 1 UC</span>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">UC</span>
                                    <input
                                        type="number"
                                        value={customRechargeInput}
                                        onChange={(e) => handleCustomChange(e.target.value)}
                                        placeholder="0"
                                        min={MIN_UC}
                                        max={MAX_UC}
                                        className={`w-full bg-[#2a3040] border rounded-lg pl-10 pr-3 py-2.5 text-sm font-bold text-white focus:outline-none transition-colors
                                            ${validationError ? 'border-red-500/70 focus:border-red-400' : 'border-gray-600 focus:border-green-500/50'}`}
                                    />
                                </div>
                                <button
                                    onClick={handleGenerateCustom}
                                    disabled={!customRechargeInput || !!validationError}
                                    className="bg-gray-600 hover:bg-gray-500 disabled:opacity-50 text-white px-5 rounded-lg font-bold text-sm transition-colors"
                                >
                                    Generar
                                </button>
                            </div>

                            {/* Real-time converter */}
                            {customVal !== null && customVal > 0 && !validationError && (
                                <p className="text-[11px] text-green-400 font-medium animate-fade-in">
                                    = <span className="font-bold">${customVal}.00 MXN</span> — pagarás en caja
                                </p>
                            )}

                            {/* Validation error */}
                            {validationError && (
                                <p className="text-[11px] text-red-400 font-medium animate-fade-in">
                                    ⚠ {validationError}
                                </p>
                            )}

                            <p className="text-[10px] text-gray-600">Mínimo {MIN_UC} UC · Máximo {MAX_UC} UC</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-5 animate-slide-up pt-4">
                        <button onClick={() => setRechargeStep('SELECT_AMOUNT')} className="absolute top-4 left-4 p-1 text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft size={20} />
                        </button>

                        {/* Header */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 bg-green-900/30 rounded-full flex items-center justify-center border border-green-500/20">
                                <QrCode className="w-7 h-7 text-green-500" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-white">Código de Recarga</h3>
                                <p className="text-xs text-gray-400 mt-1 max-w-[200px]">Muestra este código en la <span className="font-bold text-white">Dirección Escolar</span>.</p>
                            </div>
                        </div>

                        {/* Countdown */}
                        <div className={`flex items-center gap-2 text-xs font-semibold ${countdownColor}`}>
                            <Clock size={13} />
                            <span>
                                {timeLeft > 0
                                    ? <>Expira en <span className="font-mono font-bold">{formatTime(timeLeft)}</span></>
                                    : 'Código expirado — genera uno nuevo'}
                            </span>
                        </div>

                        <div className="w-full space-y-4">
                            {/* Amount */}
                            <div className="bg-[#153e24]/40 border border-green-800/50 rounded-xl p-4 text-center">
                                <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-1">Monto a Pagar</p>
                                <p className="text-3xl font-bold text-green-500">${selectedRechargeAmount}.00</p>
                                <p className="text-[10px] text-green-700 mt-0.5">{selectedRechargeAmount} UC Coins</p>
                            </div>

                            {/* Code + copy button */}
                            <div className="bg-[#232936] border-2 border-dashed border-gray-600 rounded-xl p-5 text-center relative">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Código</p>
                                <p className="text-xl font-mono font-bold text-white tracking-wider">{rechargeCode}</p>
                                <button
                                    onClick={handleCopy}
                                    className={`absolute top-3 right-3 p-1.5 rounded-lg transition-all
                                        ${copied ? 'bg-green-900/50 text-green-400' : 'bg-gray-700 text-gray-400 hover:text-white hover:bg-gray-600'}`}
                                    title="Copiar código"
                                >
                                    {copied ? <Check size={15} /> : <Copy size={15} />}
                                </button>
                                {copied && (
                                    <p className="text-[10px] text-green-400 mt-2 animate-fade-in">¡Copiado al portapapeles!</p>
                                )}
                            </div>

                            <p className="text-[10px] text-center text-gray-500">
                                Tu saldo se actualizará en cuanto pagues.
                            </p>
                        </div>

                        <button
                            onClick={handleFinishRecharge}
                            className="w-full bg-black hover:bg-gray-900 text-white font-bold py-3.5 rounded-xl border border-gray-800 transition-all active:scale-95 shadow-lg"
                        >
                            Listo, Entendido
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RechargeModal;

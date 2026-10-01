import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Camera, 
  CheckCircle2, 
  Sparkles, 
  X, 
  Fingerprint, 
  UserCheck, 
  FileText,
  ScanLine
} from 'lucide-react';

interface KYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: { licenseNumber: string; expiryDate: string; kycId: string }) => void;
  initialLicenseNumber?: string;
}

type KYCStep = 'SELECT_DOC' | 'UPLOAD' | 'SCANNING' | 'VERIFIED';

export const KYCModal: React.FC<KYCModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialLicenseNumber = 'SN-DKR-2021-08492'
}) => {
  const [step, setStep] = useState<KYCStep>('SELECT_DOC');
  const [docType, setDocType] = useState<'LICENSE' | 'PASSPORT'>('LICENSE');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusText, setScanStatusText] = useState('Initialisation de la passerelle biométrique...');

  if (!isOpen) return null;

  const startScanningProcess = () => {
    setStep('SCANNING');
    setScanProgress(15);
    setScanStatusText('Analyse des hologrammes et des micro-impressions...');

    setTimeout(() => {
      setScanProgress(45);
      setScanStatusText('Extraction OCR des données et numéro de permis...');
    }, 900);

    setTimeout(() => {
      setScanProgress(75);
      setScanStatusText('Vérification faciale biométrique (Liveness test 99.4%)...');
    }, 1800);

    setTimeout(() => {
      setScanProgress(100);
      setScanStatusText('Certification validée avec succès.');
      setStep('VERIFIED');
    }, 2700);
  };

  const handleFinish = () => {
    onSuccess({
      licenseNumber: initialLicenseNumber || 'SN-DKR-2021-08492',
      expiryDate: '2029-12-31',
      kycId: 'KYC-SN-83910-B'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="bg-[#0C1019] border border-white/[0.08] w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-32 bg-[#B89B5F]/15 blur-3xl pointer-events-none rounded-full" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/[0.05] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#B89B5F]/15 border border-[#B89B5F]/30 flex items-center justify-center text-[#D8C59A]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">Vérification Biométrique KYC</h2>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#B89B5F]/20 text-[#D8C59A] font-extrabold uppercase border border-[#B89B5F]/30">
                Standard Mondial
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Dématérialisation complète de votre contrat sans attente au guichet
            </p>
          </div>
        </div>

        {/* STEP 1: SELECT DOC */}
        {step === 'SELECT_DOC' && (
          <div className="space-y-6">
            <p className="text-xs text-slate-300 leading-relaxed">
              Sélectionnez le document officiel que vous souhaitez certifier par intelligence artificielle. Cette procédure est 100% chiffrée selon les normes de protection des données (RGPD & CDP Sénégal).
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setDocType('LICENSE')}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  docType === 'LICENSE'
                    ? 'bg-[#B89B5F]/15 border-[#B89B5F] text-white shadow-lg'
                    : 'bg-[#07090E] border-white/[0.06] text-slate-400 hover:border-white/[0.15]'
                }`}
              >
                <FileText className="w-6 h-6 mb-2 text-[#D8C59A]" />
                <h4 className="text-xs font-bold text-white">Permis de Conduire</h4>
                <p className="text-[10px] text-slate-400 mt-1">Sénégalais ou International (CEDEAO / UE)</p>
              </div>

              <div
                onClick={() => setDocType('PASSPORT')}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  docType === 'PASSPORT'
                    ? 'bg-[#B89B5F]/15 border-[#B89B5F] text-white shadow-lg'
                    : 'bg-[#07090E] border-white/[0.06] text-slate-400 hover:border-white/[0.15]'
                }`}
              >
                <Fingerprint className="w-6 h-6 mb-2 text-[#D8C59A]" />
                <h4 className="text-xs font-bold text-white">Passeport / CNI</h4>
                <p className="text-[10px] text-slate-400 mt-1">Pièce d'identité nationale biométrique</p>
              </div>
            </div>

            <div className="bg-[#07090E] rounded-2xl p-4 border border-white/[0.06] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Numéro du permis détecté</p>
                <p className="text-[11px] font-mono text-[#D8C59A]">{initialLicenseNumber}</p>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full font-bold">
                Éligible
              </span>
            </div>

            <button
              onClick={() => setStep('UPLOAD')}
              className="btn-luxe-primary w-full py-3.5 rounded-2xl text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-2"
            >
              <span>Continuer vers la capture</span>
              <ScanLine className="w-4 h-4 text-black" />
            </button>
          </div>
        )}

        {/* STEP 2: UPLOAD / CAMERA SIMULATION */}
        {step === 'UPLOAD' && (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-[#B89B5F]/40 rounded-3xl p-6 bg-[#07090E]/60 text-center relative overflow-hidden group">
              <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mx-auto mb-3 text-[#D8C59A]">
                <Camera className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Positionnez votre document</h4>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Placez le recto de votre permis de conduire dans le cadre pour la capture automatique HD
              </p>

              {/* Animated Target Lines */}
              <div className="mt-4 mx-auto w-64 h-36 rounded-xl border border-[#B89B5F]/50 bg-black/40 flex items-center justify-center relative overflow-hidden shadow-inner">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#B89B5F]/10 to-transparent animate-pulse" />
                <span className="text-[10px] font-mono text-[#D8C59A] uppercase tracking-wider">
                  [ Alignement Document OK ]
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('SELECT_DOC')}
                className="w-1/3 py-3 rounded-2xl border border-white/[0.08] text-xs font-bold text-slate-400 hover:text-white transition"
              >
                Retour
              </button>
              <button
                onClick={startScanningProcess}
                className="btn-luxe-primary w-2/3 py-3 rounded-2xl text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>Lancer la vérification IA</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SCANNING IN PROGRESS */}
        {step === 'SCANNING' && (
          <div className="space-y-6 py-6 text-center">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-white/[0.05] border-t-[#B89B5F] animate-spin" />
              <div className="absolute inset-2 rounded-full bg-[#07090E] flex items-center justify-center text-[#D8C59A]">
                <ScanLine className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            <div>
              <h3 className="text-base font-black text-white">Analyse Algorithmique en Cours</h3>
              <p className="text-xs text-[#D8C59A] font-medium mt-1 font-mono">{scanStatusText}</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#07090E] rounded-full h-2 overflow-hidden border border-white/[0.06]">
              <div 
                className="bg-gradient-to-r from-[#B89B5F] to-[#D8C59A] h-full transition-all duration-700 ease-out"
                style={{ width: `${scanProgress}%` }}
              />
            </div>

            <div className="text-[11px] text-slate-500 font-mono">
              Chiffrement AES-256 • Détection anti-usurpation active
            </div>
          </div>
        )}

        {/* STEP 4: VERIFIED BADGE */}
        {step === 'VERIFIED' && (
          <div className="space-y-6 text-center py-2 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-widest mb-2">
                Certification Réussie
              </div>
              <h3 className="text-xl font-black text-white">Conducteur Agréé & Certifié</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1">
                Votre identité et permis de conduire ont été validés avec succès. Votre contrat sera pré-rempli et validé sans attente.
              </p>
            </div>

            {/* Verification Certificate Island */}
            <div className="bg-[#07090E] rounded-2xl p-4 border border-white/[0.08] text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Identifiant de certification :</span>
                <span className="font-mono font-bold text-[#D8C59A]">KYC-SN-83910-B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Permis validé :</span>
                <span className="font-mono text-white font-semibold">{initialLicenseNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Horodatage de certification :</span>
                <span className="text-slate-300">{new Date().toLocaleString('fr-FR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Statut du contrat :</span>
                <span className="text-emerald-400 font-bold">100% Prêt pour remise sans contact</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="btn-luxe-primary w-full py-3.5 rounded-2xl text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-2"
            >
              <span>Appliquer au contrat officiel</span>
              <UserCheck className="w-4 h-4 text-black" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Phone, MapPin, CreditCard, Shield, Lock,
  Save, Eye, EyeOff, CheckCircle, AlertCircle,
  Car, Star, ArrowLeft, Camera, Edit3
} from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

type Tab = 'info' | 'kyc' | 'security' | 'stats';

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8 caractères minimum', ok: password.length >= 8 },
    { label: 'Une majuscule', ok: /[A-Z]/.test(password) },
    { label: 'Un chiffre', ok: /[0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ['bg-red-500', 'bg-yellow-500', 'bg-green-500'];
  const labels = ['Faible', 'Moyen', 'Fort'];
  if (!password) return null;
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < score ? colors[score - 1] : 'bg-gray-200'}`} />
        ))}
      </div>
      <p className={`text-xs ${score === 3 ? 'text-green-600' : score === 2 ? 'text-yellow-600' : 'text-red-500'}`}>
        Force : {labels[score - 1] || 'Insuffisant'}
      </p>
      <ul className="space-y-0.5">
        {checks.map(c => (
          <li key={c.label} className={`text-xs flex items-center gap-1 ${c.ok ? 'text-green-600' : 'text-gray-400'}`}>
            <CheckCircle className={`w-3 h-3 flex-shrink-0 ${c.ok ? 'text-green-500' : 'text-gray-300'}`} />
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [infoForm, setInfoForm] = useState({ name: '', phone: '', address: '', city: '', country: 'Sénégal' });
  const [kycForm, setKycForm] = useState({ licenseNumber: '', licenseExpiry: '', licenseCountry: 'Sénégal' });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await api.getProfile();
      setProfile(data);
      setInfoForm({
        name: data.name || '',
        phone: data.phone || '',
        address: data.customer?.address || '',
        city: data.customer?.city || '',
        country: data.customer?.country || 'Sénégal',
      });
      setKycForm({
        licenseNumber: data.customer?.licenseNumber || '',
        licenseExpiry: data.customer?.licenseExpiry || '',
        licenseCountry: data.customer?.licenseCountry || 'Sénégal',
      });
    } catch {
      showMsg('error', 'Impossible de charger le profil.');
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleSaveInfo = async () => {
    try {
      setSaving(true);
      const result = await api.updateProfile(infoForm);
      setProfile((p: any) => ({ ...p, ...result.user }));
      if (user) setUser({ ...user, name: infoForm.name, phone: infoForm.phone });
      showMsg('success', 'Profil mis à jour avec succès !');
    } catch (e: any) {
      showMsg('error', e.message || 'Erreur lors de la mise à jour.');
    } finally { setSaving(false); }
  };

  const handleSaveKyc = async () => {
    try {
      setSaving(true);
      await api.updateProfile(kycForm);
      showMsg('success', 'Informations de permis enregistrées !');
    } catch (e: any) {
      showMsg('error', e.message || 'Erreur lors de l\'enregistrement.');
    } finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      showMsg('error', 'Les mots de passe ne correspondent pas.');
      return;
    }
    try {
      setSaving(true);
      await api.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showMsg('success', 'Mot de passe modifié avec succès !');
    } catch (e: any) {
      showMsg('error', e.message || 'Mot de passe actuel incorrect.');
    } finally { setSaving(false); }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showMsg('error', 'Fichier trop grand (max 5 Mo).'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const b64 = ev.target?.result as string;
      setPhotoPreview(b64);
    };
    reader.readAsDataURL(file);
  };

  const isLicenseExpiringSoon = () => {
    if (!kycForm.licenseExpiry) return false;
    const expiry = new Date(kycForm.licenseExpiry);
    const soon = new Date(); soon.setMonth(soon.getMonth() + 3);
    return expiry < soon;
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'info', label: 'Informations', icon: <User className="w-4 h-4" /> },
    { id: 'kyc', label: 'Permis & KYC', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'security', label: 'Sécurité', icon: <Shield className="w-4 h-4" /> },
    { id: 'stats', label: 'Statistiques', icon: <Star className="w-4 h-4" /> },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500" />
    </div>
  );

  const reservations = profile?.customer?.reservations || [];
  const totalSpent = reservations.reduce((s: number, r: any) => s + (r.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-yellow-600 flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Accueil</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">Mon Profil</span>
        </div>

        {/* Carte profil */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 mb-6 text-white shadow-xl">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-yellow-500 flex items-center justify-center text-3xl font-bold shadow-lg">
                {(profile?.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profile?.name}</h1>
              <p className="text-gray-400 text-sm">{profile?.email}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="bg-yellow-500/20 text-yellow-400 text-xs px-3 py-1 rounded-full border border-yellow-500/30 font-medium">
                  {profile?.role === 'ADMIN' ? '👑 Administrateur' : '🚗 Client Hertz'}
                </span>
                <span className="text-gray-400 text-xs">
                  Membre depuis {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : '—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div className={`mb-4 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-all ${activeTab === tab.id ? 'text-yellow-600 border-b-2 border-yellow-500 bg-yellow-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
                {tab.icon}<span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Informations */}
            {activeTab === 'info' && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><Edit3 className="w-5 h-5 text-yellow-500" />Informations personnelles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" value={infoForm.name} onChange={e => setInfoForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent" placeholder="Votre nom complet" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={profile?.email || ''} disabled className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
                    <p className="text-xs text-gray-400 mt-1">L'email ne peut pas être modifié.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="tel" value={infoForm.phone} onChange={e => setInfoForm(f => ({ ...f, phone: e.target.value }))}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent" placeholder="+221 77 000 00 00" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" value={infoForm.city} onChange={e => setInfoForm(f => ({ ...f, city: e.target.value }))}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent" placeholder="Dakar" />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                    <input type="text" value={infoForm.address} onChange={e => setInfoForm(f => ({ ...f, address: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent" placeholder="Votre adresse complète" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                    <select value={infoForm.country} onChange={e => setInfoForm(f => ({ ...f, country: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent">
                      {['Sénégal','France','Côte d\'Ivoire','Mali','Guinée','Gambie','Autre'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={handleSaveInfo} disabled={saving} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-all disabled:opacity-50">
                    <Save className="w-4 h-4" />{saving ? 'Sauvegarde...' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            )}

            {/* KYC */}
            {activeTab === 'kyc' && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><CreditCard className="w-5 h-5 text-yellow-500" />Permis de conduire & Vérification KYC</h2>
                {profile?.customer
                  ? <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 rounded-xl text-sm"><CheckCircle className="w-4 h-4 flex-shrink-0" /><span>Profil KYC enregistré — Statut : <strong>Vérifié ✓</strong></span></div>
                  : <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2.5 rounded-xl text-sm"><AlertCircle className="w-4 h-4 flex-shrink-0" /><span>Complétez vos informations KYC pour accéder à toutes les fonctionnalités.</span></div>
                }
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de permis</label>
                    <input type="text" value={kycForm.licenseNumber} onChange={e => setKycForm(f => ({ ...f, licenseNumber: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent" placeholder="SN-XXXXXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
                    <input type="date" value={kycForm.licenseExpiry} onChange={e => setKycForm(f => ({ ...f, licenseExpiry: e.target.value }))}
                      className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${isLicenseExpiringSoon() ? 'border-orange-400 bg-orange-50' : 'border-gray-300'}`} />
                    {isLicenseExpiringSoon() && <p className="text-xs text-orange-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />Votre permis expire bientôt. Pensez à le renouveler.</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pays d'émission</label>
                    <select value={kycForm.licenseCountry} onChange={e => setKycForm(f => ({ ...f, licenseCountry: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent">
                      {['Sénégal','France','Côte d\'Ivoire','Mali','Guinée','Gambie','Union Européenne','Autre'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photo du permis (optionnel)</label>
                  <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-yellow-400 hover:bg-yellow-50 transition-all">
                    {photoPreview
                      ? <img src={photoPreview} alt="Permis" className="max-h-40 mx-auto rounded-lg object-contain" />
                      : <div className="space-y-2"><Camera className="w-10 h-10 text-gray-400 mx-auto" /><p className="text-sm text-gray-500">Cliquez pour ajouter une photo du permis</p><p className="text-xs text-gray-400">JPG, PNG — max 5 Mo</p></div>
                    }
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={handleSaveKyc} disabled={saving} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-all disabled:opacity-50">
                    <Save className="w-4 h-4" />{saving ? 'Enregistrement...' : 'Enregistrer le permis'}
                  </button>
                </div>
              </div>
            )}

            {/* Sécurité */}
            {activeTab === 'security' && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><Lock className="w-5 h-5 text-yellow-500" />Sécurité du compte</h2>
                <div className="space-y-4">
                  {([
                    { key: 'currentPassword', label: 'Mot de passe actuel', show: showPw.current, toggle: () => setShowPw(s => ({ ...s, current: !s.current })) },
                    { key: 'newPassword', label: 'Nouveau mot de passe', show: showPw.new, toggle: () => setShowPw(s => ({ ...s, new: !s.new })) },
                    { key: 'confirmPassword', label: 'Confirmer le nouveau mot de passe', show: showPw.confirm, toggle: () => setShowPw(s => ({ ...s, confirm: !s.confirm })) },
                  ] as any[]).map(field => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type={field.show ? 'text' : 'password'} value={(pwForm as any)[field.key]} onChange={e => setPwForm(f => ({ ...f, [field.key]: e.target.value }))}
                          className="w-full pl-9 pr-12 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent" placeholder="••••••••" />
                        <button onClick={field.toggle} type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {field.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {field.key === 'newPassword' && <PasswordStrength password={pwForm.newPassword} />}
                      {field.key === 'confirmPassword' && pwForm.confirmPassword && (
                        <p className={`text-xs mt-1 ${pwForm.newPassword === pwForm.confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                          {pwForm.newPassword === pwForm.confirmPassword ? '✓ Les mots de passe correspondent' : '✗ Les mots de passe ne correspondent pas'}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={handleChangePassword} disabled={saving || !pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all disabled:opacity-50">
                    <Shield className="w-4 h-4" />{saving ? 'Modification...' : 'Changer le mot de passe'}
                  </button>
                </div>
              </div>
            )}

            {/* Statistiques */}
            {activeTab === 'stats' && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500" />Mes statistiques & activité</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Réservations', value: reservations.length, icon: <Car className="w-5 h-5" />, color: 'bg-blue-50 text-blue-700' },
                    { label: 'Total dépensé', value: `${totalSpent.toLocaleString('fr-FR')} FCFA`, icon: <CreditCard className="w-5 h-5" />, color: 'bg-green-50 text-green-700' },
                    { label: 'Statut KYC', value: profile?.customer ? 'Vérifié ✓' : 'En attente', icon: <Shield className="w-5 h-5" />, color: profile?.customer ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700' },
                    { label: 'Fidélité', value: reservations.length >= 5 ? '🏆 Gold' : reservations.length >= 2 ? '🥈 Silver' : '🎖 Standard', icon: <Star className="w-5 h-5" />, color: 'bg-yellow-50 text-yellow-700' },
                  ].map(stat => (
                    <div key={stat.label} className={`rounded-xl p-4 ${stat.color}`}>
                      <div className="flex items-center gap-2 mb-1">{stat.icon}<span className="text-xs font-medium">{stat.label}</span></div>
                      <p className="text-lg font-bold">{stat.value}</p>
                    </div>
                  ))}
                </div>
                {reservations.length > 0 ? (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Dernières réservations</h3>
                    <div className="space-y-3">
                      {reservations.map((r: any) => (
                        <div key={r.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-3 border border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-yellow-100 rounded-lg flex items-center justify-center"><Car className="w-5 h-5 text-yellow-600" /></div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">{r.vehicle?.brand} {r.vehicle?.model}</p>
                              <p className="text-xs text-gray-400">{r.reference} · {new Date(r.createdAt).toLocaleDateString('fr-FR')}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-800">{r.totalAmount?.toLocaleString('fr-FR')} FCFA</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.status === 'PAID' ? 'bg-green-100 text-green-700' : r.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{r.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-400">
                    <Car className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Aucune réservation pour le moment.</p>
                    <Link to="/vehicles" className="mt-3 inline-block text-sm text-yellow-600 hover:underline">Découvrir nos véhicules →</Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

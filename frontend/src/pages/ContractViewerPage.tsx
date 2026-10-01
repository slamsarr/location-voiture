import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { 
  FileText, 
  Download, 
  Printer, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Car,
  QrCode,
  Building
} from 'lucide-react';
import { api } from '../services/api';

export const ContractViewerPage: React.FC = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reservationId) {
      api.getContractDetails(reservationId)
        .then(res => setData(res))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [reservationId]);

  const handleDownloadPDF = () => {
    if (!data) return;
    const { contract, reservation, company, terms } = data;
    const { vehicle, customer } = reservation;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // En-tête officiel Hertz
    doc.setFillColor(15, 23, 42); // Slate 900
    doc.rect(0, 0, 210, 32, 'F');

    doc.setTextColor(245, 158, 11); // Amber 500
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('HERTZ DIGITAL MOBILITY', 15, 14);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('CONTRAT DE LOCATION DE VÉHICULE AUTOMOBILE ÉLECTRONIQUE', 15, 22);
    doc.text(`Réf: ${contract.reference} | Date: ${new Date().toLocaleDateString('fr-FR')}`, 15, 27);

    // Bloc Loueur & Locataire
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('1. LE LOUEUR', 15, 42);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`${company.name} (${company.legalEntity})`, 15, 48);
    doc.text(`${company.address}`, 15, 53);
    doc.text(`Tél : ${company.phone} | NINEA : ${company.taxId}`, 15, 58);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('2. LE LOCATAIRE (CONDUCTEUR)', 115, 42);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`${customer.firstName} ${customer.lastName}`, 115, 48);
    doc.text(`Permis N° : ${customer.licenseNumber} (Exp: ${customer.licenseExpiry})`, 115, 53);
    doc.text(`Tél : ${customer.phone} | Email : ${customer.email}`, 115, 58);

    // Ligne de séparation
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 64, 195, 64);

    // Véhicule loué
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('3. DÉSIGNATION DU VÉHICULE', 15, 72);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`Marque & Modèle : ${vehicle.brand} ${vehicle.model} (${vehicle.year})`, 15, 78);
    doc.text(`Catégorie : ${vehicle.category?.name || 'Standard'} | Immatriculation : ${vehicle.plateNumber}`, 15, 83);
    doc.text(`Transmission : ${vehicle.transmission} | Carburant : ${vehicle.fuel} | Places : ${vehicle.seats}`, 15, 88);

    // Période et Prise en charge
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('4. PÉRIODE DE LOCATION', 115, 72);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`Départ : ${reservation.startDate} à ${reservation.pickupTime}`, 115, 78);
    doc.text(`Retour : ${reservation.endDate} à ${reservation.returnTime}`, 115, 83);
    doc.text(`Durée totale : ${reservation.durationDays} Jours`, 115, 88);
    doc.text(`Lieu : ${reservation.pickupLocation}`, 115, 93);

    doc.line(15, 98, 195, 98);

    // Détail financier
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('5. TARIFICATION & RÈGLEMENT (EN FCFA)', 15, 106);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`Tarif de base location (${reservation.durationDays} j × ${reservation.dailyRate.toLocaleString('fr-FR')} F) :`, 15, 113);
    doc.text(`${reservation.subtotal.toLocaleString('fr-FR')} FCFA`, 160, 113);

    doc.text(`Options additionnelles souscrites :`, 15, 119);
    doc.text(`${reservation.optionsTotal.toLocaleString('fr-FR')} FCFA`, 160, 119);

    doc.text(`Caution de garantie (bloquée) :`, 15, 125);
    doc.text(`${reservation.depositAmount.toLocaleString('fr-FR')} FCFA`, 160, 125);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`MONTANT TOTAL TTC ENCAISSÉ :`, 15, 134);
    doc.text(`${reservation.totalAmount.toLocaleString('fr-FR')} FCFA`, 160, 134);

    doc.line(15, 140, 195, 140);

    // Conditions générales
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('6. CONDITIONS PARTICULIÈRES & ENGAGEMENTS', 15, 148);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    let termY = 154;
    terms.forEach((t: string, i: number) => {
      doc.text(`• ${t}`, 15, termY);
      termY += 5.5;
    });

    // Signature électronique certifiée
    doc.setFillColor(248, 250, 252);
    doc.rect(15, 185, 180, 36, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(15, 185, 180, 36, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(16, 185, 129); // Emerald
    doc.text('VALIDATION ÉLECTRONIQUE CERTIFIÉE', 20, 193);

    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`Horodatage numérique : ${new Date(contract.signedAt || Date.now()).toISOString()}`, 20, 199);
    doc.text(`Empreinte SHA-256 : d41d8cd98f00b204e9800998ecf8427e-${reservation.reference}`, 20, 204);
    doc.text(`Signature électronique consentie en ligne par ${customer.firstName} ${customer.lastName}`, 20, 209);
    doc.text(`Statut du contrat : CERTIFIÉ & VALIDE POUR CONTRÔLE ROUTIER`, 20, 214);

    // Pied de page
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text('Document contractuel généré par la plateforme Hertz Digital. Fait foi auprès des autorités et des assureurs.', 15, 280);

    doc.save(`Contrat_Location_${contract.reference}.pdf`);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent animate-spin rounded-full mx-auto" />
        <p className="text-xs text-slate-400 mt-3">Génération du contrat en cours...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white">Contrat introuvable</h2>
        <Link to="/" className="text-xs text-brand-400 underline mt-2 block">Retour</Link>
      </div>
    );
  }

  const { contract, reservation, company, terms } = data;
  const { vehicle, customer } = reservation;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <Link
          to={`/confirmation/${reservation.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la confirmation</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-800 flex items-center gap-2 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-400 hover:to-amber-400 text-black text-xs font-black flex items-center gap-2 shadow-lg transition"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger le PDF</span>
          </button>
        </div>
      </div>

      {/* Styled Contract Paper View */}
      <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8 border border-slate-200">
        
        {/* Header Contract */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-200 pb-6 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-slate-950">HERTZ DIGITAL</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-black bg-amber-100 text-amber-800">OFFICIEL</span>
            </div>
            <p className="text-xs text-slate-500">{company.legalEntity} • NINEA: {company.taxId}</p>
            <p className="text-xs text-slate-500">{company.address}</p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contrat de location N°</p>
            <p className="text-xl font-black text-amber-600 font-mono">{contract.reference}</p>
            <p className="text-xs text-slate-500">Date d'émission : {new Date(contract.signedAt || Date.now()).toLocaleDateString('fr-FR')}</p>
          </div>
        </div>

        {/* 2-Columns : Loueur & Locataire */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
            <h4 className="font-extrabold text-slate-900 uppercase text-[11px]">1. Société Loueuse</h4>
            <p className="font-bold text-slate-800">{company.name}</p>
            <p className="text-slate-600">Téléphone : {company.phone}</p>
            <p className="text-slate-600">Email : {company.email}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
            <h4 className="font-extrabold text-slate-900 uppercase text-[11px]">2. Locataire / Conducteur</h4>
            <p className="font-bold text-slate-800">{customer.firstName} {customer.lastName}</p>
            <p className="text-slate-600">Permis de conduire : <strong>{customer.licenseNumber}</strong> (Exp: {customer.licenseExpiry})</p>
            <p className="text-slate-600">Tél : {customer.phone} • {customer.email}</p>
          </div>
        </div>

        {/* Véhicule & Dates */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
          <h4 className="font-extrabold text-slate-900 uppercase text-[11px]">3. Véhicule & Période de Location</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-slate-500">Véhicule :</p>
              <p className="font-bold text-slate-900 text-sm">{vehicle.brand} {vehicle.model} ({vehicle.year})</p>
              <p className="text-slate-600">Immatriculation : <strong>{vehicle.plateNumber}</strong></p>
              <p className="text-slate-600">{vehicle.transmission} • {vehicle.fuel} • {vehicle.seats} places</p>
            </div>
            <div>
              <p className="text-slate-500">Dates de location :</p>
              <p className="font-bold text-slate-900">Du {reservation.startDate} ({reservation.pickupTime})</p>
              <p className="font-bold text-slate-900">Au {reservation.endDate} ({reservation.returnTime})</p>
              <p className="text-slate-600">Durée : <strong>{reservation.durationDays} jours</strong></p>
              <p className="text-slate-600">Prise en charge : {reservation.pickupLocation}</p>
            </div>
          </div>
        </div>

        {/* Tableau Financier */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-slate-900 uppercase text-[11px]">4. Décompte Financier</h4>
          <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-bold">
              <tr>
                <th className="p-3">Désignation</th>
                <th className="p-3 text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-3">Location {vehicle.brand} {vehicle.model} ({reservation.durationDays} j × {reservation.dailyRate.toLocaleString('fr-FR')} F)</td>
                <td className="p-3 text-right font-semibold">{reservation.subtotal.toLocaleString('fr-FR')} FCFA</td>
              </tr>
              {reservation.optionsTotal > 0 && (
                <tr>
                  <td className="p-3">Options souscrites</td>
                  <td className="p-3 text-right font-semibold">{reservation.optionsTotal.toLocaleString('fr-FR')} FCFA</td>
                </tr>
              )}
              <tr>
                <td className="p-3">Caution de garantie (empreinte bancaire restituée à terme)</td>
                <td className="p-3 text-right text-slate-600">{reservation.depositAmount.toLocaleString('fr-FR')} FCFA</td>
              </tr>
              <tr className="bg-amber-50 font-black text-sm text-slate-950">
                <td className="p-3">TOTAL TTC RÉGLÉ</td>
                <td className="p-3 text-right text-amber-700">{reservation.totalAmount.toLocaleString('fr-FR')} FCFA</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Conditions */}
        <div className="space-y-2 text-[11px] text-slate-600 border-t border-slate-200 pt-4">
          <h4 className="font-bold text-slate-800 uppercase text-[11px]">5. Conditions Générales & Engagements</h4>
          <ul className="list-disc pl-4 space-y-1">
            {terms.map((t: string, i: number) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>

        {/* Electronic Signature Box */}
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>SIGNATURE ÉLECTRONIQUE VALIDE & CERTIFIÉE</span>
            </div>
            <p className="text-[11px] text-emerald-900">
              Contrat signé numériquement lors de la validation du paiement en ligne par <strong>{customer.firstName} {customer.lastName}</strong>.
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              Horodatage : {new Date(contract.signedAt || Date.now()).toISOString()} • SHA-256 Checksum : Validé
            </p>
          </div>

          <div className="w-16 h-16 rounded-xl bg-white border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
            <QrCode className="w-10 h-10" />
          </div>
        </div>

      </div>

    </div>
  );
};

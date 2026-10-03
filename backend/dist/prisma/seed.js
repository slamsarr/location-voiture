"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
dotenv_1.default.config({
    path: [
        path_1.default.resolve(process.cwd(), '.env'),
        path_1.default.resolve(__dirname, '../../.env'),
        path_1.default.resolve(__dirname, '../../../.env'),
    ].filter(p => fs_1.default.existsSync(p)),
});
const raw = process.env.DATABASE_URL || '';
const match = raw.match(/^file:(.+)$/);
if (match && !path_1.default.isAbsolute(match[1])) {
    let dbRelPath = match[1].replace(/^\.\//, '');
    const seedDir = __dirname;
    const backendRootDir = path_1.default.resolve(seedDir, '..', '..');
    const abs = path_1.default.resolve(backendRootDir, dbRelPath);
    const dir = path_1.default.dirname(abs);
    try {
        if (!fs_1.default.existsSync(dir))
            fs_1.default.mkdirSync(dir, { recursive: true });
    }
    catch (_err) { /* ignore */ }
    process.env.DATABASE_URL = `file:${abs}`;
}
const prisma = new client_1.PrismaClient();
const SALT_ROUNDS = 12;
async function main() {
    console.log('🌱 Démarrage du seed Hertz Digital Rental Platform...');
    await prisma.vehicleInspection.deleteMany();
    await prisma.contract.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.reservationOption.deleteMany();
    await prisma.reservation.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.vehicleCategory.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.user.deleteMany();
    console.log('🔐 Hachage sécurisé des mots de passe (bcrypt)...');
    const adminHash = await bcryptjs_1.default.hash('Admin123!', SALT_ROUNDS);
    const clientHash = await bcryptjs_1.default.hash('Client123!', SALT_ROUNDS);
    console.log('👤 Création des comptes utilisateurs de démonstration...');
    const adminUser = await prisma.user.create({
        data: {
            email: 'admin@demo.local',
            passwordHash: adminHash,
            name: 'Directeur d’Agence (Admin)',
            phone: '+221 77 123 45 67',
            role: 'ADMIN',
        }
    });
    const clientUser = await prisma.user.create({
        data: {
            email: 'client@demo.local',
            passwordHash: clientHash,
            name: 'Amadou Diallo',
            phone: '+221 78 987 65 43',
            role: 'CLIENT',
        }
    });
    // Profil client associé à l'utilisateur de démo
    const demoCustomer = await prisma.customer.create({
        data: {
            userId: clientUser.id,
            firstName: 'Amadou',
            lastName: 'Diallo',
            email: 'client@demo.local',
            phone: '+221 78 987 65 43',
            licenseNumber: 'SN-DKR-2018-98452',
            licenseExpiry: '2028-11-20',
            licenseCountry: 'Sénégal',
            address: 'Almadies, Lot 14',
            city: 'Dakar',
            country: 'Sénégal',
        }
    });
    // 2. Création de 20+ clients réalistes
    console.log('👥 Création des 20+ clients de démonstration...');
    const customerData = [
        { firstName: 'Fatou', lastName: 'Ndiaye', email: 'f.ndiaye@gmail.com', phone: '+221 77 541 23 10', license: 'SN-DK-2019-1123', city: 'Dakar' },
        { firstName: 'Moussa', lastName: 'Ba', email: 'moussa.ba@orange.sn', phone: '+221 77 652 14 89', license: 'SN-DK-2017-4489', city: 'Thiès' },
        { firstName: 'Aïssatou', lastName: 'Sow', email: 'aissatou.sow@yahoo.fr', phone: '+221 78 332 90 12', license: 'SN-SL-2020-7712', city: 'Saint-Louis' },
        { firstName: 'Cheikh', lastName: 'Fall', email: 'cheikh.fall@outlook.com', phone: '+221 70 889 12 34', license: 'SN-DK-2016-3390', city: 'Dakar' },
        { firstName: 'Mariama', lastName: 'Camara', email: 'm.camara@sonatel.sn', phone: '+221 77 412 89 00', license: 'SN-DK-2021-9901', city: 'Dakar' },
        { firstName: 'Ibrahima', lastName: 'Diop', email: 'ibrahima.diop@ecobank.com', phone: '+221 76 550 44 22', license: 'SN-DK-2015-8821', city: 'Dakar' },
        { firstName: 'Sophie', lastName: 'Moreau', email: 'sophie.moreau@airfrance.fr', phone: '+33 6 12 45 78 90', license: 'FR-75-2014-9932', city: 'Paris' },
        { firstName: 'Jean-Marc', lastName: 'Dubois', email: 'jm.dubois@totalenergies.com', phone: '+33 6 88 99 11 22', license: 'FR-92-2012-1088', city: 'Neuilly' },
        { firstName: 'Khadija', lastName: 'Kane', email: 'k.kane@consulting.sn', phone: '+221 77 810 99 88', license: 'SN-DK-2018-7741', city: 'Dakar' },
        { firstName: 'Ousmane', lastName: 'Sy', email: 'ousmane.sy@wave.com', phone: '+221 78 120 40 50', license: 'SN-DK-2019-3312', city: 'Dakar' },
        { firstName: 'Aminata', lastName: 'Traoré', email: 'aminata.traore@uemoa.int', phone: '+221 77 900 11 22', license: 'SN-DK-2016-5541', city: 'Dakar' },
        { firstName: 'Patrick', lastName: 'Leroy', email: 'patrick.leroy@invest-africa.com', phone: '+33 6 45 67 89 01', license: 'FR-69-2010-4411', city: 'Lyon' },
        { firstName: 'Ndeye', lastName: 'Gueye', email: 'ndeye.gueye@gmail.com', phone: '+221 77 344 55 66', license: 'SN-DK-2022-1200', city: 'Rufisque' },
        { firstName: 'Babacar', lastName: 'Seck', email: 'b.seck@transport-pro.sn', phone: '+221 76 890 12 34', license: 'SN-TH-2017-9090', city: 'Thiès' },
        { firstName: 'Salimata', lastName: 'Cissé', email: 'salimata.cisse@hopital-dakar.sn', phone: '+221 77 671 22 33', license: 'SN-DK-2018-4455', city: 'Dakar' },
        { firstName: 'David', lastName: 'Koffi', email: 'david.koffi@afdb.org', phone: '+225 07 88 99 00 11', license: 'CI-ABJ-2016-3321', city: 'Abidjan' },
        { firstName: 'Fanta', lastName: 'Coulibaly', email: 'fanta.coulibaly@undp.org', phone: '+221 78 450 60 70', license: 'SN-DK-2019-7812', city: 'Dakar' },
        { firstName: 'Mamadou', lastName: 'Barry', email: 'm.barry@mining-sn.com', phone: '+221 77 230 45 67', license: 'SN-KD-2015-6677', city: 'Kédougou' },
        { firstName: 'Clara', lastName: 'Benjelloun', email: 'clara.benjelloun@maroc-telecom.ma', phone: '+212 6 61 23 45 67', license: 'MA-CAS-2017-8899', city: 'Casablanca' },
        { firstName: 'Serigne', lastName: 'Mbacké', email: 'serigne.mbacke@commerce.sn', phone: '+221 70 700 80 90', license: 'SN-DK-2014-1100', city: 'Touba' },
    ];
    const createdCustomers = [demoCustomer];
    for (const c of customerData) {
        const cust = await prisma.customer.create({
            data: {
                firstName: c.firstName,
                lastName: c.lastName,
                email: c.email,
                phone: c.phone,
                licenseNumber: c.license,
                licenseExpiry: '2028-06-30',
                licenseCountry: c.license.startsWith('FR') ? 'France' : c.license.startsWith('CI') ? 'Côte d’Ivoire' : 'Sénégal',
                city: c.city,
                country: c.license.startsWith('FR') ? 'France' : c.license.startsWith('CI') ? 'Côte d’Ivoire' : 'Sénégal',
            }
        });
        createdCustomers.push(cust);
    }
    // 3. Catégories de véhicules
    console.log('🚗 Création des catégories de véhicules...');
    const catEco = await prisma.vehicleCategory.create({
        data: { name: 'Économique', slug: 'economique', description: 'Idéale pour la ville, compacte et faible consommation' }
    });
    const catComp = await prisma.vehicleCategory.create({
        data: { name: 'Compacte', slug: 'compacte', description: 'Maniabilité, confort et polyvalence urbaine et routière' }
    });
    const catBerl = await prisma.vehicleCategory.create({
        data: { name: 'Berline', slug: 'berline', description: 'Grand confort, espace aux jambes et voyages d’affaires' }
    });
    const catSuv = await prisma.vehicleCategory.create({
        data: { name: 'SUV', slug: 'suv', description: 'Hauteur de caisse, sécurité et habitacle généreux pour tous trajets' }
    });
    const catPrem = await prisma.vehicleCategory.create({
        data: { name: 'Premium', slug: 'premium', description: 'Luxe, finitions d’exception et performances incomparables' }
    });
    const catUtil = await prisma.vehicleCategory.create({
        data: { name: 'Utilitaire', slug: 'utilitaire', description: 'Volume de chargement pour vos déplacements professionnels' }
    });
    // 4. Création des 12 véhicules de démonstration
    console.log('🚘 Création des 12 véhicules du catalogue...');
    const vehiclesData = [
        {
            brand: 'Toyota',
            model: 'Corolla',
            year: 2024,
            categoryId: catComp.id,
            transmission: 'AUTOMATIC',
            fuel: 'HYBRID',
            seats: 5,
            doors: 5,
            airConditioning: true,
            pricePerDay: 35000,
            deposit: 200000,
            status: 'AVAILABLE',
            imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=900',
            description: 'La Toyota Corolla Hybride offre une douceur de conduite inégalée et une consommation minime. Équipée d’Apple CarPlay, climatisation bizone et régulateur adaptatif.',
            features: JSON.stringify(['Boîte Automatique', 'Hybride essence', 'Apple CarPlay & Android Auto', 'Caméra de recul', 'Climatisation bizone']),
            plateNumber: 'DK-2024-HZ01'
        },
        {
            brand: 'Toyota',
            model: 'RAV4 AWD',
            year: 2024,
            categoryId: catSuv.id,
            transmission: 'AUTOMATIC',
            fuel: 'HYBRID',
            seats: 5,
            doors: 5,
            airConditioning: true,
            pricePerDay: 55000,
            deposit: 300000,
            status: 'AVAILABLE',
            imageUrl: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?auto=format&fit=crop&q=80&w=900',
            description: 'SUV de référence combinant puissance, transmission intégrale AWD et confort premium pour tous vos trajets vers Dakar, Saly ou les régions.',
            features: JSON.stringify(['Transmission 4x4 AWD', 'Toit ouvrant panoramique', 'Sellerie cuir', 'Aide au stationnement 360°', 'Coffre géant']),
            plateNumber: 'DK-2024-HZ02'
        },
        {
            brand: 'Peugeot',
            model: '208 GT',
            year: 2024,
            categoryId: catEco.id,
            transmission: 'MANUAL',
            fuel: 'GASOLINE',
            seats: 5,
            doors: 5,
            airConditioning: true,
            pricePerDay: 25000,
            deposit: 150000,
            status: 'AVAILABLE',
            imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=900',
            description: 'Citadine chic, nerveuse et très économe. Le célèbre i-Cockpit 3D Peugeot offre une ergonomie parfaite en circulation dense.',
            features: JSON.stringify(['i-Cockpit 3D', 'Climatisation automatique', 'Radar de stationnement', 'Bluetooth audio', 'Feux Full LED']),
            plateNumber: 'DK-2024-HZ03'
        },
        {
            brand: 'Hyundai',
            model: 'Tucson N-Line',
            year: 2024,
            categoryId: catSuv.id,
            transmission: 'AUTOMATIC',
            fuel: 'DIESEL',
            seats: 5,
            doors: 5,
            airConditioning: true,
            pricePerDay: 50000,
            deposit: 250000,
            status: 'AVAILABLE',
            imageUrl: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&q=80&w=900',
            description: 'Design avant-gardiste et signature lumineuse unique. Ce Hyundai Tucson offre un confort de suspension exceptionnel.',
            features: JSON.stringify(['Écran tactile 10.25"', 'Sièges ventilés et chauffants', 'Freinage d’urgence autonome', 'Régulateur de vitesse']),
            plateNumber: 'DK-2024-HZ04'
        },
        {
            brand: 'Kia',
            model: 'Sportage GT-Line',
            year: 2024,
            categoryId: catSuv.id,
            transmission: 'AUTOMATIC',
            fuel: 'DIESEL',
            seats: 5,
            doors: 5,
            airConditioning: true,
            pricePerDay: 52000,
            deposit: 250000,
            status: 'AVAILABLE',
            imageUrl: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=900',
            description: 'SUV moderne et spacieux doté d’un double écran panoramique incurvé et d’une habitabilité de premier ordre.',
            features: JSON.stringify(['Écran panoramique incurvé', 'Système audio premium', 'Phares matriciels LED', 'Jantes alliage 19"']),
            plateNumber: 'DK-2024-HZ05'
        },
        {
            brand: 'Mercedes-Benz',
            model: 'Classe C 220d',
            year: 2024,
            categoryId: catPrem.id,
            transmission: 'AUTOMATIC',
            fuel: 'DIESEL',
            seats: 5,
            doors: 4,
            airConditioning: true,
            pricePerDay: 95000,
            deposit: 600000,
            status: 'AVAILABLE',
            imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=900',
            description: 'Le summum de l’élégance pour vos déplacements officiels ou rendez-vous d’affaires. Habitacle MBUX et insonorisation remarquable.',
            features: JSON.stringify(['Intérieur cuir Nappa', 'Système MBUX avec commande vocale', 'Suspension adaptative', 'Éclairage d’ambiance 64 couleurs']),
            plateNumber: 'DK-2024-HZ06'
        },
        {
            brand: 'Peugeot',
            model: '3008 Allure',
            year: 2023,
            categoryId: catSuv.id,
            transmission: 'AUTOMATIC',
            fuel: 'DIESEL',
            seats: 5,
            doors: 5,
            airConditioning: true,
            pricePerDay: 48000,
            deposit: 250000,
            status: 'AVAILABLE',
            imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=900',
            description: 'Le SUV le plus plébiscité. Tenue de route irréprochable et grand coffre modulable pour familles et professionnels.',
            features: JSON.stringify(['Navigation GPS 3D', 'Grip Control tout chemin', 'Accès et démarrage mains libres', 'Barres de toit']),
            plateNumber: 'DK-2023-HZ07'
        },
        {
            brand: 'Renault',
            model: 'Duster 4x4',
            year: 2023,
            categoryId: catSuv.id,
            transmission: 'MANUAL',
            fuel: 'DIESEL',
            seats: 5,
            doors: 5,
            airConditioning: true,
            pricePerDay: 38000,
            deposit: 200000,
            status: 'AVAILABLE',
            imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=900',
            description: 'Robuste, tout-terrain efficace et économique, le Duster est le compagnon idéal pour explorer toutes les pistes en toute sérénité.',
            features: JSON.stringify(['Transmission 4x4 verrouillable', 'Garde au sol surélevée', 'Protection sous châssis', 'Climatisation renforcée']),
            plateNumber: 'DK-2023-HZ08'
        },
        {
            brand: 'Toyota',
            model: 'Land Cruiser Prado TX-L',
            year: 2024,
            categoryId: catPrem.id,
            transmission: 'AUTOMATIC',
            fuel: 'DIESEL',
            seats: 7,
            doors: 5,
            airConditioning: true,
            pricePerDay: 130000,
            deposit: 800000,
            status: 'RENTED',
            imageUrl: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=900',
            description: 'Le géant tout-terrain par excellence. 7 vraies places, fiabilité légendaire et sécurité maximale pour délégations et longs voyages.',
            features: JSON.stringify(['7 places spacieuses', 'Vrai 4x4 avec boîte de transfert', 'Glacière centrale réfrigérée', 'Double réservoir']),
            plateNumber: 'DK-2024-HZ09'
        },
        {
            brand: 'Toyota',
            model: 'Hilux Double Cabine 4x4',
            year: 2023,
            categoryId: catUtil.id,
            transmission: 'MANUAL',
            fuel: 'DIESEL',
            seats: 5,
            doors: 4,
            airConditioning: true,
            pricePerDay: 45000,
            deposit: 250000,
            status: 'AVAILABLE',
            imageUrl: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&q=80&w=900',
            description: 'Pick-up utilitaire tout terrain indestructible. Benne spacieuse pour outillage, fret ou expéditions professionnelles.',
            features: JSON.stringify(['Benne grand volume avec bac', 'Attelage remorque', '4x4 tout-terrain', 'Capacité de charge 1 tonne']),
            plateNumber: 'DK-2023-HZ10'
        },
        {
            brand: 'Mercedes-Benz',
            model: 'Classe E 300 Exclusive',
            year: 2024,
            categoryId: catBerl.id,
            transmission: 'AUTOMATIC',
            fuel: 'GASOLINE',
            seats: 5,
            doors: 4,
            airConditioning: true,
            pricePerDay: 110000,
            deposit: 700000,
            status: 'AVAILABLE',
            imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=900',
            description: 'La référence mondiale de la grande berline de standing. Confort princier, suspension pneumatique et finitions bois noble.',
            features: JSON.stringify(['Suspension pneumatique Air Body', 'Son Surround Burmester 3D', 'Sièges massants', 'Assistance à la conduite niveau 2']),
            plateNumber: 'DK-2024-HZ11'
        },
        {
            brand: 'Hyundai',
            model: 'Grand i10',
            year: 2023,
            categoryId: catEco.id,
            transmission: 'MANUAL',
            fuel: 'GASOLINE',
            seats: 5,
            doors: 5,
            airConditioning: true,
            pricePerDay: 20000,
            deposit: 120000,
            status: 'MAINTENANCE',
            imageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=900',
            description: 'Petite citadine économique et agile, idéale pour se garer facilement en centre-ville.',
            features: JSON.stringify(['Ultra maniable', 'Faible consommation', 'Climatisation', 'Bluetooth']),
            plateNumber: 'DK-2023-HZ12'
        }
    ];
    const createdVehicles = [];
    for (const v of vehiclesData) {
        const created = await prisma.vehicle.create({ data: v });
        createdVehicles.push(created);
    }
    // 5. Création de 30+ réservations avec paiements et contrats
    console.log('📅 Création des 30+ réservations cohérentes en 2026...');
    const datesSamples = [
        { start: '2026-03-01', end: '2026-03-05', status: 'COMPLETED' },
        { start: '2026-03-02', end: '2026-03-07', status: 'COMPLETED' },
        { start: '2026-03-05', end: '2026-03-10', status: 'COMPLETED' },
        { start: '2026-03-08', end: '2026-03-12', status: 'COMPLETED' },
        { start: '2026-03-10', end: '2026-03-15', status: 'ACTIVE' },
        { start: '2026-03-12', end: '2026-03-17', status: 'ACTIVE' },
        { start: '2026-03-14', end: '2026-03-19', status: 'PAID' },
        { start: '2026-03-15', end: '2026-03-20', status: 'PAID' },
        { start: '2026-03-16', end: '2026-03-22', status: 'CONFIRMED' },
        { start: '2026-03-18', end: '2026-03-23', status: 'PENDING' },
        { start: '2026-03-20', end: '2026-03-25', status: 'PAID' },
        { start: '2026-03-22', end: '2026-03-27', status: 'CONFIRMED' },
        { start: '2026-03-25', end: '2026-03-30', status: 'PENDING' },
        { start: '2026-04-01', end: '2026-04-06', status: 'PAID' },
        { start: '2026-04-05', end: '2026-04-10', status: 'CONFIRMED' },
        { start: '2026-04-08', end: '2026-04-14', status: 'PAID' },
        { start: '2026-04-10', end: '2026-04-15', status: 'PENDING' },
        { start: '2026-04-12', end: '2026-04-18', status: 'CONFIRMED' },
        { start: '2026-04-15', end: '2026-04-20', status: 'PAID' },
        { start: '2026-04-18', end: '2026-04-23', status: 'CANCELLED' },
        { start: '2026-04-20', end: '2026-04-25', status: 'PAID' },
        { start: '2026-04-22', end: '2026-04-28', status: 'PAID' },
        { start: '2026-04-25', end: '2026-04-30', status: 'CONFIRMED' },
        { start: '2026-05-01', end: '2026-05-05', status: 'PAID' },
        { start: '2026-05-03', end: '2026-05-08', status: 'PAID' },
        { start: '2026-05-06', end: '2026-05-12', status: 'CONFIRMED' },
        { start: '2026-05-10', end: '2026-05-15', status: 'PENDING' },
        { start: '2026-05-12', end: '2026-05-17', status: 'PAID' },
        { start: '2026-05-15', end: '2026-05-20', status: 'CONFIRMED' },
        { start: '2026-05-18', end: '2026-05-24', status: 'PAID' },
        { start: '2026-05-20', end: '2026-05-26', status: 'CANCELLED' },
        { start: '2026-05-25', end: '2026-05-30', status: 'PAID' },
    ];
    const paymentMethods = ['WAVE', 'ORANGE_MONEY', 'CARD', 'INTOUCH'];
    let refCounter = 10001;
    for (let i = 0; i < datesSamples.length; i++) {
        const sample = datesSamples[i];
        const customer = createdCustomers[i % createdCustomers.length];
        const vehicle = createdVehicles[i % createdVehicles.length];
        const days = 5;
        const subtotal = vehicle.pricePerDay * days;
        const optionsTotal = (i % 2 === 0) ? 25000 : 0;
        const totalAmount = subtotal + optionsTotal;
        const ref = `HZ-2026-00${refCounter++}`;
        const reservation = await prisma.reservation.create({
            data: {
                reference: ref,
                customerId: customer.id,
                vehicleId: vehicle.id,
                startDate: sample.start,
                endDate: sample.end,
                pickupTime: '10:00',
                returnTime: '10:00',
                pickupLocation: 'Agence Aéroport Blaise Diagne (AIBD)',
                returnLocation: 'Agence Aéroport Blaise Diagne (AIBD)',
                dailyRate: vehicle.pricePerDay,
                durationDays: days,
                subtotal,
                optionsTotal,
                taxTotal: 0,
                totalAmount,
                depositAmount: vehicle.deposit,
                status: sample.status,
            }
        });
        // Option si applicable
        if (optionsTotal > 0) {
            await prisma.reservationOption.create({
                data: {
                    reservationId: reservation.id,
                    code: 'FULL_INSURANCE',
                    name: 'Assurance Tous Risques Zéro Franchise',
                    pricePerDay: 5000,
                    quantity: 1,
                    totalPrice: 25000,
                }
            });
        }
        // Paiement si statut PAID, COMPLETED, ACTIVE
        if (['PAID', 'COMPLETED', 'ACTIVE'].includes(sample.status)) {
            const pMethod = paymentMethods[i % paymentMethods.length];
            await prisma.payment.create({
                data: {
                    reference: `PAY-2026-00${refCounter}`,
                    reservationId: reservation.id,
                    amount: totalAmount,
                    currency: 'FCFA',
                    method: pMethod,
                    provider: 'MockPaymentProvider',
                    status: 'SUCCESS',
                    paidAt: new Date(sample.start),
                    transactionDetails: JSON.stringify({ method: pMethod, simulated: true })
                }
            });
            // Contrat électronique
            await prisma.contract.create({
                data: {
                    reference: `CTR-2026-00${refCounter}`,
                    reservationId: reservation.id,
                    status: 'SIGNED',
                    signedAt: new Date(sample.start),
                    termsAccepted: true,
                }
            });
        }
    }
    // 6. Notifications initiales
    console.log('🔔 Création des notifications de démonstration...');
    await prisma.notification.createMany({
        data: [
            {
                type: 'WHATSAPP',
                recipient: '+221 78 987 65 43',
                content: '🚘 Hertz Digital : Votre réservation HZ-2026-001001 est confirmée pour la Toyota Corolla.',
                status: 'SENT'
            },
            {
                type: 'EMAIL',
                recipient: 'client@demo.local',
                subject: 'Confirmation et contrat électronique - Hertz Digital',
                content: 'Votre contrat CTR-2026-001001 est disponible au téléchargement dans votre espace client.',
                status: 'SENT'
            },
            {
                type: 'SMS',
                recipient: '+221 77 541 23 10',
                content: 'Hertz: Paiement Wave de 175 000 FCFA reçu avec succès pour votre Toyota RAV4.',
                status: 'SENT'
            }
        ]
    });
    // 7. Inspection véhicule démonstrateur V2
    console.log('🔍 Création de l’inspection exemple V2...');
    const prado = createdVehicles.find(v => v.model.includes('Prado')) || createdVehicles[0];
    await prisma.vehicleInspection.create({
        data: {
            vehicleId: prado.id,
            type: 'CHECK_IN',
            mileage: 42150,
            fuelLevel: 100,
            damages: JSON.stringify([
                { part: 'front_bumper_right', severity: 'minor', label: 'Micro-rayure pare-chocs avant droit' },
                { part: 'rear_door_left', severity: 'minor', label: 'Léger impact portière arrière gauche' }
            ]),
            photos: JSON.stringify([
                'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=800'
            ]),
            inspectorNotes: 'État général excellent. Propreté intérieure 5/5. Pression pneus vérifiée. Niveau d’huile optimal.',
            completedAt: new Date('2026-03-10T09:30:00Z')
        }
    });
    console.log('✅ Seed Hertz Digital terminé avec succès !');
    console.log('👉 Admin  : admin@demo.local / Admin123!');
    console.log('👉 Client : client@demo.local / Client123!');
}
main()
    .catch((e) => {
    console.error('❌ Erreur lors du seed :', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});

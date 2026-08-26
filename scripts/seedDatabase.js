import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDd1_gvnlcP8D4UIYv7vlBA1JSggXzemRE",
  authDomain: "gramsetu-ee7ab.firebaseapp.com",
  projectId: "gramsetu-ee7ab",
  storageBucket: "gramsetu-ee7ab.firebasestorage.app",
  messagingSenderId: "1014277573919",
  appId: "1:1014277573919:web:a5ea3b470ba80d7f02742a",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log('🚀 Connecting to Firebase project: gramsetu-ee7ab...');

// 1. DUMMY USERS (Authorities, Field Workers, Citizens)
const dummyUsers = [
  {
    id: 'user_sachiv_01',
    name: 'Pankaj Sharma',
    email: 'sachiv@gramsetu.in',
    phone: '+91 94150 12345',
    role: 'sachiv',
    designation: 'Panchayat Secretary (Sachiv)',
    village: 'Rampur Gram Panchayat',
    ward: 'All Wards',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    createdAt: new Date('2026-01-10T10:00:00Z').toISOString(),
  },
  {
    id: 'user_pradhan_01',
    name: 'Shri Ramswaroop Yadav',
    email: 'pradhan@gramsetu.in',
    phone: '+91 98390 54321',
    role: 'pradhan',
    designation: 'Elected Gram Pradhan (Village Head)',
    village: 'Rampur Gram Panchayat',
    ward: 'All Wards',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    createdAt: new Date('2026-01-05T09:00:00Z').toISOString(),
  },
  {
    id: 'user_admin_01',
    name: 'Anurag Verma',
    email: 'admin@gramsetu.in',
    phone: '+91 94500 98765',
    role: 'admin',
    designation: 'Block Development Officer (BDO / Admin)',
    village: 'Rampur Block HQ',
    ward: 'All Wards',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    createdAt: new Date('2026-01-01T08:00:00Z').toISOString(),
  },
  {
    id: 'worker_01',
    name: 'Ramesh Kumar',
    email: 'ramesh.worker@gramsetu.in',
    phone: '+91 98765 43210',
    role: 'worker',
    designation: 'Sanitation & Roads Supervisor',
    village: 'Rampur Gram Panchayat',
    ward: 'Ward 1-6',
    profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    createdAt: new Date('2026-01-15T09:00:00Z').toISOString(),
  },
  {
    id: 'worker_02',
    name: 'Suresh Verma',
    email: 'suresh.worker@gramsetu.in',
    phone: '+91 98765 43211',
    role: 'worker',
    designation: 'Water Works & Pipeline Technician',
    village: 'Rampur Gram Panchayat',
    ward: 'Ward 4-9',
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    createdAt: new Date('2026-01-15T09:00:00Z').toISOString(),
  },
  {
    id: 'worker_03',
    name: 'Amit Singh',
    email: 'amit.worker@gramsetu.in',
    phone: '+91 98765 43212',
    role: 'worker',
    designation: 'Electricity Line Inspector',
    village: 'Rampur Gram Panchayat',
    ward: 'Ward 7-12',
    profileImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    createdAt: new Date('2026-01-15T09:00:00Z').toISOString(),
  },
  {
    id: 'worker_04',
    name: 'Manoj Yadav',
    email: 'manoj.worker@gramsetu.in',
    phone: '+91 98765 43213',
    role: 'worker',
    designation: 'Civil Works & Pothole Repair',
    village: 'Rampur Gram Panchayat',
    ward: 'Ward 1-12',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    createdAt: new Date('2026-01-15T09:00:00Z').toISOString(),
  },
  {
    id: 'worker_05',
    name: 'Dinesh Prasad',
    email: 'dinesh.worker@gramsetu.in',
    phone: '+91 98765 43214',
    role: 'worker',
    designation: 'Primary Health & Sanitation',
    village: 'Rampur Gram Panchayat',
    ward: 'Ward 1-5',
    profileImage: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=200&auto=format&fit=crop&q=80',
    createdAt: new Date('2026-01-15T09:00:00Z').toISOString(),
  },
  {
    id: 'citizen_01',
    name: 'Ram Kumar',
    email: 'ramkumar.citizen@gmail.com',
    phone: '+91 99180 11223',
    role: 'citizen',
    village: 'Rampur Gram Panchayat',
    ward: 'Ward 12 (School Road)',
    createdAt: new Date('2026-02-01T10:00:00Z').toISOString(),
  },
  {
    id: 'citizen_02',
    name: 'Sunita Devi',
    email: 'sunita.devi@gmail.com',
    phone: '+91 98380 22334',
    role: 'citizen',
    village: 'Rampur Gram Panchayat',
    ward: 'Ward 4 (Basti)',
    createdAt: new Date('2026-02-05T11:00:00Z').toISOString(),
  },
  {
    id: 'citizen_03',
    name: 'Virendra Pratap',
    email: 'virendra.pratap@gmail.com',
    phone: '+91 94150 33445',
    role: 'citizen',
    village: 'Rampur Gram Panchayat',
    ward: 'Ward 7 (Market Square)',
    createdAt: new Date('2026-02-08T12:00:00Z').toISOString(),
  },
  {
    id: 'citizen_04',
    name: 'Kiran Sharma',
    email: 'kiran.sharma@gmail.com',
    phone: '+91 97920 44556',
    role: 'citizen',
    village: 'Rampur Gram Panchayat',
    ward: 'Ward 2 (Hospital Gali)',
    createdAt: new Date('2026-02-10T14:00:00Z').toISOString(),
  },
  {
    id: 'citizen_05',
    name: 'Mohan Lal',
    email: 'mohan.lal@gmail.com',
    phone: '+91 94510 55667',
    role: 'citizen',
    village: 'Rampur Gram Panchayat',
    ward: 'Ward 9 (North Tola)',
    createdAt: new Date('2026-02-12T15:00:00Z').toISOString(),
  },
];

// 2. DUMMY COMPLAINTS
const dummyComplaints = [
  {
    complaintId: 'GRM-2026-001',
    title: 'Severe road potholes outside Primary School gate causing tractor & bus accidents',
    description: 'A deep road collapse and severe cratering right outside the primary school gate. During rainy hours, water pools up to 1 foot deep, creating severe hazards for school children, bicycles, and farmers transporting produce.',
    category: 'Roads',
    priority: 'HIGH',
    status: 'In Progress',
    reportedBy: 'Ram Kumar',
    village: 'Rampur Gram Panchayat',
    ward: 'Ward 12 (School Road)',
    latitude: 26.8485,
    longitude: 80.9482,
    originalImage: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
    assignedWorker: 'Ramesh Kumar',
    deadline: '2026-08-30',
    citizenVerified: false,
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    updates: [
      {
        status: 'Submitted',
        notes: 'Grievance lodged via GramSetu Citizen Mobile App with photographic evidence and GPS coordinates.',
        updatedBy: 'Ram Kumar (Citizen)',
        updatedByRole: 'citizen',
        createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
      },
      {
        status: 'Under Review',
        notes: 'Panchayat Secretary Pankaj Sharma reviewed the pothole location and validated road repair necessity.',
        updatedBy: 'Pankaj Sharma',
        updatedByRole: 'sachiv',
        createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
      },
      {
        status: 'Assigned',
        notes: 'Work order dispatched to Field Supervisor Ramesh Kumar with tar and gravel allotment.',
        updatedBy: 'Pankaj Sharma',
        updatedByRole: 'sachiv',
        assignedWorker: 'Ramesh Kumar',
        createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
      },
      {
        status: 'In Progress',
        notes: 'Excavation and base gravel compaction initiated on school road stretch.',
        updatedBy: 'Ramesh Kumar',
        updatedByRole: 'worker',
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      },
    ],
  },
  {
    complaintId: 'GRM-2026-002',
    title: 'Main drinking water pipeline fractured - 40 households without clean water',
    description: 'Underground municipal supply pipe burst near the village handpump crossing in Ward 4. Muddy water is entering the supply lines and 40 families are completely without clean drinking water for the last 18 hours.',
    category: 'Water',
    priority: 'CRITICAL',
    status: 'Pending',
    reportedBy: 'Sunita Devi',
    village: 'Rampur Gram Panchayat',
    ward: 'Ward 4 (Basti)',
    latitude: 26.8452,
    longitude: 80.9421,
    originalImage: 'https://images.unsplash.com/photo-1584463699039-385c57b85526?w=800&auto=format&fit=crop&q=80',
    citizenVerified: false,
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updates: [
      {
        status: 'Submitted',
        notes: 'Critical grievance filed by Ward 4 residents. Immediate valve shut-off and pipe replacement requested.',
        updatedBy: 'Sunita Devi (Citizen)',
        updatedByRole: 'citizen',
        createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      },
    ],
  },
  {
    complaintId: 'GRM-2026-003',
    title: '11KV transformer sparking and streetlights burned out near market',
    description: 'Three pole-mounted LED street lights are dead and the local transformer junction box is giving off sparks intermittently during evening hours. Risk of electrical fire near wooden vendor stalls.',
    category: 'Electricity',
    priority: 'HIGH',
    status: 'Assigned',
    reportedBy: 'Virendra Pratap',
    village: 'Rampur Gram Panchayat',
    ward: 'Ward 7 (Market Square)',
    latitude: 26.8512,
    longitude: 80.9534,
    originalImage: 'https://images.unsplash.com/photo-1509390144018-eeaf6504a269?w=800&auto=format&fit=crop&q=80',
    assignedWorker: 'Amit Singh',
    deadline: '2026-08-28',
    citizenVerified: false,
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updates: [
      {
        status: 'Submitted',
        notes: 'Reported hazard in high-footfall bazaar area.',
        updatedBy: 'Virendra Pratap (Citizen)',
        updatedByRole: 'citizen',
        createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      },
      {
        status: 'Assigned',
        notes: 'Dispatched to Line Inspector Amit Singh for fuse box inspection and streetlight bulb replacement.',
        updatedBy: 'Pankaj Sharma',
        updatedByRole: 'sachiv',
        assignedWorker: 'Amit Singh',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
    ],
  },
  {
    complaintId: 'GRM-2026-004',
    title: 'Open drainage overflow and foul water stagnation behind Health Sub-centre',
    description: 'Solid waste accumulation blocking the concrete drain channel behind the Community Health Sub-centre. Foul smell and stagnant black water causing severe mosquito breeding risk for hospital patients.',
    category: 'Sanitation',
    priority: 'MEDIUM',
    status: 'Resolved',
    reportedBy: 'Kiran Sharma',
    village: 'Rampur Gram Panchayat',
    ward: 'Ward 2 (Hospital Gali)',
    latitude: 26.8415,
    longitude: 80.9405,
    originalImage: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&auto=format&fit=crop&q=80',
    resolutionImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    assignedWorker: 'Ramesh Kumar',
    deadline: '2026-08-25',
    citizenVerified: true,
    verificationComment: 'Drainage channel has been completely cleared, desilted, and bleached by the sanitation team. Water flow is normal now. Thank you GramSetu team!',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    resolvedAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    updates: [
      {
        status: 'Submitted',
        notes: 'Sanitation emergency reported near hospital premises.',
        updatedBy: 'Kiran Sharma (Citizen)',
        updatedByRole: 'citizen',
        createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
      },
      {
        status: 'Assigned',
        notes: 'Sanitation team deployed with suction pump and bleaching powder.',
        updatedBy: 'Pankaj Sharma',
        updatedByRole: 'sachiv',
        assignedWorker: 'Ramesh Kumar',
        createdAt: new Date(Date.now() - 3600000 * 50).toISOString(),
      },
      {
        status: 'In Progress',
        notes: 'Blockage cleared, 80 meters of concrete drain flushed.',
        updatedBy: 'Ramesh Kumar',
        updatedByRole: 'worker',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        status: 'Resolved',
        notes: 'Remediation completed and verified with photographic proof.',
        updatedBy: 'Ramesh Kumar',
        updatedByRole: 'worker',
        createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
      },
      {
        status: 'Citizen Verified',
        notes: 'Citizen confirmed resolution on mobile app and rated service 5/5 stars.',
        updatedBy: 'Kiran Sharma (Citizen)',
        updatedByRole: 'citizen',
        createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
      },
    ],
  },
  {
    complaintId: 'GRM-2026-005',
    title: 'Community handpump cylinder broken discharging rusty muddy water',
    description: 'India Mark II handpump handle fractured and riser pipe cylinder damaged. Villagers in North Tola unable to draw water for cattle and daily usage.',
    category: 'Water',
    priority: 'HIGH',
    status: 'Under Review',
    reportedBy: 'Mohan Lal',
    village: 'Rampur Gram Panchayat',
    ward: 'Ward 9 (North Tola)',
    latitude: 26.8499,
    longitude: 80.9448,
    originalImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80',
    citizenVerified: false,
    createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    updates: [
      {
        status: 'Submitted',
        notes: 'Handpump breakdown logged.',
        updatedBy: 'Mohan Lal (Citizen)',
        updatedByRole: 'citizen',
        createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
      },
      {
        status: 'Under Review',
        notes: 'Verifying spare parts availability from Jal Nigam inventory.',
        updatedBy: 'Pankaj Sharma',
        updatedByRole: 'sachiv',
        createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      },
    ],
  },
  {
    complaintId: 'GRM-2026-006',
    title: 'Primary Health Sub-centre boundary wall collapsed due to rains',
    description: '20 feet section of the perimeter boundary wall collapsed after heavy downpour, allowing stray animals into the clinic immunization area.',
    category: 'Infrastructure',
    priority: 'MEDIUM',
    status: 'Pending',
    reportedBy: 'Kiran Sharma',
    village: 'Rampur Gram Panchayat',
    ward: 'Ward 2 (Hospital Gali)',
    latitude: 26.8421,
    longitude: 80.9398,
    originalImage: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&auto=format&fit=crop&q=80',
    citizenVerified: false,
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updates: [
      {
        status: 'Submitted',
        notes: 'Boundary wall damage reported by clinic staff.',
        updatedBy: 'Kiran Sharma (Citizen)',
        updatedByRole: 'citizen',
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      },
    ],
  },
  {
    complaintId: 'GRM-2026-007',
    title: 'Solar street light battery stolen near village community hall',
    description: 'The solar panel battery box on the Panchayat Bhawan pole was tampered with and battery unit missing. Night illumination compromised.',
    category: 'Electricity',
    priority: 'LOW',
    status: 'Assigned',
    reportedBy: 'Ram Kumar',
    village: 'Rampur Gram Panchayat',
    ward: 'Ward 1 (Panchayat Bhawan)',
    latitude: 26.8465,
    longitude: 80.9460,
    originalImage: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=800&auto=format&fit=crop&q=80',
    assignedWorker: 'Amit Singh',
    deadline: '2026-08-29',
    citizenVerified: false,
    createdAt: new Date(Date.now() - 3600000 * 22).toISOString(),
    updates: [
      {
        status: 'Submitted',
        notes: 'Solar light component theft reported.',
        updatedBy: 'Ram Kumar (Citizen)',
        updatedByRole: 'citizen',
        createdAt: new Date(Date.now() - 3600000 * 22).toISOString(),
      },
      {
        status: 'Assigned',
        notes: 'FIR copy noted and replacement battery requisitioned.',
        updatedBy: 'Pankaj Sharma',
        updatedByRole: 'sachiv',
        assignedWorker: 'Amit Singh',
        createdAt: new Date(Date.now() - 3600000 * 16).toISOString(),
      },
    ],
  },
  {
    complaintId: 'GRM-2026-008',
    title: 'Garbage accumulation and animal carcass near irrigation canal bridge',
    description: 'Illegal waste dumping and animal waste rotting under the culvert bridge, contaminating the canal water used for paddy irrigation downstream.',
    category: 'Sanitation',
    priority: 'CRITICAL',
    status: 'In Progress',
    reportedBy: 'Sunita Devi',
    village: 'Rampur Gram Panchayat',
    ward: 'Ward 5 (Canal Road)',
    latitude: 26.8530,
    longitude: 80.9510,
    originalImage: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
    assignedWorker: 'Dinesh Prasad',
    deadline: '2026-08-27',
    citizenVerified: false,
    createdAt: new Date(Date.now() - 3600000 * 15).toISOString(),
    updates: [
      {
        status: 'Submitted',
        notes: 'Emergency sanitation alert filed.',
        updatedBy: 'Sunita Devi (Citizen)',
        updatedByRole: 'citizen',
        createdAt: new Date(Date.now() - 3600000 * 15).toISOString(),
      },
      {
        status: 'Assigned',
        notes: 'Sanitation crew dispatched with tractor trolley for immediate site clearance.',
        updatedBy: 'Shri Ramswaroop Yadav (Pradhan)',
        updatedByRole: 'pradhan',
        assignedWorker: 'Dinesh Prasad',
        createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
      },
      {
        status: 'In Progress',
        notes: 'Waste removal and lime powder disinfection underway.',
        updatedBy: 'Dinesh Prasad',
        updatedByRole: 'worker',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
    ],
  },
];

async function seedAll() {
  try {
    console.log('🔑 Authenticating anonymously or registering admin session...');
    try {
      await signInAnonymously(auth);
      console.log('  ✓ Authenticated with Firebase Auth');
    } catch (authErr) {
      console.log('  ℹ Note: Anonymous sign-in skipped or disabled, continuing direct write...');
    }

    console.log('\n📦 Step 1: Seeding Users (Authorities, Field Workers, Citizens)...');
    for (const user of dummyUsers) {
      const userDocRef = doc(db, 'users', user.id);
      await setDoc(userDocRef, user, { merge: true });
      console.log(`  ✓ Seeded user: ${user.name} (${user.role})`);
    }

    console.log('\n📦 Step 2: Seeding Complaints & Timeline Updates...');
    for (const complaint of dummyComplaints) {
      const { updates, ...complaintData } = complaint;
      const complaintDocRef = doc(db, 'complaints', complaint.complaintId);
      await setDoc(complaintDocRef, complaintData, { merge: true });
      console.log(`  ✓ Seeded complaint: ${complaint.complaintId} - "${complaint.title.slice(0, 45)}..."`);

      if (updates && updates.length > 0) {
        for (const update of updates) {
          await addDoc(collection(db, 'complaint_updates'), {
            complaintId: complaint.complaintId,
            status: update.status,
            notes: update.notes,
            updatedBy: update.updatedBy,
            updatedByRole: update.updatedByRole,
            assignedWorker: update.assignedWorker || null,
            createdAt: update.createdAt,
            timestamp: serverTimestamp(),
          });
        }
      }
    }

    console.log('\n🎉 ALL DUMMY DATA SEEDED SUCCESSFULLY INTO FIRESTORE: gramsetu-ee7ab!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
    console.log('\n💡 FIRESTORE SECURITY RULES NOTICE:');
    console.log('If your Firebase Firestore Security Rules currently require authentication or reject unauthenticated writes, please update them in Firebase Console -> Firestore Database -> Rules to:');
    console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
    `);
    process.exit(1);
  }
}

seedAll();

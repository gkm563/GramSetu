import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

export async function seedDemoGrievances(): Promise<number> {
  const sampleComplaints = [
    {
      complaintId: 'GRM-2026-001',
      title: 'Deep road crater and pothole near Gram Panchayat Primary School',
      description: 'Major road collapse and deep potholes outside the primary school gate. Villagers, school buses, and tractors are facing serious difficulty, with accidents occurring during rainy hours.',
      category: 'Roads',
      priority: 'HIGH',
      status: 'In Progress',
      reportedBy: 'Ram Kumar (Villager)',
      village: 'Rampur Gram Panchayat',
      ward: 'Ward 12 (School Road)',
      latitude: 26.8485,
      longitude: 80.9482,
      originalImage: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=60',
      assignedWorker: 'Ramesh Kumar',
      deadline: '2026-08-30',
      citizenVerified: false,
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      complaintId: 'GRM-2026-002',
      title: 'Main drinking water pipeline leak and low pressure supply',
      description: 'The underground municipal water supply pipeline is fractured near the village handpump crossing, causing contamination and zero water pressure to 40+ households in Ward 4.',
      category: 'Water',
      priority: 'CRITICAL',
      status: 'Pending',
      reportedBy: 'Sunita Devi',
      village: 'Rampur Gram Panchayat',
      ward: 'Ward 4 (Basti)',
      latitude: 26.8452,
      longitude: 80.9421,
      originalImage: 'https://images.unsplash.com/photo-1584463699039-385c57b85526?w=800&auto=format&fit=crop&q=60',
      citizenVerified: false,
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    },
    {
      complaintId: 'GRM-2026-003',
      title: 'High voltage transformer sparking and street lights broken',
      description: 'Three pole-mounted street lights are dead and the local transformer junction box is giving off sparks intermittently during evening hours.',
      category: 'Electricity',
      priority: 'HIGH',
      status: 'Assigned',
      reportedBy: 'Virendra Pratap',
      village: 'Rampur Gram Panchayat',
      ward: 'Ward 7 (Market Square)',
      latitude: 26.8512,
      longitude: 80.9534,
      originalImage: 'https://images.unsplash.com/photo-1509390144018-eeaf6504a269?w=800&auto=format&fit=crop&q=60',
      assignedWorker: 'Amit Singh',
      deadline: '2026-08-28',
      citizenVerified: false,
      createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    },
    {
      complaintId: 'GRM-2026-004',
      title: 'Open drainage overflow and stagnation near health sub-centre',
      description: 'Solid waste accumulation blocking the concrete drain channel behind the Panchayat Community Health Sub-centre. Foul odor and mosquito breeding.',
      category: 'Sanitation',
      priority: 'MEDIUM',
      status: 'Resolved',
      reportedBy: 'Kiran Sharma',
      village: 'Rampur Gram Panchayat',
      ward: 'Ward 2 (Hospital Gali)',
      latitude: 26.8415,
      longitude: 80.9405,
      originalImage: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&auto=format&fit=crop&q=60',
      resolutionImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60',
      assignedWorker: 'Ramesh Kumar',
      citizenVerified: true,
      verificationComment: 'Drainage has been thoroughly desilted and bleached by the sanitation team. Excellent response time!',
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      resolvedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    },
    {
      complaintId: 'GRM-2026-005',
      title: 'Community handpump cylinder broken and contaminated water',
      description: 'Handpump handle broken and muddy water discharging. Requires immediate riser pipe replacement.',
      category: 'Water',
      priority: 'HIGH',
      status: 'Under Review',
      reportedBy: 'Mohan Lal',
      village: 'Rampur Gram Panchayat',
      ward: 'Ward 9',
      latitude: 26.8499,
      longitude: 80.9448,
      originalImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=60',
      citizenVerified: false,
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
  ];

  const colRef = collection(db, 'complaints');
  let added = 0;
  for (const item of sampleComplaints) {
    await addDoc(colRef, item);
    added++;
  }
  return added;
}

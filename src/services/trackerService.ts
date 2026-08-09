import { doc, setDoc, collection, query, where, getDocs, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { JobApplication, ApplicationStatus } from '../types/tracker';

const LOCAL_TRACKER_KEY = 'resumeforge_local_applications';

const MOCK_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-1',
    userId: 'mock-user',
    company: 'Stripe',
    role: 'Senior Full Stack Engineer',
    status: 'interview',
    salary: '$180,000 - $210,000',
    location: 'San Francisco, CA (Remote)',
    appliedAt: '2026-08-01',
    updatedAt: '2026-08-05',
    notes: 'Technical phone screen scheduled with Senior Director of Engineering.',
  },
  {
    id: 'app-2',
    userId: 'mock-user',
    company: 'Scale AI',
    role: 'Lead AI Application Engineer',
    status: 'applied',
    salary: '$190,000 - $220,000',
    location: 'San Francisco, CA',
    appliedAt: '2026-08-04',
    updatedAt: '2026-08-04',
  },
  {
    id: 'app-3',
    userId: 'mock-user',
    company: 'Vercel',
    role: 'Frontend Architect',
    status: 'offer',
    salary: '$200,000 + Equity',
    location: 'Remote',
    appliedAt: '2026-07-20',
    updatedAt: '2026-08-07',
    notes: 'Official offer received! Offer deadline August 15th.',
  },
];

/**
 * Fetch user job applications
 */
export async function getUserApplications(userId: string): Promise<JobApplication[]> {
  const saved = localStorage.getItem(`${LOCAL_TRACKER_KEY}_${userId}`);
  const localApps: JobApplication[] = saved ? JSON.parse(saved) : MOCK_APPLICATIONS;

  if (!isFirebaseConfigured) return localApps;

  try {
    const q = query(collection(db, 'applications'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const cloudApps: JobApplication[] = [];
    snap.forEach((docSnap) => {
      cloudApps.push({ id: docSnap.id, ...docSnap.data() } as JobApplication);
    });
    return cloudApps.length > 0 ? cloudApps : localApps;
  } catch (err) {
    console.warn('[trackerService] Firestore fetch warning:', err);
    return localApps;
  }
}

/**
 * Save or update job application
 */
export async function saveApplication(app: JobApplication): Promise<void> {
  app.updatedAt = new Date().toISOString();

  const saved = localStorage.getItem(`${LOCAL_TRACKER_KEY}_${app.userId}`);
  let list: JobApplication[] = saved ? JSON.parse(saved) : MOCK_APPLICATIONS;
  const idx = list.findIndex((a) => a.id === app.id);
  if (idx >= 0) {
    list[idx] = app;
  } else {
    list.unshift(app);
  }
  localStorage.setItem(`${LOCAL_TRACKER_KEY}_${app.userId}`, JSON.stringify(list));

  if (!isFirebaseConfigured) return;

  try {
    const docRef = doc(db, 'applications', app.id);
    await setDoc(docRef, {
      ...app,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('[trackerService] Firestore save warning:', err);
  }
}

/**
 * Update application Kanban status
 */
export async function updateApplicationStatus(
  userId: string,
  appId: string,
  newStatus: ApplicationStatus
): Promise<void> {
  const saved = localStorage.getItem(`${LOCAL_TRACKER_KEY}_${userId}`);
  let list: JobApplication[] = saved ? JSON.parse(saved) : MOCK_APPLICATIONS;
  const target = list.find((a) => a.id === appId);
  if (target) {
    target.status = newStatus;
    target.updatedAt = new Date().toISOString();
    localStorage.setItem(`${LOCAL_TRACKER_KEY}_${userId}`, JSON.stringify(list));

    if (isFirebaseConfigured) {
      const docRef = doc(db, 'applications', appId);
      await setDoc(docRef, { status: newStatus, updatedAt: serverTimestamp() }, { merge: true });
    }
  }
}

/**
 * Delete job application
 */
export async function deleteApplication(userId: string, appId: string): Promise<void> {
  const saved = localStorage.getItem(`${LOCAL_TRACKER_KEY}_${userId}`);
  if (saved) {
    let list: JobApplication[] = JSON.parse(saved);
    list = list.filter((a) => a.id !== appId);
    localStorage.setItem(`${LOCAL_TRACKER_KEY}_${userId}`, JSON.stringify(list));
  }

  if (!isFirebaseConfigured) return;

  try {
    const docRef = doc(db, 'applications', appId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('[trackerService] Could not delete application:', err);
  }
}

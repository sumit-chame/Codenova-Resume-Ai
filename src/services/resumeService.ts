import { doc, getDoc, setDoc, collection, query, where, getDocs, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { MasterProfile, ResumeData } from '../types/resume';

const MASTER_PROFILE_KEY = 'resumeforge_master_profile';
const LOCAL_RESUMES_KEY = 'resumeforge_local_resumes';

/**
 * Gets local mock master profile fallback
 */
function getLocalMasterProfile(userId: string): MasterProfile {
  const saved = localStorage.getItem(`${MASTER_PROFILE_KEY}_${userId}`);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // Fallback
    }
  }
  return {
    userId,
    personalInfo: {
      fullName: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      jobTitle: 'Senior Full Stack Engineer',
      summary:
        'Passionate software engineer with 5+ years of experience designing scalable web applications, microservices, and AI-assisted tools.',
      linkedin: 'https://linkedin.com/in/alexmorgan',
      github: 'https://github.com/alexmorgan',
    },
    experience: [
      {
        id: 'exp-1',
        company: 'Scale Tech Inc.',
        position: 'Senior Full Stack Developer',
        location: 'San Francisco, CA',
        startDate: '2022-03',
        endDate: 'Present',
        current: true,
        bullets: [
          'Architected real-time dashboard monitoring 50,000+ API requests/min using React, Node.js, and Redis.',
          'Reduced AWS infrastructure costs by 28% through automated Docker container orchestration.',
          'Mentored 4 junior engineers and led daily agile sprint planning.',
        ],
      },
      {
        id: 'exp-2',
        company: 'CloudWorks Labs',
        position: 'Software Engineer',
        location: 'Austin, TX',
        startDate: '2020-01',
        endDate: '2022-02',
        current: false,
        bullets: [
          'Built customer authentication microservice serving 2M active users with 99.99% uptime.',
          'Optimized SQL query performance, decreasing database latency by 45%.',
        ],
      },
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        startDate: '2016-08',
        endDate: '2020-05',
        current: false,
        gpa: '3.8 / 4.0',
      },
    ],
    projects: [
      {
        id: 'proj-1',
        name: 'AI Resume Analyzer',
        description: 'Open-source web app scanning resume PDF text against tech stack keywords.',
        technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Python'],
        bullets: ['Star count 450+ on GitHub', 'Parsed over 10,000 document uploads'],
      },
    ],
    skillCategories: [
      { name: 'Languages', skills: ['TypeScript', 'JavaScript', 'Python', 'Go', 'SQL'] },
      { name: 'Frameworks', skills: ['React', 'Node.js', 'Next.js', 'Express', 'Tailwind CSS'] },
      { name: 'Cloud & Tools', skills: ['AWS', 'Docker', 'Firebase', 'Git', 'PostgreSQL'] },
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        date: '2023-06',
      },
    ],
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Fetch user master profile
 */
export async function getMasterProfile(userId: string): Promise<MasterProfile> {
  if (!isFirebaseConfigured) {
    return getLocalMasterProfile(userId);
  }

  try {
    const docRef = doc(db, 'masterProfiles', userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as MasterProfile;
    } else {
      const defaultProfile = getLocalMasterProfile(userId);
      await saveMasterProfile(defaultProfile);
      return defaultProfile;
    }
  } catch (err) {
    console.warn('[resumeService] Firestore fetch failed, using local profile:', err);
    return getLocalMasterProfile(userId);
  }
}

/**
 * Save user master profile
 */
export async function saveMasterProfile(profile: MasterProfile): Promise<void> {
  profile.updatedAt = new Date().toISOString();
  localStorage.setItem(`${MASTER_PROFILE_KEY}_${profile.userId}`, JSON.stringify(profile));

  if (!isFirebaseConfigured) return;

  try {
    const docRef = doc(db, 'masterProfiles', profile.userId);
    await setDoc(docRef, {
      ...profile,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('[resumeService] Firestore save error:', err);
  }
}

/**
 * Fetch all resumes for a user
 */
export async function getUserResumes(userId: string): Promise<ResumeData[]> {
  const localStr = localStorage.getItem(`${LOCAL_RESUMES_KEY}_${userId}`);
  const localResumes: ResumeData[] = localStr ? JSON.parse(localStr) : [];

  if (!isFirebaseConfigured) return localResumes;

  try {
    const q = query(collection(db, 'resumes'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const cloudResumes: ResumeData[] = [];
    querySnapshot.forEach((docSnap) => {
      cloudResumes.push({ id: docSnap.id, ...docSnap.data() } as ResumeData);
    });
    return cloudResumes.length > 0 ? cloudResumes : localResumes;
  } catch (err) {
    console.warn('[resumeService] Failed to fetch resumes from cloud:', err);
    return localResumes;
  }
}

/**
 * Save or update a resume document
 */
export async function saveResume(resume: ResumeData): Promise<void> {
  resume.updatedAt = new Date().toISOString();

  // Save to local storage
  const localStr = localStorage.getItem(`${LOCAL_RESUMES_KEY}_${resume.userId}`);
  let list: ResumeData[] = localStr ? JSON.parse(localStr) : [];
  const idx = list.findIndex((r) => r.id === resume.id);
  if (idx >= 0) {
    list[idx] = resume;
  } else {
    list.unshift(resume);
  }
  localStorage.setItem(`${LOCAL_RESUMES_KEY}_${resume.userId}`, JSON.stringify(list));

  if (!isFirebaseConfigured) return;

  try {
    const docRef = doc(db, 'resumes', resume.id);
    await setDoc(docRef, {
      ...resume,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('[resumeService] Could not save resume to Firestore:', err);
  }
}

/**
 * Delete a resume by ID
 */
export async function deleteResume(userId: string, resumeId: string): Promise<void> {
  const localStr = localStorage.getItem(`${LOCAL_RESUMES_KEY}_${userId}`);
  if (localStr) {
    let list: ResumeData[] = JSON.parse(localStr);
    list = list.filter((r) => r.id !== resumeId);
    localStorage.setItem(`${LOCAL_RESUMES_KEY}_${userId}`, JSON.stringify(list));
  }

  if (!isFirebaseConfigured) return;

  try {
    const docRef = doc(db, 'resumes', resumeId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('[resumeService] Could not delete resume from Firestore:', err);
  }
}

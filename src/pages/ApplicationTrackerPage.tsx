import React, { useState, useEffect } from 'react';
import { Plus, Briefcase, DollarSign, Calendar, MapPin, Trash2, ArrowRight } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { getUserApplications, saveApplication, updateApplicationStatus, deleteApplication } from '../services/trackerService';
import { JobApplication, ApplicationStatus } from '../types/tracker';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../hooks/useToast';
import { Loader } from '../components/ui/Loader';

export const ApplicationTrackerPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [trackerMode, setTrackerMode] = useState<'jobs' | 'scholarships'>('jobs');

  const [newApp, setNewApp] = useState({
    company: '',
    role: '',
    salary: '$150,000 - $180,000',
    location: 'Remote',
    notes: '',
  });

  useEffect(() => {
    async function loadApps() {
      if (!currentUser) return;
      setLoading(true);
      try {
        const list = await getUserApplications(currentUser.uid);
        setApplications(list);
      } catch (err) {
        console.error('[Tracker] Load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadApps();
  }, [currentUser]);

  const handleCreateApp = async () => {
    if (!currentUser || !newApp.company || !newApp.role) {
      toastError('Missing Fields', 'Please specify Company Name and Role.');
      return;
    }

    const item: JobApplication = {
      id: `app-${Date.now()}`,
      userId: currentUser.uid,
      company: newApp.company,
      role: newApp.role,
      status: 'applied',
      salary: newApp.salary,
      location: newApp.location,
      notes: newApp.notes,
      appliedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
    };

    try {
      await saveApplication(item);
      setApplications((prev) => [item, ...prev]);
      setIsAddModalOpen(false);
      setNewApp({ company: '', role: '', salary: '$150,000 - $180,000', location: 'Remote', notes: '' });
      toastSuccess('Application Added!', `Tracking ${item.role} at ${item.company}`);
    } catch {
      toastError('Error', 'Could not save job application.');
    }
  };

  const handleMoveStatus = async (appId: string, targetStatus: ApplicationStatus) => {
    if (!currentUser) return;
    try {
      await updateApplicationStatus(currentUser.uid, appId, targetStatus);
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: targetStatus } : a))
      );
      toastSuccess('Status Updated', `Moved application to ${targetStatus.toUpperCase()}`);
    } catch {
      toastError('Error', 'Could not update application status.');
    }
  };

  const handleDelete = async (appId: string) => {
    if (!currentUser) return;
    try {
      await deleteApplication(currentUser.uid, appId);
      setApplications((prev) => prev.filter((a) => a.id !== appId));
      toastSuccess('Deleted', 'Application removed from tracker.');
    } catch {
      toastError('Error', 'Could not delete application.');
    }
  };

  if (loading) {
    return <Loader fullScreen text="Loading Job Application Tracker..." />;
  }

  const columns: { status: ApplicationStatus; title: string; badgeVariant: 'primary' | 'warning' | 'success' | 'danger' }[] = [
    { status: 'applied', title: 'Applied', badgeVariant: 'primary' },
    { status: 'interview', title: 'Interviewing', badgeVariant: 'warning' },
    { status: 'offer', title: 'Offer Received', badgeVariant: 'success' },
    { status: 'rejected', title: 'Archived', badgeVariant: 'danger' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Briefcase className="w-3.5 h-3.5" />
            JOB SEARCH KANBAN BOARD
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Application Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Track your active job applications across pipeline stages and link them to your tailored resume versions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={trackerMode === 'jobs' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setTrackerMode('jobs')}
          >
            Job Applications
          </Button>
          <Button
            variant={trackerMode === 'scholarships' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setTrackerMode('scholarships')}
          >
            Scholarship & Grant Deadlines
          </Button>
          <Button
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            {trackerMode === 'jobs' ? 'Track New Application' : 'Track New Grant'}
          </Button>
        </div>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {columns.map((col) => {
          const colApps = applications.filter((a) => a.status === col.status);
          return (
            <div key={col.status} className="space-y-4">
              {/* Column Header */}
              <div className="p-3 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-100">{col.title}</h3>
                  <Badge variant={col.badgeVariant} size="sm">
                    {colApps.length}
                  </Badge>
                </div>
              </div>

              {/* Column Application Cards */}
              <div className="space-y-3 min-h-[300px]">
                {colApps.length === 0 ? (
                  <div className="p-6 rounded-2xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
                    No applications in {col.title}
                  </div>
                ) : (
                  colApps.map((app) => (
                    <Card key={app.id} className="p-4 space-y-3 hover:border-slate-700 transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-100">{app.company}</h4>
                          <p className="text-xs font-semibold text-indigo-400">{app.role}</p>
                        </div>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="text-slate-400 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {app.salary && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <DollarSign className="w-3 h-3 text-emerald-400" />
                          <span>{app.salary}</span>
                        </div>
                      )}

                      {app.location && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <MapPin className="w-3 h-3 text-indigo-400" />
                          <span>{app.location}</span>
                        </div>
                      )}

                      {app.notes && (
                        <p className="text-[11px] text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800 leading-relaxed">
                          {app.notes}
                        </p>
                      )}

                      {/* Status Shift Buttons */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1 text-[10px]">
                        {col.status !== 'applied' && (
                          <button
                            onClick={() => handleMoveStatus(app.id, 'applied')}
                            className="text-slate-400 hover:text-white"
                          >
                            ← Applied
                          </button>
                        )}
                        {col.status !== 'interview' && (
                          <button
                            onClick={() => handleMoveStatus(app.id, 'interview')}
                            className="text-amber-400 hover:text-amber-300 font-semibold"
                          >
                            Interviewing →
                          </button>
                        )}
                        {col.status !== 'offer' && (
                          <button
                            onClick={() => handleMoveStatus(app.id, 'offer')}
                            className="text-emerald-400 hover:text-emerald-300 font-semibold"
                          >
                            Offer 🎉
                          </button>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Application Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Track New Job Application"
        description="Record company details to manage your interview pipeline."
      >
        <div className="space-y-4 pt-2">
          <Input
            label="Company Name"
            placeholder="e.g. Stripe, Scale AI"
            value={newApp.company}
            onChange={(e) => setNewApp({ ...newApp, company: e.target.value })}
          />
          <Input
            label="Target Job Role"
            placeholder="e.g. Senior Full Stack Engineer"
            value={newApp.role}
            onChange={(e) => setNewApp({ ...newApp, role: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Salary Range"
              value={newApp.salary}
              onChange={(e) => setNewApp({ ...newApp, salary: e.target.value })}
            />
            <Input
              label="Location"
              value={newApp.location}
              onChange={(e) => setNewApp({ ...newApp, location: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300 uppercase tracking-wide">Notes</label>
            <textarea
              rows={3}
              placeholder="e.g. Referred by Sarah; recruiter screen next Tuesday..."
              value={newApp.notes}
              onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 text-slate-100 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <Button variant="primary" className="w-full justify-center" onClick={handleCreateApp}>
            Save Application
          </Button>
        </div>
      </Modal>
    </div>
  );
};

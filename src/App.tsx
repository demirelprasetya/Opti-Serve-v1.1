import React, { useState, useEffect } from 'react';
import { InspectionRecord, InspectionStatus, UserRole, ServiceCategory } from './types';
import { INITIAL_INSPECTIONS } from './data/mockData';
import { Header } from './components/Header';
import { LoginScreen } from './components/LoginScreen';
import { StaffInspectionWizard } from './components/StaffInspectionWizard';
import { SupervisorReview } from './components/SupervisorReview';
import { InspectionList } from './components/InspectionList';
import { AnalyticsSummary } from './components/AnalyticsSummary';
import { InspectionDetailModal } from './components/InspectionDetailModal';
import { MobilePwaShell } from './components/MobilePwaShell';
import { OptiViewDashboard } from './components/optiview/OptiViewDashboard';
import { PortalGateway } from './components/PortalGateway';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { db } from './lib/firebase';
import { FIRESTORE_COLLECTIONS } from './constants/firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc } from 'firebase/firestore';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [appMode, setAppMode] = useState<'gateway' | 'inspect' | 'optiview'>('gateway');
  const [userName, setUserName] = useState<string>('Andi CS');
  const [currentRole, setCurrentRole] = useState<UserRole>('staff');
  const [userServiceType, setUserServiceType] = useState<ServiceCategory | undefined>('cleaning');
  
  const [inspections, setInspections] = useState<InspectionRecord[]>(INITIAL_INSPECTIONS);
  const [activeTab, setActiveTab] = useState<'new-inspection' | 'inspection-list' | 'supervisor-review' | 'analytics'>('new-inspection');
  
  const [selectedModalInspection, setSelectedModalInspection] = useState<InspectionRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Synchronize Firestore Realtime Listener
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const colRef = collection(db, FIRESTORE_COLLECTIONS.INSPECTIONS);
      unsubscribe = onSnapshot(colRef, async (snapshot) => {
        if (!snapshot.empty) {
          const records = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as InspectionRecord[];
          
          // Sort by submittedAt descending
          records.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
          setInspections(records);
        } else {
          // If Firestore collection is empty, seed with initial inspection data
          for (const item of INITIAL_INSPECTIONS) {
            try {
              await setDoc(doc(db, FIRESTORE_COLLECTIONS.INSPECTIONS, item.id), item);
            } catch (seedErr) {
              console.warn('Gagal seeding dokumen ke Firestore:', seedErr);
            }
          }
        }
      }, (err) => {
        console.warn('Firestore listener error, fallback to Express API:', err);
      });
    } catch (err) {
      console.warn('Gagal menginisialisasi Firestore listener:', err);
    }

    // Also fetch initial inspections from Express backend as fallback/complement
    const fetchInspections = async () => {
      try {
        const res = await fetch('/api/inspections');
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setInspections((prev) => (prev.length > 0 ? prev : data.data));
        }
      } catch (err) {
        console.warn('Gagal memuat inspeksi dari server backend:', err);
      }
    };
    fetchInspections();

    return () => unsubscribe();
  }, []);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleLoginSuccess = (role: UserRole, user: string, serviceType?: ServiceCategory) => {
    setCurrentRole(role);
    setUserName(user);
    setUserServiceType(serviceType);
    setIsLoggedIn(true);
    setAppMode('gateway');
    if (role === 'supervisor') {
      setActiveTab('supervisor-review');
    } else {
      setActiveTab('new-inspection');
    }
    showToast(`Selamat datang, ${user.split(' ')[0]}! Berhasil masuk.`, 'success');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAppMode('gateway');
    showToast('Berhasil keluar dari akun.', 'info');
  };

  // Handle new inspection submission
  const handleInspectionSubmitted = async (newRecord: InspectionRecord) => {
    // 1. Save to Firestore
    try {
      await setDoc(doc(db, FIRESTORE_COLLECTIONS.INSPECTIONS, newRecord.id), newRecord);
    } catch (fsErr) {
      console.warn('Gagal menyimpan langsung ke Firestore:', fsErr);
    }

    // 2. Save to Express backend
    try {
      const res = await fetch('/api/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setInspections((prev) => [data.data, ...prev.filter(i => i.id !== newRecord.id)]);
      } else {
        setInspections((prev) => [newRecord, ...prev.filter(i => i.id !== newRecord.id)]);
      }
    } catch (err) {
      setInspections((prev) => [newRecord, ...prev.filter(i => i.id !== newRecord.id)]);
    }

    showToast(`Inspeksi ${newRecord.ticketNumber} berhasil dikirim dan tersimpan di Firebase!`, 'success');
    
    if (currentRole === 'supervisor') {
      setActiveTab('supervisor-review');
    } else {
      setActiveTab('inspection-list');
    }
  };

  // Handle Supervisor Decision
  const handleUpdateStatus = async (
    id: string,
    status: InspectionStatus,
    supervisorNotes?: string,
    requiredCorrection?: string,
    deadline?: string
  ) => {
    const updatedDecision = {
      status,
      supervisorDecision: {
        status: status === 'approved' ? ('approved' as const) : ('revision' as const),
        reviewerName: userName || 'Supervisor Budi Santoso',
        reviewedAt: new Date().toISOString(),
        notes: supervisorNotes,
        requiredCorrection,
        deadline
      }
    };

    // 1. Update in Firestore
    try {
      await updateDoc(doc(db, FIRESTORE_COLLECTIONS.INSPECTIONS, id), {
        status,
        supervisorDecision: updatedDecision.supervisorDecision
      });
    } catch (fsErr) {
      console.warn('Gagal update status di Firestore:', fsErr);
    }

    // 2. Update Express backend
    try {
      await fetch(`/api/inspections/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDecision)
      });
    } catch (err) {
      console.warn('Gagal sinkronisasi status ke server:', err);
    }

    setInspections((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status,
            supervisorDecision: updatedDecision.supervisorDecision
          };
        }
        return item;
      })
    );

    const statusText = status === 'approved' ? 'Disetujui' : 'Perlu Perbaikan';
    showToast(`Keputusan dikonfirmasi: Status diperbarui menjadi "${statusText}" (Tersimpan di Firebase)`, 'info');
  };

  // Handle Staff Revision Resubmission
  const handleResubmitRevision = async (
    id: string,
    newAfterPhotoUrl: string,
    resubmissionNotes: string
  ) => {
    const resubmittedAt = new Date().toISOString();
    const updatePayload = {
      status: 'resubmitted' as const,
      afterPhotoUrl: newAfterPhotoUrl || undefined,
      afterPhotoTimestamp: resubmittedAt,
      resubmissionNotes,
      resubmittedAt,
      resubmittedPhotoUrl: newAfterPhotoUrl
    };

    // 1. Update in Firestore
    try {
      const cleanUpdatePayload: Record<string, any> = {
        status: 'resubmitted',
        afterPhotoTimestamp: resubmittedAt,
        resubmissionNotes,
        resubmittedAt,
        resubmittedPhotoUrl: newAfterPhotoUrl
      };
      if (newAfterPhotoUrl) {
        cleanUpdatePayload.afterPhotoUrl = newAfterPhotoUrl;
      }
      await updateDoc(doc(db, FIRESTORE_COLLECTIONS.INSPECTIONS, id), cleanUpdatePayload);
    } catch (fsErr) {
      console.warn('Gagal update revisi di Firestore:', fsErr);
    }

    // 2. Update Express backend
    try {
      await fetch(`/api/inspections/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      });
    } catch (err) {
      console.warn('Gagal sinkronisasi revisi ke server:', err);
    }

    setInspections((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: 'resubmitted',
            afterPhotoUrl: newAfterPhotoUrl || item.afterPhotoUrl,
            afterPhotoTimestamp: resubmittedAt,
            resubmissionNotes,
            resubmittedAt,
            resubmittedPhotoUrl: newAfterPhotoUrl
          };
        }
        return item;
      })
    );

    if (selectedModalInspection?.id === id) {
      setSelectedModalInspection((prev) =>
        prev
          ? {
              ...prev,
              status: 'resubmitted',
              afterPhotoUrl: newAfterPhotoUrl || prev.afterPhotoUrl,
              afterPhotoTimestamp: resubmittedAt,
              resubmissionNotes,
              resubmittedAt,
              resubmittedPhotoUrl: newAfterPhotoUrl
            }
          : null
      );
    }

    showToast(`Hasil perbaikan berhasil dikirim ulang ke Supervisor!`, 'success');
  };

  const pendingReviewCount = inspections
    .filter((i) => !userServiceType || i.serviceType === userServiceType)
    .filter((i) => i.status === 'pending' || i.status === 'resubmitted').length;

  const staffRevisionCount = inspections
    .filter((i) => !userServiceType || i.serviceType === userServiceType)
    .filter((i) => i.status === 'revision').length;

  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  if (appMode === 'gateway') {
    return (
      <PortalGateway
        userName={userName}
        userRole={currentRole}
        onSelectPortal={(portal) => setAppMode(portal)}
        onLogout={handleLogout}
      />
    );
  }

  if (appMode === 'optiview') {
    return (
      <OptiViewDashboard
        inspections={inspections}
        onSwitchToOptiInspect={() => setAppMode('inspect')}
        onGoToGateway={() => setAppMode('gateway')}
        userName={userName}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col antialiased selection:bg-blue-500 selection:text-white">
      
      {/* Mobile PWA Native Top Banner & Bottom Bar */}
      <MobilePwaShell
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userRole={currentRole}
        pendingReviewCount={pendingReviewCount}
        revisionCount={staffRevisionCount}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-16 sm:top-20 right-3 sm:right-4 z-50 animate-bounce max-w-xs sm:max-w-md">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3 text-xs font-bold">
            {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toastMessage.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
            {toastMessage.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <Header
        currentRole={currentRole}
        userName={userName}
        onRoleChange={(role) => {
          setCurrentRole(role);
          if (role === 'supervisor') {
            setActiveTab('supervisor-review');
          } else {
            setActiveTab('new-inspection');
          }
        }}
        onLogout={handleLogout}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingReviewCount={pendingReviewCount}
        revisionCount={staffRevisionCount}
        onSwitchToOptiView={() => setAppMode('optiview')}
        onGoToGateway={() => setAppMode('gateway')}
      />

      {/* Main App Container */}
      <main className="flex-1 pb-28 md:pb-12">
        {activeTab === 'new-inspection' && (
          <StaffInspectionWizard
            onInspectionSubmitted={handleInspectionSubmitted}
            staffName={userName}
            userServiceType={userServiceType}
            existingInspections={inspections}
          />
        )}

        {activeTab === 'supervisor-review' && (
          <SupervisorReview
            inspections={inspections}
            onUpdateStatus={handleUpdateStatus}
            supervisorName={userName}
            userServiceType={userServiceType}
          />
        )}

        {activeTab === 'inspection-list' && (
          <InspectionList
            inspections={inspections}
            onSelectInspection={(record) => setSelectedModalInspection(record)}
            userServiceType={userServiceType}
            onResubmitRevision={handleResubmitRevision}
            userRole={currentRole}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsSummary
            inspections={inspections}
            userServiceType={userServiceType}
          />
        )}
      </main>

      {/* Inspection Detail Modal */}
      <InspectionDetailModal
        record={selectedModalInspection}
        onClose={() => setSelectedModalInspection(null)}
        onResubmitRevision={handleResubmitRevision}
        userRole={currentRole}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-4 border-t border-slate-800 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Opti-Inspect — Building Service Inspection System</p>
          <p className="text-slate-500">Opti-View AI Verified</p>
        </div>
      </footer>

    </div>
  );
}

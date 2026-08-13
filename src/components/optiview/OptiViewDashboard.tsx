import React, { useState } from 'react';
import { InspectionRecord } from '../../types';
import { 
  DEFAULT_KPI_SUMMARY, 
  INITIAL_PRIORITY_ISSUES, 
  INITIAL_EXECUTIVE_INSIGHT, 
  PERFORMANCE_TREND_30_DAYS, 
  OPTI_VIEW_AREAS, 
  OPTI_VIEW_VENDORS, 
  INITIAL_ACTION_ITEMS, 
  INITIAL_NOTIFICATIONS 
} from '../../data/optiViewData';
import { OptiViewHeader } from './OptiViewHeader';
import { OptiViewSidebar, OptiViewTab } from './OptiViewSidebar';
import { OptiViewBeranda } from './OptiViewBeranda';
import { OptiViewKinerja } from './OptiViewKinerja';
import { OptiViewAreaPage } from './OptiViewArea';
import { OptiViewVendorPage } from './OptiViewVendor';
import { OptiViewRiwayatPage } from './OptiViewRiwayat';
import { OptiViewLaporanPage } from './OptiViewLaporan';
import { OptiViewTindakanPage } from './OptiViewTindakan';
import { OptiViewSettingsPage } from './OptiViewSettings';
import { InspectionDetailModal } from '../InspectionDetailModal';

interface OptiViewDashboardProps {
  inspections: InspectionRecord[];
  onSwitchToOptiInspect: () => void;
  onGoToGateway?: () => void;
  userName?: string;
}

export const OptiViewDashboard: React.FC<OptiViewDashboardProps> = ({
  inspections,
  onSwitchToOptiInspect,
  onGoToGateway,
  userName = 'Muhamad Demirel',
}) => {
  const [activeTab, setActiveTab] = useState<OptiViewTab>('beranda');
  const [currentBuilding, setCurrentBuilding] = useState<string>('Opti-Inspect Building (Pusat)');
  const [dateRangeText, setDateRangeText] = useState<string>('20 Mei 2025 - 26 Mei 2025');

  // States for interactive data
  const [kpiSummary] = useState(DEFAULT_KPI_SUMMARY);
  const [priorityIssues] = useState(INITIAL_PRIORITY_ISSUES);
  const [executiveInsight] = useState(INITIAL_EXECUTIVE_INSIGHT);
  const [actionItems, setActionItems] = useState(INITIAL_ACTION_ITEMS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  
  // Specific area selected for Area detail view
  const [selectedAreaName, setSelectedAreaName] = useState<string | null>(null);
  const [selectedInspectionModal, setSelectedInspectionModal] = useState<InspectionRecord | null>(null);

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleNavigateFromNotification = (targetTab?: string, targetArea?: string) => {
    if (targetArea) {
      setSelectedAreaName(targetArea);
      setActiveTab('area');
    } else if (targetTab === 'area-detail') {
      setActiveTab('area');
    } else if (targetTab === 'resource-efficiency') {
      setActiveTab('kinerja');
    } else if (targetTab === 'inspection-history') {
      setActiveTab('riwayat');
    }
  };

  const handleSelectIssueArea = (areaName: string) => {
    setSelectedAreaName(areaName);
    setActiveTab('area');
  };

  const handleUpdateActionStatus = (id: string, newStatus: 'Belum Dimulai' | 'Proses' | 'Selesai') => {
    setActionItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const handleAddActionItem = (newItem: any) => {
    setActionItems((prev) => [newItem, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased">
      
      {/* Top Fixed Opti-View Management Header */}
      <OptiViewHeader
        currentBuilding={currentBuilding}
        onSelectBuilding={setCurrentBuilding}
        dateRangeText={dateRangeText}
        onSelectDateRangeText={setDateRangeText}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onNavigateFromNotification={handleNavigateFromNotification}
        onSwitchToOptiInspect={onSwitchToOptiInspect}
        onGoToGateway={onGoToGateway}
      />

      {/* Main Body with Sidebar + Active View Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        
        {/* Left Navigation Sidebar */}
        <OptiViewSidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab !== 'area') setSelectedAreaName(null);
          }}
          onSwitchToOptiInspect={onSwitchToOptiInspect}
        />

        {/* Right Active View Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'beranda' && (
            <OptiViewBeranda
              userName={userName}
              kpiSummary={kpiSummary}
              priorityIssues={priorityIssues}
              executiveInsight={executiveInsight}
              trendData={PERFORMANCE_TREND_30_DAYS}
              onSelectIssueArea={handleSelectIssueArea}
              onSelectKpiDimension={() => setActiveTab('kinerja')}
              onNavigateToTrendAnalysis={() => setActiveTab('kinerja')}
              onNavigateToInsightDetail={() => setActiveTab('tindakan')}
              onNavigateToAllIssues={() => setActiveTab('tindakan')}
            />
          )}

          {activeTab === 'kinerja' && (
            <OptiViewKinerja
              kpiSummary={kpiSummary}
              areas={OPTI_VIEW_AREAS}
              onSelectAreaDetail={handleSelectIssueArea}
            />
          )}

          {activeTab === 'area' && (
            <OptiViewAreaPage
              areas={OPTI_VIEW_AREAS}
              inspections={inspections}
              actions={actionItems}
              selectedAreaName={selectedAreaName}
              onClearSelectedArea={() => setSelectedAreaName(null)}
              onSelectInspectionDetail={(record) => setSelectedInspectionModal(record)}
            />
          )}

          {activeTab === 'vendor' && (
            <OptiViewVendorPage
              vendors={OPTI_VIEW_VENDORS}
            />
          )}

          {activeTab === 'riwayat' && (
            <OptiViewRiwayatPage
              inspections={inspections}
              onSelectInspectionDetail={(record) => setSelectedInspectionModal(record)}
            />
          )}

          {activeTab === 'laporan' && (
            <OptiViewLaporanPage />
          )}

          {activeTab === 'tindakan' && (
            <OptiViewTindakanPage
              actions={actionItems}
              onUpdateActionStatus={handleUpdateActionStatus}
              onAddAction={handleAddActionItem}
            />
          )}

          {activeTab === 'pengaturan' && (
            <OptiViewSettingsPage />
          )}
        </main>

      </div>

      {/* Detail Inspection Modal */}
      {selectedInspectionModal && (
        <InspectionDetailModal
          record={selectedInspectionModal}
          onClose={() => setSelectedInspectionModal(null)}
          userRole="supervisor"
        />
      )}

    </div>
  );
};

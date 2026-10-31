import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ServerProvider } from './context/ServerContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/home/HeroSection';
import { FeaturesSection } from './components/home/FeaturesSection';
import { PricingSection } from './components/home/PricingSection';
import { SoftwareSection } from './components/home/SoftwareSection';
import { LocationsSection } from './components/home/LocationsSection';
import { TestimonialsSection } from './components/home/TestimonialsSection';
import { DiscordCommunitySection } from './components/home/DiscordCommunitySection';
import { FaqSection } from './components/home/FaqSection';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { MyServersPage } from './components/dashboard/MyServersPage';
import { CreateServerPage } from './components/dashboard/CreateServerPage';
import { ServerConsolePage } from './components/dashboard/ServerConsolePage';
import { FileManagerPage } from './components/dashboard/FileManagerPage';
import { PluginManagerPage } from './components/dashboard/PluginManagerPage';
import { BackupManagerPage } from './components/dashboard/BackupManagerPage';
import { ServerSettingsPage } from './components/dashboard/ServerSettingsPage';
import { BillingPage } from './components/dashboard/BillingPage';
import { SupportPage } from './components/dashboard/SupportPage';
import { AccountSettingsPage } from './components/dashboard/AccountSettingsPage';
import { AdminPanelPage } from './components/dashboard/AdminPanelPage';
import { ShadowAiPage } from './components/dashboard/ShadowAiPage';
import {
  LiveMonitorPage,
  ShadowAiBuilderPage,
  CrashRecoveryPage,
  CloudBackupPage,
  MarketplacePage,
  MobileControlPanelPage,
  SubusersPage,
  StartupManagerPage,
  VersionSwitcherPage,
  WorldManagerPage,
  DatabaseManagerPage,
  ScheduledTasksPage,
  PlayerAnalyticsPage,
  AccessControlPage,
  JavaSelectorPage,
  ModpackInstallerPage,
  ServerCloningPage,
  JvmManagerPage,
  NetworkAnalyticsPage,
  ServerMigrationPage,
  AnnouncementCenterPage,
  ReferralRewardsPage,
  MaintenanceModePage,
  PublicStatusPage,
  ShadowShieldPage,
} from './components/dashboard/modules';
import { HostingPlan } from './types';

function AppContent() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [preSelectedPlanId, setPreSelectedPlanId] = useState<string | undefined>(undefined);
  const { logout } = useAuth();

  const handleSelectPlan = (plan: HostingPlan) => {
    setPreSelectedPlanId(plan.id);
    setCurrentView('dashboard-create');
  };

  const handleDashboardTabChange = (tabId: string) => {
    setCurrentView(`dashboard-${tabId}`);
  };

  // If in dashboard view
  const isDashboard = currentView.startsWith('dashboard-');
  const dashboardTab = isDashboard ? currentView.replace('dashboard-', '') : 'overview';

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 flex flex-col selection:bg-purple-900 selection:text-white">
      {/* If not in dashboard, render public Navbar */}
      {!isDashboard && (
        <Navbar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
        />
      )}

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <div className="space-y-4">
            <HeroSection
              onGetStartedFree={() => setCurrentView('register')}
              onViewPlans={() => {
                const el = document.getElementById('plans');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <FeaturesSection />
            <PricingSection onSelectPlan={handleSelectPlan} />
            <SoftwareSection onSelectSoftware={() => setCurrentView('dashboard-create')} />
            <LocationsSection />
            <TestimonialsSection />
            <DiscordCommunitySection />
            <FaqSection />
          </div>
        )}

        {currentView === 'status' && (
          <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-6">
            <PublicStatusPage />
          </div>
        )}

        {currentView === 'login' && (
          <LoginPage onNavigate={(view) => setCurrentView(view)} />
        )}

        {currentView === 'register' && (
          <RegisterPage onNavigate={(view) => setCurrentView(view)} />
        )}

        {currentView === 'forgot-password' && (
          <ForgotPasswordPage onNavigate={(view) => setCurrentView(view)} />
        )}

        {/* Dashboard Views wrapped in DashboardLayout */}
        {isDashboard && (
          <DashboardLayout
            currentTab={dashboardTab}
            onSelectTab={handleDashboardTabChange}
            onNavigateHome={() => setCurrentView('home')}
          >
            {dashboardTab === 'overview' && (
              <DashboardOverview onNavigateTab={handleDashboardTabChange} />
            )}
            {dashboardTab === 'ai' && (
              <ShadowAiPage onNavigateTab={handleDashboardTabChange} />
            )}
            {dashboardTab === 'servers' && (
              <MyServersPage onNavigateTab={handleDashboardTabChange} />
            )}
            {dashboardTab === 'create' && (
              <CreateServerPage
                preSelectedPlanId={preSelectedPlanId}
                onServerCreated={() => setCurrentView('dashboard-console')}
              />
            )}
            {dashboardTab === 'console' && <ServerConsolePage />}
            {dashboardTab === 'files' && <FileManagerPage />}
            {dashboardTab === 'plugins' && <PluginManagerPage />}
            {dashboardTab === 'backups' && <BackupManagerPage />}
            {dashboardTab === 'settings' && <ServerSettingsPage />}
            {dashboardTab === 'billing' && <BillingPage />}
            {dashboardTab === 'support' && <SupportPage />}
            {dashboardTab === 'account' && (
              <AccountSettingsPage
                onLogout={() => {
                  logout();
                  setCurrentView('home');
                }}
              />
            )}
            {dashboardTab === 'admin' && <AdminPanelPage />}

            {/* ======================================= */}
            {/* 25 ADVANCED MODULE VIEWS                */}
            {/* ======================================= */}
            {dashboardTab === 'live-monitor' && <LiveMonitorPage />}
            {dashboardTab === 'ai-builder' && <ShadowAiBuilderPage />}
            {dashboardTab === 'crash-recovery' && <CrashRecoveryPage />}
            {dashboardTab === 'cloud-backup' && <CloudBackupPage />}
            {dashboardTab === 'marketplace' && <MarketplacePage />}
            {dashboardTab === 'mobile' && <MobileControlPanelPage />}
            {dashboardTab === 'subusers' && <SubusersPage />}
            {dashboardTab === 'startup' && <StartupManagerPage />}
            {dashboardTab === 'version-switcher' && <VersionSwitcherPage />}
            {dashboardTab === 'worlds' && <WorldManagerPage />}
            {dashboardTab === 'database' && <DatabaseManagerPage />}
            {dashboardTab === 'schedules' && <ScheduledTasksPage />}
            {dashboardTab === 'player-analytics' && <PlayerAnalyticsPage />}
            {dashboardTab === 'access-control' && <AccessControlPage />}
            {dashboardTab === 'java-version' && <JavaSelectorPage />}
            {dashboardTab === 'modpacks' && <ModpackInstallerPage />}
            {dashboardTab === 'clone' && <ServerCloningPage />}
            {dashboardTab === 'jvm' && <JvmManagerPage />}
            {dashboardTab === 'network' && <NetworkAnalyticsPage />}
            {dashboardTab === 'migration' && <ServerMigrationPage />}
            {dashboardTab === 'announcements' && <AnnouncementCenterPage />}
            {dashboardTab === 'referrals' && <ReferralRewardsPage />}
            {dashboardTab === 'maintenance' && <MaintenanceModePage />}
            {dashboardTab === 'status' && <PublicStatusPage />}
            {dashboardTab === 'shield' && <ShadowShieldPage />}
          </DashboardLayout>
        )}
      </main>

      {/* If not in dashboard, render public Footer */}
      {!isDashboard && (
        <Footer onNavigate={(view) => setCurrentView(view)} />
      )}
    </div>

  );
}

export default function App() {
  return (
    <AuthProvider>
      <ServerProvider>
        <AppContent />
      </ServerProvider>
    </AuthProvider>
  );
}

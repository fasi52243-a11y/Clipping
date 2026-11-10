import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { AiClipGeneratorPage } from './pages/AiClipGeneratorPage';
import { VideoEditorPage } from './pages/VideoEditorPage';
import { ProcessingPage } from './pages/ProcessingPage';
import { ClipsLibraryPage } from './pages/ClipsLibraryPage';
import { DashboardPage } from './pages/DashboardPage';
import { MyProjectsPage } from './pages/MyProjectsPage';
import { BrandTemplatesPage } from './pages/BrandTemplatesPage';
import { PricingPage } from './pages/PricingPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { HelpCenterPage } from './pages/HelpCenterPage';
import { ContactPage } from './pages/ContactPage';
import { AccountSettingsPage } from './pages/AccountSettingsPage';
import { DemoWorkspacePage } from './pages/DemoWorkspacePage';
import { AuthPage } from './pages/AuthPages';
import { LegalPage } from './pages/LegalPages';

function Router() {
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Parse path and query parameters from hash
  const hashClean = currentHash.replace(/^#\/?/, '');
  const [pathPart, queryPart] = hashClean.split('?');
  const pathSegments = pathPart ? pathPart.split('/') : [];
  const primaryRoute = pathSegments[0] || '';
  const routeParam = pathSegments[1] || '';

  // Parse query string if present (e.g., ?projectId=...)
  const queryParams = new URLSearchParams(queryPart || '');
  const projectIdFromQuery = queryParams.get('projectId') || routeParam;

  // Render view based on route
  const renderPage = () => {
    switch (primaryRoute) {
      case '':
        return <HomePage />;
      case 'generate':
        return <AiClipGeneratorPage />;
      case 'editor':
        return <VideoEditorPage projectId={projectIdFromQuery} />;
      case 'processing':
        return <ProcessingPage projectId={projectIdFromQuery} />;
      case 'library':
        return <ClipsLibraryPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'projects':
        return <MyProjectsPage />;
      case 'templates':
        return <BrandTemplatesPage />;
      case 'pricing':
        return <PricingPage />;
      case 'features':
        return <FeaturesPage />;
      case 'help':
        return <HelpCenterPage />;
      case 'contact':
        return <ContactPage />;
      case 'settings':
        return <AccountSettingsPage />;
      case 'login':
        return <AuthPage mode="login" />;
      case 'signup':
        return <AuthPage mode="signup" />;
      case 'forgot-password':
        return <AuthPage mode="forgot" />;
      case 'workspace':
        return <DemoWorkspacePage type="workspace" />;
      case 'billing':
        return <DemoWorkspacePage type="billing" />;
      case 'admin':
        return <DemoWorkspacePage type="admin" />;
      case 'privacy':
        return <LegalPage type="privacy" />;
      case 'terms':
        return <LegalPage type="terms" />;
      default:
        return <HomePage />;
    }
  };

  // Only hide standard footer in video studio mode for full-height editor canvas
  const isEditorMode = primaryRoute === 'editor';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <main className="flex-1">{renderPage()}</main>
      {!isEditorMode && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}

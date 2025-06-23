import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { 
  Sidebar, 
  ConversationsPage, 
  ContactsPage, 
  ReportsPage, 
  CampaignsPage 
} from './components';
import { DatabaseDebug } from './DatabaseDebug';

function App() {
  const [activeRoute, setActiveRoute] = useState('conversations');

  return (
    <div className="App flex h-screen bg-gray-50">
      <BrowserRouter>
        <Routes>
          {/* Debug route (standalone) */}
          <Route path="/debug" element={<DatabaseDebug />} />
          
          {/* Main app routes */}
          <Route path="/*" element={
            <>
              <Sidebar activeRoute={activeRoute} setActiveRoute={setActiveRoute} />
              <div className="flex-1 flex flex-col">
                <Routes>
                  <Route path="/" element={<Navigate to="/conversations" replace />} />
                  <Route path="/conversations" element={<ConversationsPage />} />
                  <Route path="/contacts" element={<ContactsPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/campaigns" element={<CampaignsPage />} />
                </Routes>
              </div>
            </>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
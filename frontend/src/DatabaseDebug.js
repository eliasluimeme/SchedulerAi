import React, { useState, useEffect } from 'react';
import { supabaseHelpers } from './supabase';
import { Database, RefreshCw, Plus, Eye, AlertCircle } from 'lucide-react';

export const DatabaseDebug = () => {
  const [clients, setClients] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('unknown');

  useEffect(() => {
    testConnection();
    loadAllData();
  }, []);

  const testConnection = async () => {
    setLoading(true);
    const isConnected = await supabaseHelpers.testConnection();
    setConnectionStatus(isConnected ? 'connected' : 'disconnected');
    setLoading(false);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [clientsData, chatData, statsData] = await Promise.all([
        supabaseHelpers.getClients(),
        supabaseHelpers.getChatHistory(),
        supabaseHelpers.getConversationStats()
      ]);
      
      setClients(clientsData);
      setChatHistory(chatData);
      setStats(statsData);
      
      // Debug table structure
      await supabaseHelpers.getTableInfo('clients');
      await supabaseHelpers.getTableInfo('n8n_chat_history');
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSampleData = async () => {
    setLoading(true);
    try {
      await supabaseHelpers.addSampleData();
      await loadAllData();
    } catch (error) {
      console.error('Error adding sample data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Database className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-semibold text-gray-900">Database Debug Panel</h1>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                connectionStatus === 'connected' 
                  ? 'bg-green-100 text-green-800' 
                  : connectionStatus === 'disconnected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {connectionStatus === 'connected' ? '● Connected' : 
                 connectionStatus === 'disconnected' ? '● Disconnected' : '● Testing...'}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={testConnection}
                disabled={loading}
                className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Test Connection
              </button>
              
              <button
                onClick={loadAllData}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh Data
              </button>
              
              <button
                onClick={addSampleData}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Sample Data
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Clients</h3>
            <p className="text-3xl font-bold text-gray-900">{clients.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Conversations</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.total || 0}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Open Conversations</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.open || 0}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Today's Conversations</h3>
            <p className="text-3xl font-bold text-green-600">{stats.today || 0}</p>
          </div>
        </div>

        {/* Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Clients Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Clients Table ({clients.length})</h2>
            </div>
            <div className="p-6">
              {clients.length > 0 ? (
                <div className="space-y-4">
                  {clients.slice(0, 5).map((client, index) => (
                    <div key={client.id || index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{client.name || 'No Name'}</h4>
                          <p className="text-sm text-gray-600">{client.email}</p>
                          {client.phone && <p className="text-sm text-gray-500">{client.phone}</p>}
                          {client.company && <p className="text-xs text-gray-500">{client.company}</p>}
                        </div>
                        <span className="text-xs text-gray-400">
                          {client.created_at ? new Date(client.created_at).toLocaleDateString() : 'Unknown'}
                        </span>
                      </div>
                    </div>
                  ))}
                  {clients.length > 5 && (
                    <p className="text-sm text-gray-500 text-center">
                      ... and {clients.length - 5} more clients
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No clients found</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat History Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Chat History ({chatHistory.length})</h2>
            </div>
            <div className="p-6">
              {chatHistory.length > 0 ? (
                <div className="space-y-4">
                  {chatHistory.slice(0, 5).map((chat, index) => (
                    <div key={chat.id || index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {chat.user_name || chat.sender || 'Unknown User'}
                          </h4>
                          <p className="text-sm text-gray-600 truncate">
                            {chat.message || chat.user_message || chat.content || 'No message'}
                          </p>
                          <div className="flex items-center mt-2 space-x-2">
                            {chat.status && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {chat.status}
                              </span>
                            )}
                            {chat.session_id && (
                              <span className="text-xs text-gray-400">
                                Session: {chat.session_id.slice(-8)}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {chat.created_at ? new Date(chat.created_at).toLocaleDateString() : 'Unknown'}
                        </span>
                      </div>
                    </div>
                  ))}
                  {chatHistory.length > 5 && (
                    <p className="text-sm text-gray-500 text-center">
                      ... and {chatHistory.length - 5} more conversations
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No chat history found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Raw Data Viewer */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Raw Data (Debug)</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Sample Client Data:</h3>
                <pre className="bg-gray-50 p-4 rounded text-xs overflow-x-auto">
                  {JSON.stringify(clients[0] || {}, null, 2)}
                </pre>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Sample Chat Data:</h3>
                <pre className="bg-gray-50 p-4 rounded text-xs overflow-x-auto">
                  {JSON.stringify(chatHistory[0] || {}, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
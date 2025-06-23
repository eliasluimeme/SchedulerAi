import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabaseHelpers } from './supabase';
import { 
  MessageCircle, 
  Users, 
  BarChart3, 
  Megaphone, 
  HelpCircle, 
  Settings, 
  Search,
  Filter,
  SortAsc,
  MoreHorizontal,
  Plus,
  ChevronDown,
  X,
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  Github,
  Phone,
  Mail,
  MapPin,
  Building,
  User,
  Eye,
  Download,
  Loader2
} from 'lucide-react';

// Mock Data for elements not yet connected to Supabase
const mockChannels = [
  { name: 'WhatsApp', icon: '💬', color: 'bg-green-500', count: '44' },
  { name: 'Messenger', icon: '📧', color: 'bg-blue-600', count: '51' },
  { name: 'Gmail', icon: '📧', color: 'bg-red-500', count: '' },
  { name: 'Telegram', icon: '✈️', color: 'bg-blue-400', count: '' }
];

const mockTeamMembers = [
  { name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' },
  { name: 'Jane Smith', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b85b0cc7?w=40&h=40&fit=crop&crop=face' },
  { name: 'Mike Johnson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
  { name: 'Sarah Wilson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' }
];

const mockLabels = [
  { name: '#sales', color: 'bg-cyan-400', textColor: 'text-cyan-900' },
  { name: '#billing', color: 'bg-green-400', textColor: 'text-green-900' },
  { name: '#bugs', color: 'bg-purple-400', textColor: 'text-purple-900' },
  { name: '#vip', color: 'bg-orange-400', textColor: 'text-orange-900' }
];

// Utility functions
const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const getAvatarColor = (name) => {
  if (!name) return 'bg-gray-500';
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
    'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
  ];
  const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return 'Invalid Date';
  }
};

// Utility to parse JSONL messages
const parseMessages = (messageField) => {
  if (!messageField) return [];
  if (Array.isArray(messageField)) return messageField;
  if (typeof messageField === 'object') return [messageField];
  if (typeof messageField === 'string') {
    return messageField
      .split('\n')
      .map(line => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  }
  return [];
};

// Helper to extract displayable content from a message
const getMessageDisplayContent = (msg) => {
  if (!msg || !msg.content) return '';
  // If content is a string, try to parse as JSON
  if (typeof msg.content === 'string') {
    try {
      const parsed = JSON.parse(msg.content);
      if (parsed && parsed.output && parsed.output.reply) {
        return parsed.output.reply;
      }
    } catch {
      // Not JSON, just return as is
      return msg.content;
    }
    return msg.content;
  }
  // If content is an object with output.reply
  if (typeof msg.content === 'object' && msg.content.output && msg.content.output.reply) {
    return msg.content.output.reply;
  }
  // Otherwise, fallback to stringifying
  return typeof msg.content === 'object' ? JSON.stringify(msg.content) : String(msg.content);
};

// Sidebar Component
export const Sidebar = ({ activeRoute, setActiveRoute }) => {
  const location = useLocation();
  
  const menuItems = [
    { 
      name: 'My Inbox', 
      icon: MessageCircle, 
      path: '/inbox',
      isActive: false 
    },
    { 
      name: 'Conversations', 
      icon: MessageCircle, 
      path: '/conversations',
      isActive: location.pathname === '/conversations' 
    },
    { 
      name: 'Contacts', 
      icon: Users, 
      path: '/contacts',
      isActive: location.pathname === '/contacts' 
    },
    { 
      name: 'Reports', 
      icon: BarChart3, 
      path: '/reports',
      isActive: location.pathname === '/reports' 
    },
    { 
      name: 'Campaigns', 
      icon: Megaphone, 
      path: '/campaigns',
      isActive: location.pathname === '/campaigns' 
    },
    { 
      name: 'Help Center', 
      icon: HelpCircle, 
      path: '/help',
      isActive: false 
    },
    { 
      name: 'Settings', 
      icon: Settings, 
      path: '/settings',
      isActive: false 
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-medium text-gray-900">SchedulerAI</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                item.isActive 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <IconComponent className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">E</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">elias</p>
            <p className="text-xs text-gray-500 truncate">elias@elias.com</p>
          </div>
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

// Conversations Page Component
export const ConversationsPage = () => {
  const [selectedTab, setSelectedTab] = useState('All');
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when selectedSession or conversations change
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedSession, conversations]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const data = await supabaseHelpers.getChatHistory();
      console.log('Fetched conversations:', data); // Debug log
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group by session_id, show latest message per session
  const sessions = Object.values(
    conversations.reduce((acc, conv) => {
      if (!acc[conv.session_id] || new Date(conv.created_at) > new Date(acc[conv.session_id].created_at)) {
        acc[conv.session_id] = conv;
      }
      return acc;
    }, {})
  ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Find all messages for the selected session, sorted by created_at/id
  const selectedMessages = selectedSession
    ? conversations
        .filter(c => c.session_id === selectedSession)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at) || a.id - b.id)
    : [];

  return (
    <div className="flex-1 flex h-full bg-gray-100">
      {/* Conversations Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Conversations</h1>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading conversations...</span>
            </div>
          ) : sessions.length > 0 ? (
            <div className="space-y-2 p-4">
              {sessions.map((conv) => {
                // Show preview of last message
                const messages = parseMessages(conv.message);
                const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;
                return (
                  <div
                    key={conv.session_id}
                    className={`p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors ${selectedSession === conv.session_id ? 'bg-blue-50 border-blue-400' : 'bg-white'}`}
                    onClick={() => setSelectedSession(conv.session_id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm shadow">
                        {conv.session_id.slice(-2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {conv.session_id}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {formatDate(conv.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {lastMsg ? getMessageDisplayContent(lastMsg) : 'No message content'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No conversations found.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content: Chat View */}
      <div className="flex-1 flex flex-col h-full">
        {/* Sticky Chat Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10 px-8 py-4 flex items-center justify-between shadow-sm">
          {selectedSession ? (
            <>
              <h2 className="text-lg font-semibold">Session {selectedSession.slice(-8)}</h2>
              <span className="text-xs text-gray-500">{selectedMessages.length} messages</span>
            </>
          ) : (
            <span className="text-gray-500">Select a conversation</span>
          )}
        </div>
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 bg-gray-50 custom-scrollbar" style={{ minHeight: 0 }}>
          {selectedSession ? (
            <div className="max-w-2xl mx-auto flex flex-col gap-2">
              {selectedMessages.map((conv, idx) => {
                const messages = parseMessages(conv.message);
                return messages.map((msg, i) => {
                  const isHuman = msg.type === 'human';
                  return (
                    <div
                      key={conv.id + '-' + i}
                      className={`flex ${isHuman ? 'justify-start' : 'justify-end'} w-full`}
                    >
                      <div className={`flex flex-col items-${isHuman ? 'start' : 'end'} max-w-[80%]`}>
                        <div
                          className={`rounded-lg px-4 py-2 mb-1 break-words shadow-md ${
                            isHuman
                              ? 'bg-white text-gray-900 border border-gray-200'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          {getMessageDisplayContent(msg)}
                        </div>
                        <span className="text-xs text-gray-400 mt-1">
                          {formatDate(conv.created_at)}
                        </span>
                      </div>
                    </div>
                  );
                });
              })}
              <div ref={chatEndRef} />
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-gray-500 text-center mt-24">
              Select a conversation to view messages.
            </div>
          )}
        </div>
        {/* Chat Input Placeholder */}
        <div className="bg-white border-t border-gray-200 px-8 py-4 flex items-center sticky bottom-0">
          <input
            type="text"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
            placeholder="Type a message... (coming soon)"
            disabled
          />
          <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700" disabled>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

// Map status enums to human-readable text and color
const contactStatusMap = {
  NEW_CONVERSATION_STARTED: { label: 'New Conversation', color: 'bg-blue-100 text-blue-800' },
  AWAITING_CLIENT_AVAILABILITY: { label: 'Waiting for Client', color: 'bg-yellow-100 text-yellow-800' },
  AWAITING_OWNER_AVAILABILITY: { label: 'Waiting for Owner', color: 'bg-yellow-100 text-yellow-800' },
  AWAITING_CLIENT_CONFIRMATION: { label: 'Waiting for Client Confirmation', color: 'bg-orange-100 text-orange-800' },
  AWAITING_OWNER_CONFIRMATION: { label: 'Waiting for Owner Confirmation', color: 'bg-orange-100 text-orange-800' },
  AWAITING_FINAL_CONFIRMATION_FROM_OWNER_PROPOSAL: { label: 'Awaiting Final Confirmation', color: 'bg-orange-100 text-orange-800' },
  SCHEDULED_CONFIRMED: { label: 'Scheduled & Confirmed', color: 'bg-green-100 text-green-800' },
  CANCELED_BY_CONTACT: { label: 'Canceled by Contact', color: 'bg-red-100 text-red-800' },
  CANCELED_BY_OWNER: { label: 'Canceled by Owner', color: 'bg-red-100 text-red-800' },
  TIMED_OUT_CLIENT_UNRESPONSIVE: { label: 'Client Unresponsive', color: 'bg-gray-100 text-gray-800' },
  TIMED_OUT_OWNER_UNRESPONSIVE: { label: 'Owner Unresponsive', color: 'bg-gray-100 text-gray-800' },
  CONFLICT_RESOLUTION_NEEDED: { label: 'Conflict Resolution Needed', color: 'bg-purple-100 text-purple-800' },
};

// Contacts Page Component
export const ContactsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    city: ''
  });
  const [detailsModalContact, setDetailsModalContact] = useState(null);

  useEffect(() => {
    loadContacts();
    
    // Set up real-time subscription
    const subscription = supabaseHelpers.subscribeToClients((payload) => {
      console.log('Client update:', payload);
      loadContacts();
    });

    return () => {
      supabaseHelpers.removeSubscription(subscription);
    };
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const data = await supabaseHelpers.getClients();
      setContacts(data);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContact = async (e) => {
    e.preventDefault();
    try {
      const newContact = await supabaseHelpers.createClient(formData);
      if (newContact) {
        setContacts([newContact, ...contacts]);
        setFormData({ name: '', email: '', phone: '', company: '', city: '' });
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error creating contact:', error);
    }
  };

  const ContactModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Add new contact</h2>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleCreateContact}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                placeholder="Enter the full name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                placeholder="Enter the email address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="tel"
                placeholder="Enter the phone number"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Enter the company name"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Enter the city name"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save contact
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Contacts</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Filter className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <SortAsc className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Message
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex">
        <div className="w-64 border-r border-gray-200 p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">All Contacts</h3>
              <p className="text-sm text-gray-500">{contacts.length} contacts</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Tagged with</h3>
              <button className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                <Plus className="w-4 h-4 mr-1" />
                New label
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading contacts...</span>
            </div>
          ) : contacts.length > 0 ? (
            <div className="p-6 space-y-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${getAvatarColor(contact.name || contact.email)} rounded-full flex items-center justify-center text-white font-medium`}>
                      {getInitials(contact.name || contact.email)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{contact.name || 'No Name'}</h3>
                        {contact.company && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">{contact.company}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{contact.email}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {contact.phone && (
                          <span className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {contact.phone}
                          </span>
                        )}
                        {contact.city && (
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {contact.city}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Added {formatDate(contact.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end min-w-[140px]">
                    {contact.status && contactStatusMap[contact.status] && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium mb-1 ${contactStatusMap[contact.status].color}`}>
                        {contactStatusMap[contact.status].label}
                      </span>
                    )}
                    <button className="text-blue-600 hover:text-blue-700 text-sm mt-1" onClick={() => setDetailsModalContact(contact)}>View details</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <User className="w-16 h-16 text-gray-300 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No contacts found in this account</h3>
              <p className="text-gray-600 mb-6">Start adding new contacts by clicking on the button below</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center mx-auto"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add contact
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && <ContactModal />}

      {detailsModalContact && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-lg p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setDetailsModalContact(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Contact Details</h2>
            <div className="space-y-3">
              {Object.entries(detailsModalContact).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}</span>
                  <span className="text-gray-900 break-all text-right">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reports Page Component
export const ReportsPage = () => {
  const [stats, setStats] = useState({ total: 0, open: 0, unassigned: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const statsData = await supabaseHelpers.getConversationStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <h1 className="text-2xl font-semibold text-gray-900">Overview</h1>
      </div>

      {/* Sidebar */}
      <div className="flex">
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <nav className="space-y-2">
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg">
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Overview</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
              <MessageCircle className="w-5 h-5" />
              <span>Conversations</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
              <span className="w-5 h-5 flex items-center justify-center text-sm">📊</span>
              <span>CSAT</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
              <Users className="w-5 h-5" />
              <span>Agents</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
              <span className="w-5 h-5 flex items-center justify-center text-sm">🏷️</span>
              <span>Labels</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
              <span className="w-5 h-5 flex items-center justify-center text-sm">📥</span>
              <span>Inbox</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
              <Users className="w-5 h-5" />
              <span>Team</span>
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading statistics...</span>
            </div>
          ) : (
            <>
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Open Conversations */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-medium text-gray-600">Open Conversations</h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      • Live
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stats.open}</p>
                      <p className="text-xs text-gray-500">Open</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                      <p className="text-xs text-gray-500">Unattended</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stats.unassigned}</p>
                      <p className="text-xs text-gray-500">Unassigned</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                      <p className="text-xs text-gray-500">Pending</p>
                    </div>
                  </div>
                </div>

                {/* Agent Status */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-medium text-gray-600">Agent status</h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      • Live
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">1</p>
                      <p className="text-xs text-gray-500">Online</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                      <p className="text-xs text-gray-500">Busy</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                      <p className="text-xs text-gray-500">Offline</p>
                    </div>
                  </div>
                </div>

                {/* Total Conversations */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-medium text-gray-600">Total Conversations</h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      • Live
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                    <p className="text-sm text-gray-500">All time</p>
                  </div>
                </div>

                {/* Active Users */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-medium text-gray-600">Active Users</h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      • Live
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                    <p className="text-sm text-gray-500">Currently active</p>
                  </div>
                </div>
              </div>

              {/* Conversation Traffic */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-900">Conversation Traffic</h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      • Live
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <select className="text-sm border border-gray-300 rounded px-3 py-1">
                      <option>Last 7 days</option>
                    </select>
                    <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                      <Download className="w-4 h-4 mr-1" />
                      Download report
                    </button>
                  </div>
                </div>

                {/* Chart Placeholder */}
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Real-time conversation data: {stats.total} total conversations</p>
                  </div>
                </div>
              </div>

              {/* Conversations by Agents */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center space-x-2 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Conversations by agents</h3>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    • Live
                  </span>
                </div>
                <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                  <p className="text-gray-500">Agent performance data will appear here</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Campaigns Page Component
export const CampaignsPage = () => {
  return (
    <div className="flex-1 bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Campaigns</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Create Campaign
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Empty State */}
        <div className="text-center py-16">
          <div className="mb-6">
            <Megaphone className="w-24 h-24 text-gray-300 mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No campaigns yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Create your first campaign to start engaging with your customers through targeted messaging.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center mx-auto">
            <Plus className="w-5 h-5 mr-2" />
            Create your first campaign
          </button>
        </div>

        {/* Campaign Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Targeted Messaging</h3>
            <p className="text-gray-600 text-sm">Send personalized messages to specific customer segments</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Performance Tracking</h3>
            <p className="text-gray-600 text-sm">Monitor campaign performance with detailed analytics</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Audience Segmentation</h3>
            <p className="text-gray-600 text-sm">Create targeted groups based on customer behavior</p>
          </div>
        </div>
      </div>
    </div>
  );
};
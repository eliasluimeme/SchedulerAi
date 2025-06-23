import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for data fetching
export const supabaseHelpers = {
  // Fetch all clients for contacts
  async getClients() {
    try {
      const { data, error } = await supabase
        .from('client')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching clients:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Error in getClients:', error);
      return [];
    }
  },

  // Fetch chat history for conversations with better field mapping
  async getChatHistory() {
    try {
      const { data, error } = await supabase
        .from('n8n_chat_histories')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100); // Limit to last 100 conversations for performance
      
      if (error) {
        console.error('Error fetching chat history:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Error in getChatHistory:', error);
      return [];
    }
  },

  // Get conversation count by status
  async getConversationsByStatus() {
    try {
      const { data, error } = await supabase
        .from('n8n_chat_histories')
        .select('id, created_at');
      
      if (error) {
        console.error('Error fetching conversation stats:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Error in getConversationsByStatus:', error);
      return [];
    }
  },

  // Create new client
  async createClient(clientData) {
    try {
      const { data, error } = await supabase
        .from('client')
        .insert({
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone,
          company: clientData.company,
          city: clientData.city,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating client:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error in createClient:', error);
      throw error;
    }
  },

  // Update client
  async updateClient(id, updates) {
    try {
      const { data, error } = await supabase
        .from('client')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating client:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error in updateClient:', error);
      throw error;
    }
  },

  // Delete client
  async deleteClient(id) {
    try {
      const { error } = await supabase
        .from('client')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting client:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in deleteClient:', error);
      return false;
    }
  },

  // Get conversation statistics
  async getConversationStats() {
    try {
      const conversations = await this.getConversationsByStatus();
      
      // Calculate stats based on available data
      const total = conversations.length;
      const today = new Date().toISOString().split('T')[0];
      const todayConversations = conversations.filter(conv => 
        conv.created_at && conv.created_at.startsWith(today)
      );
      
      return {
        total: total,
        open: conversations.filter(conv => !conv.status || conv.status === 'open' || conv.status === 'active').length,
        unassigned: conversations.filter(conv => !conv.assigned_to && !conv.agent_id).length,
        pending: conversations.filter(conv => conv.status === 'pending').length,
        today: todayConversations.length
      };
    } catch (error) {
      console.error('Error in getConversationStats:', error);
      return {
        total: 0,
        open: 0,
        unassigned: 0,
        pending: 0,
        today: 0
      };
    }
  },

  // Test database connection
  async testConnection() {
    try {
      const { data, error } = await supabase
        .from('client')
        .select('count(*)')
        .limit(1);
      
      if (error) {
        console.error('Database connection test failed:', error);
        return false;
      }
      
      console.log('✅ Supabase connection successful');
      return true;
    } catch (error) {
      console.error('Database connection test error:', error);
      return false;
    }
  },

  // Add sample data for testing
  async addSampleData() {
    try {
      // Add sample client
      const sampleClient = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '+1234567890',
        company: 'Example Corp',
        city: 'New York'
      };
      
      await this.createClient(sampleClient);
      console.log('✅ Sample client added successfully');
      return true;
    } catch (error) {
      console.error('Error adding sample data:', error);
      return false;
    }
  },

  // Real-time subscription for clients
  subscribeToClients(callback) {
    return supabase
      .channel('clients_channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'clients'
      }, (payload) => {
        console.log('Clients change detected:', payload);
        callback(payload);
      })
      .subscribe();
  },

  // Real-time subscription for chat history
  subscribeToChatHistory(callback) {
    return supabase
      .channel('n8n_chat_histories')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'n8n_chat_histories'
      }, (payload) => {
        console.log('Chat history change detected:', payload);
        callback(payload);
      })
      .subscribe();
  },

  // Remove subscription
  removeSubscription(subscription) {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  },

  // Get table schema for debugging
  async getTableInfo(tableName) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (error) {
        console.error(`Error fetching ${tableName} schema:`, error);
        return null;
      }
      
      if (data && data.length > 0) {
        console.log(`${tableName} sample data:`, data[0]);
        console.log(`${tableName} fields:`, Object.keys(data[0]));
        return data[0];
      }
      
      return null;
    } catch (error) {
      console.error(`Error in getTableInfo for ${tableName}:`, error);
      return null;
    }
  }
};
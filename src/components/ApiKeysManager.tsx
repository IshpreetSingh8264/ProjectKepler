'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaKey, FaPlus, FaTrash, FaEye, FaEyeSlash, FaCopy, FaExclamationTriangle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/authContext';
import { getUserApiKeys, createApiKey, deleteApiKey, ApiKey } from '@/lib/apiKeyManagement';
import ApiKeyModal from './ApiKeyModal';
import CreateApiKeyModal from './CreateApiKeyModal';

const ApiKeysManager: React.FC = () => {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<Omit<ApiKey, 'hashedKey'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [newApiKey, setNewApiKey] = useState('');
  const [newKeyName, setNewKeyName] = useState('');
  const [errors, setErrors] = useState<string>('');

  // Load user's API keys
  useEffect(() => {
    const loadApiKeys = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const keys = await getUserApiKeys(user.uid);
        setApiKeys(keys);
      } catch (error) {
        console.error('Error loading API keys:', error);
        setErrors('Failed to load API keys');
      } finally {
        setLoading(false);
      }
    };

    loadApiKeys();
  }, [user]);

  const handleCreateApiKey = async (keyName: string) => {
    if (!user) return;

    setCreating(true);
    setErrors('');

    try {
      const { apiKey, keyId } = await createApiKey(user.uid, keyName);
      
      // Show the API key to the user
      setNewApiKey(apiKey);
      setNewKeyName(keyName);
      setShowApiKeyModal(true);
      
      // Refresh the API keys list
      const updatedKeys = await getUserApiKeys(user.uid);
      setApiKeys(updatedKeys);
    } catch (error) {
      console.error('Error creating API key:', error);
      setErrors('Failed to create API key. Please try again.');
      throw error;
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteApiKey = async (keyId: string) => {
    if (!user) return;

    try {
      await deleteApiKey(keyId, user.uid);
      
      // Refresh the API keys list
      const updatedKeys = await getUserApiKeys(user.uid);
      setApiKeys(updatedKeys);
    } catch (error) {
      console.error('Error deleting API key:', error);
      setErrors('Failed to delete API key. Please try again.');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <FaExclamationTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Authentication Required</h3>
        <p className="text-slate-400">Please log in to manage your API keys.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4" />
        <p className="text-slate-400">Loading your API keys...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">API Keys</h2>
          <p className="text-slate-400">Manage your API keys for accessing ProjectKepler services</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
        >
          <FaPlus className="mr-2 h-4 w-4" />
          Create API Key
        </Button>
      </div>

      {/* Error Message */}
      {errors && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"
        >
          <p className="text-red-400">{errors}</p>
        </motion.div>
      )}

      {/* API Keys List */}
      {apiKeys.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="text-center py-12">
            <FaKey className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No API Keys</h3>
            <p className="text-slate-400 mb-6">You haven't created any API keys yet.</p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
            >
              <FaPlus className="mr-2 h-4 w-4" />
              Create Your First API Key
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {apiKeys.map((apiKey, index) => (
            <motion.div
              key={apiKey.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-orange-600 to-red-600 p-2 rounded-lg">
                        <FaKey className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{apiKey.keyName}</h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-400">
                          <span>Created {formatDate(apiKey.createdAt)}</span>
                          {apiKey.lastUsed && (
                            <span>Last used {formatDate(apiKey.lastUsed)}</span>
                          )}
                          <span>{apiKey.usageCount} requests</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            apiKey.isActive 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {apiKey.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteApiKey(apiKey.id)}
                        className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-500"
                      >
                        <FaTrash className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateApiKeyModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateKey={handleCreateApiKey}
        isLoading={creating}
      />

      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        apiKey={newApiKey}
        keyName={newKeyName}
      />
    </div>
  );
};

export default ApiKeysManager;
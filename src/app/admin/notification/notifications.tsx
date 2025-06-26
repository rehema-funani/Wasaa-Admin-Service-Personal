import React, { useState, useEffect } from 'react';
import {
  Bell, Filter, Search, Plus,
  Trash, Edit, Send, Clock, X,
  Sparkles, Zap, MessageSquare, FileText,
  MoreHorizontal, ArrowUp, ArrowDown,
  Command, Languages,
  Smartphone, Mail, BellRing,
  Eye
} from 'lucide-react';
import { notificationService } from '../../../api/services/notification';

interface Template {
  _id: string;
  template_code: string;
  channel: string;
  language: string;
  content: string;
  placeholders: Record<string, string>;
  version: number;
  created_by: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface NewTemplateData {
  template_code: string;
  channel: string;
  language: string;
  content: string;
  placeholders: Record<string, string>;
  description?: string;
}

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [search, setSearch] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState<NewTemplateData>({
    template_code: '',
    channel: 'sms',
    language: 'en',
    content: '',
    placeholders: {}
  });
  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  const [currentDescription, setCurrentDescription] = useState('');
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState('template_code');
  const [sortDirection, setSortDirection] = useState('asc');

  const getTemplates = async () => {
    try {
      const response = await notificationService.getTemplates();
      setTemplates(response);
      setFilteredTemplates(response);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const createTemplate = async () => {
    try {
      await notificationService.createTemplate(newTemplate);
      setNewTemplate({
        template_code: '',
        channel: 'sms',
        language: 'en',
        content: '',
        placeholders: {}
      });
      setShowCreateModal(false);
      getTemplates();
    } catch (error) {
      console.error('Failed to create template:', error);
    }
  };

  const addPlaceholder = () => {
    if (currentPlaceholder && !newTemplate.placeholders[currentPlaceholder]) {
      setNewTemplate({
        ...newTemplate,
        placeholders: {
          ...newTemplate.placeholders,
          [currentPlaceholder]: currentDescription || 'Placeholder description'
        }
      });
      setCurrentPlaceholder('');
      setCurrentDescription('');
    }
  };

  const removePlaceholder = (placeholder: string) => {
    const updatedPlaceholders = { ...newTemplate.placeholders };
    delete updatedPlaceholders[placeholder];

    setNewTemplate({
      ...newTemplate,
      placeholders: updatedPlaceholders
    });
  };

  const handleSort = (criteria: string) => {
    if (sortBy === criteria) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteria);
      setSortDirection('asc');
    }
    setIsSortMenuOpen(false);
  };

  useEffect(() => {
    getTemplates();
  }, []);

  useEffect(() => {
    let filtered = [...templates];

    if (search) {
      filtered = filtered.filter(template =>
        template.template_code.toLowerCase().includes(search.toLowerCase()) ||
        template.channel.toLowerCase().includes(search.toLowerCase()) ||
        template.language.toLowerCase().includes(search.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'template_code') {
        comparison = a.template_code.localeCompare(b.template_code);
      } else if (sortBy === 'channel') {
        comparison = a.channel.localeCompare(b.channel);
      } else if (sortBy === 'language') {
        comparison = a.language.localeCompare(b.language);
      } else if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    setFilteredTemplates(filtered);
  }, [search, templates, sortBy, sortDirection]);

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'sms':
        return <Smartphone className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'push':
        return <BellRing className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const viewTemplate = (templateId: string) => {
    alert(`Viewing template: ${templateId}`);
  };

  return (
    <div className="h-auto bg-transparent w-full text-gray-900 relative">
      <div className="relative z-10 p-8 mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Notification Management
            </h1>
            <p className="text-gray-500 mt-1">Create and manage notification templates for users</p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full hover:shadow-lg hover:shadow-blue-200 text-sm font-medium flex items-center transition-all duration-300 hover:translate-y-[-2px]"
          >
            <Plus size={16} className="mr-2" />
            New Template
          </button>
        </div>

        <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-xl border border-gray-100 mb-8 overflow-hidden transition-all hover:shadow-2xl hover:shadow-blue-100/40">
          <div className="backdrop-blur-sm border-b border-gray-100">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('templates')}
                className={`px-8 py-5 text-sm font-medium flex items-center transition-all duration-300 ${activeTab === 'templates'
                  ? 'text-blue-600 border-b-2 border-blue-500 bg-blue-50/30'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                  }`}
              >
                <FileText size={16} className="mr-2" />
                Templates
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`px-8 py-5 text-sm font-medium flex items-center transition-all duration-300 ${activeTab === 'history'
                  ? 'text-blue-600 border-b-2 border-blue-500 bg-blue-50/30'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                  }`}
              >
                <Clock size={16} className="mr-2" />
                Notification History
              </button>
            </nav>
          </div>

          <div className="p-5 flex flex-wrap gap-3 bg-gray-50/50">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={activeTab === 'templates' ? "Search templates..." : "Search notification history..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-3 w-full bg-white border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 text-gray-700 text-sm backdrop-blur-sm transition-all placeholder-gray-400 shadow-sm outline-none"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                className="p-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-all text-gray-600 backdrop-blur-sm shadow-sm"
              >
                <Filter size={18} />
              </button>

              {isSortMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-10 overflow-hidden">
                  <div className="p-2 border-b border-gray-100">
                    <p className="text-xs font-medium text-gray-500">SORT BY</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => handleSort('template_code')}
                      className={`flex items-center justify-between w-full px-4 py-2 text-sm ${sortBy === 'template_code' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <span>Template Code</span>
                      {sortBy === 'template_code' && (
                        sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                      )}
                    </button>
                    <button
                      onClick={() => handleSort('channel')}
                      className={`flex items-center justify-between w-full px-4 py-2 text-sm ${sortBy === 'channel' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <span>Channel</span>
                      {sortBy === 'channel' && (
                        sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                      )}
                    </button>
                    <button
                      onClick={() => handleSort('language')}
                      className={`flex items-center justify-between w-full px-4 py-2 text-sm ${sortBy === 'language' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <span>Language</span>
                      {sortBy === 'language' && (
                        sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                      )}
                    </button>
                    <button
                      onClick={() => handleSort('createdAt')}
                      className={`flex items-center justify-between w-full px-4 py-2 text-sm ${sortBy === 'createdAt' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <span>Date Created</span>
                      {sortBy === 'createdAt' && (
                        sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {activeTab === 'templates' && (
          <div className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-xl border border-gray-100 overflow-hidden transition-all hover:shadow-xl">
            <div className="grid grid-cols-1 divide-y divide-gray-100">
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template) => (
                  <div key={template._id} className="p-5 hover:bg-blue-50/30 transition-colors group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center border border-blue-200/50">
                          {template.channel === 'sms' ? (
                            <Smartphone className="w-5 h-5 text-blue-600" />
                          ) : template.channel === 'email' ? (
                            <Mail className="w-5 h-5 text-blue-600" />
                          ) : (
                            <BellRing className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-base font-medium text-gray-900">{template.template_code}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 py-0.5 px-2 rounded-full">
                              {template.channel}
                            </span>
                            <div className="flex items-center text-xs text-gray-500">
                              <Languages className="w-3 h-3 mr-1" />
                              {template?.language?.toUpperCase()}
                            </div>
                            <div className="text-xs text-gray-500">
                              v{template.version}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all opacity-0 group-hover:opacity-100">
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => viewTemplate(template._id)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Eye size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-all opacity-0 group-hover:opacity-100">
                          <Send size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100">
                          <Trash size={18} />
                        </button>
                        <div className="w-px h-6 bg-gray-200 mx-1"></div>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="inline-block p-4 rounded-full bg-blue-50 mb-4">
                    <Bell size={32} className="text-blue-400" />
                  </div>
                  <p className="text-gray-500">No templates found matching your criteria.</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="mt-4 px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    Create your first template
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-xl border border-gray-100 overflow-hidden transition-all hover:shadow-xl">
            <div className="text-center py-16">
              <div className="inline-block p-4 rounded-full bg-gray-50 mb-4">
                <Clock size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500">No notification history found.</p>
              <button className="mt-4 px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors">
                Send your first notification
              </button>
            </div>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="bg-white rounded-3xl max-h-[80vh] overflow-y-auto mt-12 w-full max-w-2xl border border-gray-100 shadow-2xl"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Sparkles size={18} className="mr-2 text-blue-500" />
                Create New Template
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Template Code</label>
                <input
                  type="text"
                  placeholder="e.g., OTP_VERIFICATION"
                  value={newTemplate.template_code}
                  onChange={(e) => setNewTemplate({ ...newTemplate, template_code: e.target.value })}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-gray-700 text-sm placeholder-gray-400 shadow-sm outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Channel</label>
                  <div className="relative">
                    <select
                      value={newTemplate.channel}
                      onChange={(e) => setNewTemplate({ ...newTemplate, channel: e.target.value })}
                      className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-gray-700 text-sm shadow-sm outline-none appearance-none pl-10"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.75rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1rem` }}
                    >
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                      <option value="push">Push Notification</option>
                    </select>
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {getChannelIcon(newTemplate.channel)}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <div className="relative">
                    <select
                      value={newTemplate.language}
                      onChange={(e) => setNewTemplate({ ...newTemplate, language: e.target.value })}
                      className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-gray-700 text-sm shadow-sm outline-none appearance-none pl-10"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.75rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1rem` }}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <Languages className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  placeholder="e.g., Your verification code is {{otp}}. Valid for {{expires_at}} minutes. Do not share this code with anyone."
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-gray-700 text-sm placeholder-gray-400 shadow-sm outline-none h-28"
                />
                <div className="flex items-center justify-end mt-1 text-xs text-gray-500">
                  <Command className="w-3 h-3 mr-1" />
                  Use {'{{ placeholder_name }}'} for variables
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Placeholders</label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="Placeholder name (e.g., otp)"
                    value={currentPlaceholder}
                    onChange={(e) => setCurrentPlaceholder(e.target.value)}
                    className="p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-gray-700 text-sm placeholder-gray-400 shadow-sm outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Description (e.g., OTP code)"
                    value={currentDescription}
                    onChange={(e) => setCurrentDescription(e.target.value)}
                    className="p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-gray-700 text-sm placeholder-gray-400 shadow-sm outline-none"
                  />
                </div>
                <button
                  onClick={addPlaceholder}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg hover:shadow-blue-200 w-full"
                >
                  Add Placeholder
                </button>

                <div className="mt-3">
                  {Object.keys(newTemplate.placeholders).length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 mb-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Added Placeholders:</h4>
                      <div className="space-y-2">
                        {Object.entries(newTemplate.placeholders).map(([key, description]) => (
                          <div key={key} className="flex items-center justify-between bg-white rounded-lg p-2 border border-gray-100">
                            <div>
                              <span className="text-blue-600 font-medium text-sm">{`{{${key}}}`}</span>
                              <span className="text-xs text-gray-500">{description}</span>
                            </div>
                            <button
                              onClick={() => removePlaceholder(key)}
                              className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-full"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end space-x-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={createTemplate}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-200 transition-all"
              >
                <div className="flex items-center">
                  <Zap size={16} className="mr-2" />
                  Create Template
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Copy,
  Trash,
  Edit,
  CheckCircle,
  AlertTriangle,
  Eye,
  CheckCircle2,
  X,
  Save,
  MessageSquare,
  Mail,
  Smartphone,
  HelpCircle,
  Clock,
  Pencil,
  MoreHorizontal,
  Plus,
} from 'lucide-react';
import { notificationService } from '../../../api/services/notification';

interface Template {
  id: string;
  code: string;
  name: string;
  description: string;
  language: string;
  channel: string;
  content: string;
  tokens: string[];
  lastEdited?: string;
  createdAt?: string;
  createdBy?: string;
}

const page: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'success' | 'error' | 'idle'>('idle');
  const [validationMessage, setValidationMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewTokens, setPreviewTokens] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedTemplate, setEditedTemplate] = useState<Template | null>(null);
  const [showActionMenu, setShowActionMenu] = useState(false);

  // Fetch template data
  useEffect(() => {
    const fetchTemplate = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const response = await notificationService.getTemplateById(id);
        setTemplate(response);

        // Initialize preview tokens with empty values
        const initialTokens: Record<string, string> = {};
        response?.tokens?.forEach(token => {
          initialTokens[token] = `[${token}]`;
        });
        setPreviewTokens(initialTokens);

      } catch (err) {
        setError('Failed to load template. Please try again.');
        console.error('Error fetching template:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id]);

  // Initialize edited template when template data is loaded
  useEffect(() => {
    if (template) {
      setEditedTemplate({ ...template });
    }
  }, [template]);

  // Handle delete template
  const handleDelete = async () => {
    if (!id) return;

    try {
      await notificationService.deleteTemplate(id);
      navigate('/admin/media/shorts/notifications/templates');
    } catch (err) {
      setError('Failed to delete template. Please try again.');
      console.error('Error deleting template:', err);
    }
  };

  // Handle validate template
  const handleValidate = async () => {
    if (!template) return;

    setIsValidating(true);
    setValidationStatus('idle');

    try {
      await notificationService.validateTemplate(template.id);
      setValidationStatus('success');
      setValidationMessage('Template is valid and ready to use.');
    } catch (err) {
      setValidationStatus('error');
      setValidationMessage('Template validation failed. Please check the content and tokens.');
      console.error('Error validating template:', err);
    } finally {
      setIsValidating(false);
    }
  };

  // Handle duplicate template
  const handleDuplicate = async () => {
    if (!template) return;

    try {
      const newTemplate = {
        ...template,
        name: `${template.name} (Copy)`,
        code: `${template.code}_COPY`,
      };
      delete newTemplate.id;

      const response = await notificationService.createTemplate(newTemplate);
      navigate(`/templates/${response.id}`);
    } catch (err) {
      setError('Failed to duplicate template. Please try again.');
      console.error('Error duplicating template:', err);
    }
  };

  // Handle update token value for preview
  const handleTokenChange = (token: string, value: string) => {
    setPreviewTokens(prev => ({
      ...prev,
      [token]: value,
    }));
  };

  // Generate preview content with token values
  const getPreviewContent = () => {
    if (!template) return '';

    let content = template.content;
    Object.entries(previewTokens).forEach(([token, value]) => {
      const regex = new RegExp(`{{\\s*${token}\\s*}}`, 'g');
      content = content.replace(regex, value);
    });

    return content;
  };

  // Handle save edited template
  const handleSaveTemplate = async () => {
    if (!editedTemplate) return;

    try {
      const response = await notificationService.updateTemplate(editedTemplate.id, editedTemplate);
      setTemplate(response);
      setIsEditing(false);
      setValidationStatus('idle');
    } catch (err) {
      setError('Failed to update template. Please try again.');
      console.error('Error updating template:', err);
    }
  };

  // Handle cancel editing
  const handleCancelEdit = () => {
    setEditedTemplate(template);
    setIsEditing(false);
  };

  // Get channel icon
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'sms':
        return <Smartphone className="w-4 h-4" />;
      case 'push':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-pulse text-primary-500">
          <Clock className="w-10 h-10 mb-2 mx-auto" />
          <p className="text-sm text-gray-500">Loading template...</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-danger-500 text-center">
          <AlertTriangle className="w-10 h-10 mb-2 mx-auto" />
          <p className="text-lg font-medium mb-1">Error Loading Template</p>
          <p className="text-sm text-gray-500">{error || 'Template not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all text-sm"
          >
            Back to Templates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full bg-white border border-gray-200 shadow-soft-sm hover:shadow-soft transition-all"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Template' : template.name}
            </h1>
            <div className="flex items-center mt-1 text-gray-500 text-sm">
              <div className="flex items-center mr-4">
                <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">
                  {template.code}
                </code>
              </div>
              <div className="flex items-center mr-4">
                {getChannelIcon(template.channel)}
                <span className="ml-1 capitalize">{template.channel}</span>
              </div>
              <div className="flex items-center">
                <span className="ml-1 uppercase">{template.language}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium shadow-soft-sm flex items-center"
              >
                <Edit size={16} className="mr-2" />
                Edit
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowActionMenu(!showActionMenu)}
                  className="px-2.5 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all shadow-soft-sm"
                >
                  <MoreHorizontal size={18} />
                </button>

                {showActionMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-10 overflow-hidden">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowActionMenu(false);
                          handleValidate();
                        }}
                        className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <CheckCircle2 size={16} className="mr-2 text-success-500" />
                        Validate
                      </button>
                      <button
                        onClick={() => {
                          setShowActionMenu(false);
                          setShowPreview(true);
                        }}
                        className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Eye size={16} className="mr-2 text-primary-500" />
                        Preview
                      </button>
                      <button
                        onClick={() => {
                          setShowActionMenu(false);
                          handleDuplicate();
                        }}
                        className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Copy size={16} className="mr-2 text-gray-500" />
                        Duplicate
                      </button>
                      <button
                        onClick={() => {
                          setShowActionMenu(false);
                          setShowDeleteModal(true);
                        }}
                        className="w-full flex items-center px-4 py-2.5 text-sm text-danger-500 hover:bg-danger-50"
                      >
                        <Trash size={16} className="mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium shadow-soft-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTemplate}
                className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:shadow-lg hover:shadow-primary-200 transition-all text-sm font-medium shadow-soft-sm flex items-center"
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      {/* Validation Alert */}
      {validationStatus !== 'idle' && (
        <div className={`mb-6 p-4 rounded-xl border ${validationStatus === 'success' ? 'border-success-200 bg-success-50' : 'border-danger-200 bg-danger-50'}`}>
          <div className="flex items-start">
            {validationStatus === 'success' ? (
              <CheckCircle className="text-success-500 mt-0.5 mr-2 flex-shrink-0" size={18} />
            ) : (
              <AlertTriangle className="text-danger-500 mt-0.5 mr-2 flex-shrink-0" size={18} />
            )}
            <div className="flex-1">
              <p className={`text-sm font-medium ${validationStatus === 'success' ? 'text-success-800' : 'text-danger-800'}`}>
                {validationStatus === 'success' ? 'Template Validated' : 'Validation Failed'}
              </p>
              <p className={`text-xs mt-0.5 ${validationStatus === 'success' ? 'text-success-600' : 'text-danger-600'}`}>
                {validationMessage}
              </p>
            </div>
            <button
              onClick={() => setValidationStatus('idle')}
              className="ml-4 text-gray-400 hover:text-gray-500"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Template Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Template Information */}
          <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <h2 className="font-medium text-gray-800">Template Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-primary-500 hover:text-primary-600 p-1 rounded-lg hover:bg-primary-50"
                >
                  <Pencil size={16} />
                </button>
              )}
            </div>
            <div className="p-6 space-y-6">
              {isEditing ? (
                /* Editing Form */
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Template Code</label>
                      <input
                        type="text"
                        value={editedTemplate?.code || ''}
                        onChange={(e) => setEditedTemplate(prev => prev ? { ...prev, code: e.target.value } : null)}
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={editedTemplate?.name || ''}
                        onChange={(e) => setEditedTemplate(prev => prev ? { ...prev, name: e.target.value } : null)}
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={editedTemplate?.description || ''}
                      onChange={(e) => setEditedTemplate(prev => prev ? { ...prev, description: e.target.value } : null)}
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Channel</label>
                      <div className="relative">
                        <select
                          value={editedTemplate?.channel || ''}
                          onChange={(e) => setEditedTemplate(prev => prev ? { ...prev, channel: e.target.value } : null)}
                          className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 appearance-none pl-10"
                          style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.75rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1rem` }}
                        >
                          <option value="email">Email</option>
                          <option value="sms">SMS</option>
                          <option value="push">Push Notification</option>
                        </select>
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          {getChannelIcon(editedTemplate?.channel || 'sms')}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                      <select
                        value={editedTemplate?.language || ''}
                        onChange={(e) => setEditedTemplate(prev => prev ? { ...prev, language: e.target.value } : null)}
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 appearance-none"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.75rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1rem` }}
                      >
                        <option value="en">English</option>
                        <option value="fr">French</option>
                        <option value="es">Spanish</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                /* Display Information */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Template Code</p>
                    <p className="font-medium text-gray-800">{template.code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Name</p>
                    <p className="font-medium text-gray-800">{template.name}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Description</p>
                    <p className="text-gray-800">{template.description || 'No description provided.'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Channel</p>
                    <div className="flex items-center">
                      {getChannelIcon(template.channel)}
                      <span className="ml-1 font-medium capitalize">{template.channel}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Language</p>
                    <p className="font-medium uppercase">{template.language}</p>
                  </div>

                  {template.lastEdited && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                      <p className="text-gray-800">{new Date(template.lastEdited).toLocaleString()}</p>
                    </div>
                  )}

                  {template.createdAt && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Created</p>
                      <p className="text-gray-800">{new Date(template.createdAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Template Content */}
          <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="font-medium text-gray-800">Template Content</h2>
            </div>
            <div className="p-6">
              {isEditing ? (
                <textarea
                  value={editedTemplate?.content || ''}
                  onChange={(e) => setEditedTemplate(prev => prev ? { ...prev, content: e.target.value } : null)}
                  className="w-full h-48 p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 font-mono text-sm"
                  placeholder="Enter template content here. Use {{token_name}} for variables."
                ></textarea>
              ) : (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  {/* <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
                    {template.content}
                  </pre> */}
                </div>
              )}

              <div className="mt-4 flex items-center text-xs text-gray-500">
                <HelpCircle size={14} className="mr-1" />
                <span>Use <code className="bg-gray-100 px-1 py-0.5 rounded">{'{{token_name}}'}</code> syntax for dynamic content</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tokens & Preview */}
        <div className="space-y-6">
          {/* Tokens List */}
          <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <h2 className="font-medium text-gray-800">Template Tokens</h2>
              {isEditing && (
                <button
                  onClick={() => {
                    if (!editedTemplate) return;
                    setEditedTemplate({
                      ...editedTemplate,
                      tokens: [...editedTemplate.tokens, `token_${editedTemplate.tokens.length + 1}`]
                    });
                  }}
                  className="text-xs text-primary-500 hover:text-primary-600 flex items-center"
                >
                  <Plus size={14} className="mr-1" />
                  Add Token
                </button>
              )}
            </div>
            <div className="p-6">
              {isEditing ? (
                <div className="space-y-3">
                  {editedTemplate?.tokens.map((token, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={token}
                        onChange={(e) => {
                          if (!editedTemplate) return;
                          const newTokens = [...editedTemplate.tokens];
                          newTokens[index] = e.target.value;
                          setEditedTemplate({ ...editedTemplate, tokens: newTokens });
                        }}
                        className="flex-1 p-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                      />
                      <button
                        onClick={() => {
                          if (!editedTemplate) return;
                          setEditedTemplate({
                            ...editedTemplate,
                            tokens: editedTemplate.tokens.filter((_, i) => i !== index)
                          });
                        }}
                        className="p-2 text-gray-400 hover:text-danger-500 hover:bg-danger-50 rounded-lg"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}

                  {editedTemplate?.tokens.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-2">
                      No tokens defined. Add tokens to make your template dynamic.
                    </p>
                  )}
                </div>
              ) : (
                <>
                  {/* <div className="space-y-2">
                    {template?.tokens?.map((token, index) => (
                      <div key={index} className="flex items-center py-2 px-3 bg-gray-50 rounded-lg border border-gray-200">
                        <code className="text-sm font-mono text-gray-800">{token}</code>
                      </div>
                    ))}
                  </div>

                  {template?.tokens?.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">No tokens defined in this template.</p>
                    </div>
                  )} */}
                </>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          {!isEditing && (
            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="font-medium text-gray-800">Quick Actions</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowPreview(true)}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="h-5 w-5 text-primary-500 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Preview</span>
                  </button>

                  <button
                    onClick={handleValidate}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <CheckCircle2 className="h-5 w-5 text-success-500 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Validate</span>
                  </button>

                  <button
                    onClick={handleDuplicate}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <Copy className="h-5 w-5 text-gray-500 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Duplicate</span>
                  </button>

                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-danger-200 hover:bg-danger-50 transition-colors"
                  >
                    <Trash className="h-5 w-5 text-danger-500 mb-2" />
                    <span className="text-sm font-medium text-danger-600">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Usage Stats (Placeholder) */}
          {!isEditing && (
            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="font-medium text-gray-800">Usage Statistics</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm text-gray-500">Last Sent</p>
                      <p className="text-sm text-gray-700">2 days ago</p>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm text-gray-500">Total Sent</p>
                      <p className="text-sm text-gray-700">1,243</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">Success Rate</p>
                      <p className="text-sm text-gray-700">98.4%</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <button className="w-full py-2 text-xs text-center text-primary-600 hover:text-primary-700">
                      View Detailed Analytics
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="font-medium text-lg text-gray-800">Template Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {/* Preview device selector */}
              <div className="mb-6 flex items-center justify-center space-x-4">
                <button className="p-2 rounded-lg text-primary-500 bg-primary-50 border-2 border-primary-200">
                  {template.channel === 'email' ? (
                    <Mail size={20} />
                  ) : template.channel === 'sms' ? (
                    <Smartphone size={20} />
                  ) : (
                    <MessageSquare size={20} />
                  )}
                </button>
              </div>

              {/* Token inputs */}
              {template.tokens.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Preview Values</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {/* {template?.tokens?.map((token) => (
                      <div key={token} className="col-span-1">
                        <label className="block text-xs text-gray-500 mb-1">{token}</label>
                        <input
                          type="text"
                          value={previewTokens[token] || ''}
                          onChange={(e) => handleTokenChange(token, e.target.value)}
                          className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm"
                          placeholder={`Value for ${token}`}
                        />
                      </div>
                    ))} */}
                  </div>
                </div>
              )}

              {/* Preview display */}
              <div className={`
                border border-gray-200 rounded-2xl overflow-hidden p-4 mb-4
                ${template.channel === 'email' ? 'max-w-full bg-white' :
                  template.channel === 'sms' ? 'max-w-xs mx-auto bg-gray-100' : 'max-w-sm mx-auto bg-white'}
              `}>
                {template.channel === 'email' && (
                  <div>
                    <div className="border-b border-gray-200 pb-2 mb-2">
                      <p className="text-sm text-gray-700 font-medium">{template.name}</p>
                      <p className="text-xs text-gray-500">To: recipient@example.com</p>
                    </div>
                    <div className="prose prose-sm">
                      <p>{getPreviewContent()}</p>
                    </div>
                  </div>
                )}

                {template.channel === 'sms' && (
                  <div className="bg-white rounded-xl p-3 text-sm">
                    <p>{getPreviewContent()}</p>
                  </div>
                )}

                {template.channel === 'push' && (
                  <div className="bg-white rounded-lg shadow-sm">
                    <div className="border-b border-gray-100 p-2">
                      <p className="text-xs text-gray-500">App Name</p>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium mb-1">{template.name}</p>
                      <p className="text-xs text-gray-700">{getPreviewContent()}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500 flex items-center">
                <AlertTriangle size={14} className="mr-1" />
                This is a simulation. Actual appearance may vary depending on recipient's device.
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-100 p-6">
            <div className="text-center mb-6">
              <div className="bg-danger-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash className="h-8 w-8 text-danger-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Delete Template</h3>
              <p className="text-gray-500">
                Are you sure you want to delete the template "{template.name}"? This action cannot be undone.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-all"
              >
                Delete Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;

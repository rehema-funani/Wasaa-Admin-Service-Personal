import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, X, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import supportService from '../../../api/services/support';

// Define agent type for editing
interface Agent {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  role: string;
  department: string;
  specializations: string[];
  maxConcurrentChats: number;
  status: string;
}

export default function AgentEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    role: '',
    department: '',
    specializations: [] as string[],
    maxConcurrentChats: 5,
    status: ''
  });

  // Original agent data for comparison/display
  const [agent, setAgent] = useState<Agent | null>(null);

  // New specialization input
  const [newSpecialization, setNewSpecialization] = useState('');

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch agent details
  useEffect(() => {
    const fetchAgentDetails = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const agentData = await supportService.getAgentById(id);
        setAgent(agentData);

        // Set form data from agent data
        setFormData({
          role: agentData.role,
          department: agentData.department,
          specializations: [...agentData.specializations], // Create a copy
          maxConcurrentChats: agentData.maxConcurrentChats,
          status: agentData.status
        });
      } catch (err) {
        setError('Failed to fetch agent details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentDetails();
  }, [id]);

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Handle number conversion for maxConcurrentChats
    if (name === 'maxConcurrentChats') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 1
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Add a new specialization
  const handleAddSpecialization = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpecialization.trim()) return;

    // Check if specialization already exists
    if (formData.specializations.includes(newSpecialization.trim())) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      specializations: [...prev.specializations, newSpecialization.trim()]
    }));
    setNewSpecialization('');
  };

  // Remove a specialization
  const handleRemoveSpecialization = (specializationToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.filter(
        specialization => specialization !== specializationToRemove
      )
    }));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !agent) return;

    setSaving(true);
    setError(null);

    try {
      await supportService.updateAgent(id, formData);
      navigate(`/agents/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update agent');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Delete agent
  const handleDelete = async () => {
    if (!id) return;

    if (!window.confirm('Are you sure you want to delete this agent? This action cannot be undone.')) {
      return;
    }

    try {
      await supportService.deleteAgent(id);
      navigate('/agents');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete agent');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error && !agent) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/agents')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Agents
          </button>
        </div>

        <div className="bg-red-100 p-4 rounded-md text-red-700 mb-4">
          {error || 'Agent not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(`/agents/${id}`)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Agent Details
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Edit Agent: {agent?.user.name}</h1>
          <button
            onClick={handleDelete}
            className="flex items-center px-3 py-1 text-red-600 hover:text-red-800"
            title="Delete Agent"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* User Information (non-editable) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md">
                {agent?.user.name} ({agent?.user.email})
              </div>
              <p className="mt-1 text-sm text-gray-500">
                User information cannot be changed
              </p>
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="support_agent">Support Agent</option>
                <option value="supervisor">Supervisor</option>
                <option value="admin">Administrator</option>
                <option value="specialist">Support Specialist</option>
              </select>
            </div>

            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                id="department"
                name="department"
                required
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Customer Support">Customer Support</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Billing Support">Billing Support</option>
                <option value="Account Management">Account Management</option>
              </select>
            </div>

            {/* Max Concurrent Chats */}
            <div>
              <label htmlFor="maxConcurrentChats" className="block text-sm font-medium text-gray-700 mb-1">
                Max Concurrent Chats <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="maxConcurrentChats"
                name="maxConcurrentChats"
                required
                min="1"
                max="20"
                value={formData.maxConcurrentChats}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                required
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="away">Away</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Specializations */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specializations
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.specializations.map(specialization => (
                <span
                  key={specialization}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {specialization}
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecialization(specialization)}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {formData.specializations.length === 0 && (
                <span className="text-gray-500 text-sm italic">
                  No specializations added yet
                </span>
              )}
            </div>
            <div className="flex">
              <input
                type="text"
                value={newSpecialization}
                onChange={(e) => setNewSpecialization(e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a specialization (e.g. account-issues, billing, technical)"
              />
              <button
                type="button"
                onClick={handleAddSpecialization}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Common specializations: general, account-issues, billing, technical-support, product-knowledge
            </p>
          </div>

          {/* Form Buttons */}
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={() => navigate(`/agents/${id}`)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

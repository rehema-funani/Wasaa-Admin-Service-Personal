import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, ArrowLeft, Plus } from 'lucide-react';
import supportService from '../../../api/services/support';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function AgentCreatePage() {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    userId: '',
    role: 'support_agent',
    department: 'Customer Support',
    specializations: [] as string[],
    maxConcurrentChats: 5
  });

  const [users, setUsers] = useState<User[]>([]);
  const [newSpecialization, setNewSpecialization] = useState('');
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await supportService.getUsers();
        setUsers(response);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
    setLoading(true);
    setError(null);

    try {
      await supportService.createAgent(formData);
      navigate('/agents');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create agent');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Create New Support Agent</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* User Selection */}
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                User <span className="text-red-500">*</span>
              </label>
              {usersLoading ? (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  Loading users...
                </div>
              ) : (
                <select
                  id="userId"
                  name="userId"
                  required
                  value={formData.userId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a user</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              )}
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
              onClick={() => navigate('/agents')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Agent
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

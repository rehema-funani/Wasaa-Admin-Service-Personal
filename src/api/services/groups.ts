import axios from "axios";
import { api } from "../axios";

export const groupService = {
    async getGroups(): Promise<any> {
    try {
      const response = await api.get('/groups');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to get currencies');
      }
      throw new Error('Failed to get currencies. Please check your network connection.');
    }
  },

  async getReportedGroups(): Promise<any> {
    try {
      const response = await api.get('/groups/reported-groups');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to get reported groups');
      }
      throw new Error('Failed to get reported groups. Please check your network connection.');
    }
  },

  async updateReportStatus (groupId: string, status: string): Promise<any> {
    try {
      const response = await api.put(`/groups/${groupId}/report`, { status });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to update report status');
      }
      throw new Error('Failed to update report status. Please check your network connection.');
    }
  },

  async resolveReport (groupId: string): Promise<any> {
    try {
      const response = await api.put(`/groups/${groupId}/resolve`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to resolve report');
      }
      throw new Error('Failed to resolve report. Please check your network connection.');
    }
  },

  async dismissReport (groupId: string): Promise<any> {
    try {
      const response = await api.put(`/groups/${groupId}/dismiss`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to dismiss report');
      }
      throw new Error('Failed to dismiss report. Please check your network connection.');
    }
  },

  async reopenReport (groupId: string): Promise<any> {
    try {
      const response = await api.put(`/groups/${groupId}/reopen`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to reopen report');
      }
      throw new Error('Failed to reopen report. Please check your network connection.');
    }
  },

  async updateGroupStatus (groupId: string, status: string): Promise<any> {
    try {
      const response = await api.put(`/groups/${groupId}`, { status });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to update group status');
      }
      throw new Error('Failed to update group status. Please check your network connection.');
    }
  },

    async deleteGroup (groupId: string): Promise<any> {
        try {
        const response = await api.delete(`/groups/${groupId}`);
        return response.data;
        } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Failed to delete group');
        }
        throw new Error('Failed to delete group. Please check your network connection.');
        }
    },
}

export default groupService;
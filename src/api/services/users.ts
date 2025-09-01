import axios from 'axios';
import { api } from '../axios';
const API_KEY = 'QgR1v+o16jphR9AMSJ9Qf8SnOqmMd4HPziLZvMU1Mt0t7ocaT38q/8AsuOII2YxM60WaXQMkFIYv2bqo+pS/sw==';

type User = {
    id: string;
    name?: string;
    email?: string;
    role?: string;
    avatar?: string;
    roleId?: string;
    permissions?: string[];
};

export const userService = {
  async login(email: string, password: string): Promise<any> {
    try {
      const response = await axios.post<any>(
        "http://138.68.190.213:3010/auth/admin-signin",
        { email, password },
        {
          headers: {
            "x-api-key": `${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Login failed");
      }
      throw new Error("Login failed. Please check your network connection.");
    }
  },

  async setPassword(token: string, password: string): Promise<any> {
    try {
      const response = await axios.post<any>(
        "http://138.68.190.213:3010/admin/set-password",
        { password },
        {
          headers: {
            "x-api-key": `${API_KEY}`,
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to set password"
        );
      }
      throw new Error(
        "Failed to set password. Please check your network connection."
      );
    }
  },

  async verifyOtp(payload: {
    otp: string;
    user_id: string;
    source?: string;
  }): Promise<any> {
    try {
      const response = await axios.post<any>(
        "http://138.68.190.213:3010/auth/verify-otp",
        payload,
        {
          headers: {
            "x-api-key": `${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "OTP verification failed"
        );
      }
      throw new Error(
        "OTP verification failed. Please check your network connection."
      );
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  async getUserById(userId: string): Promise<User> {
    try {
      const response = await api.get<User>(`/users/${userId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to get user data"
        );
      }
      throw new Error(
        "Failed to get user data. Please check your network connection."
      );
    }
  },

  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post("/auth/forgot-password", { email });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to send reset email"
        );
      }
      throw new Error(
        "Failed to send reset email. Please check your network connection."
      );
    }
  },

  async verifyResetToken(token: string): Promise<boolean> {
    try {
      const response = await api.get(`/auth/verify-reset-token/${token}`);
      return response.data.valid;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Invalid or expired token"
        );
      }
      throw new Error(
        "Failed to verify reset token. Please check your network connection."
      );
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post("/auth/reset-password", { token, password: newPassword });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to reset password"
        );
      }
      throw new Error(
        "Failed to reset password. Please check your network connection."
      );
    }
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await api.put<User>("/auth/profile", userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to update profile"
        );
      }
      throw new Error(
        "Failed to update profile. Please check your network connection."
      );
    }
  },

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      await api.post("/auth/change-password", { currentPassword, newPassword });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to change password"
        );
      }
      throw new Error(
        "Failed to change password. Please check your network connection."
      );
    }
  },

  async testConnection(): Promise<boolean> {
    try {
      const response = await api.get("/");
      console.log("API connection test successful:", response.status);
      return true;
    } catch (error) {
      console.error("API connection test failed:", error);
      return false;
    }
  },

  async getUsers(page = 1, pageSize = 10, search = ""): Promise<any> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(search && { search: search.trim() }),
      });

      const response = await api.get(`/users?${params.toString()}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Failed to get users");
      }
      throw new Error(
        "Failed to get users. Please check your network connection."
      );
    }
  },

  async getAdminUsers(currentPage, itemsPerPage): Promise<any> {
    try {
      const response = await api.get(`/admin?page=${currentPage}&pageSize=${itemsPerPage}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to get admin users"
        );
      }
      throw new Error(
        "Failed to get admin users. Please check your network connection."
      );
    }
  },

  async getAdminUserbyId(id: string): Promise<any> {
    try {
      const response = await api.get(`/admin/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to get user by email"
        );
      }
      throw new Error(
        "Failed to get user by email. Please check your network connection."
      );
    }
  },

  async getUserSessions(userId: string): Promise<any> {
    try {
      const response = await api.get(`/sessions/${userId}/admin`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to get user sessions"
        );
      }
      throw new Error(
        "Failed to get user sessions. Please check your network connection."
      );
    }
  },

  revokeSession: async (sessionId: string): Promise<any> => {
    try {
      const response = await api.delete(`/sessions/${sessionId}/revoke`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to revoke session"
        );
      }
      throw new Error(
        "Failed to revoke session. Please check your network connection."
      );
    }
  },

  async getUserLoginHistory(userId: string): Promise<any> {
    try {
      const response = await api.get(`/admin/${userId}/login-history`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to get user login history"
        );
      }
      throw new Error(
        "Failed to get user login history. Please check your network connection."
      );
    }
  },

  async getUserConnectedApps(userId: string): Promise<any> {
    try {
      const response = await api.get(`/admin/${userId}/connected-apps`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to get user connected apps"
        );
      }
      throw new Error(
        "Failed to get user connected apps. Please check your network connection."
      );
    }
  },

  async terminateUserSession(userId: string, sessionId: string): Promise<any> {
    try {
      const response = await api.delete(
        `/admin/${userId}/sessions/${sessionId}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to terminate user session"
        );
      }
      throw new Error(
        "Failed to terminate user session. Please check your network connection."
      );
    }
  },

  async terminateAllUserSessions(userId: string): Promise<any> {
    try {
      const response = await api.delete(`/admin/${userId}/sessions`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to terminate all user sessions"
        );
      }
      throw new Error(
        "Failed to terminate all user sessions. Please check your network connection."
      );
    }
  },

  async updateUserStatus(userId: string, status: string): Promise<any> {
    try {
      const response = await api.put(`/admin/${userId}/status`, { status });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to update user status"
        );
      }
      throw new Error(
        "Failed to update user status. Please check your network connection."
      );
    }
  },

  async revokeUserApp(userId: string, appId: string): Promise<any> {
    try {
      const response = await api.delete(
        `/admin/${userId}/connected-apps/${appId}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to revoke user app"
        );
      }
      throw new Error(
        "Failed to revoke user app. Please check your network connection."
      );
    }
  },

  async resetUserMFA(userId: string): Promise<any> {
    try {
      const response = await api.post(`/admin/${userId}/reset-mfa`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to reset user MFA"
        );
      }
      throw new Error(
        "Failed to reset user MFA. Please check your network connection."
      );
    }
  },

  async getUser(userId: string): Promise<any> {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Failed to get user");
      }
      throw new Error(
        "Failed to get user. Please check your network connection."
      );
    }
  },

  async suspendUser(userId: string): Promise<any> {
    try {
      const response = await api.put(`/users/${userId}/update-status`, {
        status: "inactive",
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to suspend user"
        );
      }
      throw new Error(
        "Failed to block user. Please check your network connection."
      );
    }
  },

  async deleteUserAccount(userId: string): Promise<any> {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to delete user account"
        );
      }
      throw new Error(
        "Failed to delete user account. Please check your network connection."
      );
    }
  },

  async lockUserAccount(userId: string): Promise<any> {
    try {
      const response = await api.put(`/users/${userId}/update-status`, {
        status: "locked",
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to lock user account"
        );
      }
      throw new Error(
        "Failed to lock user account. Please check your network connection."
      );
    }
  },

  async unsuspendUser(userId: string): Promise<any> {
    try {
      const response = await api.put(`/users/${userId}/update-status`, {
        status: "active",
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to unsuspend user"
        );
      }
      throw new Error(
        "Failed to unblock user. Please check your network connection."
      );
    }
  },

  async deleteUser(userId: string): Promise<any> {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Failed to delete user");
      }
      throw new Error(
        "Failed to delete user. Please check your network connection."
      );
    }
  },

  async updateUser(userId: string, userData: any): Promise<any> {
    try {
      const response = await api.put(`/admin/${userId}`, userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Failed to update user");
      }
      throw new Error(
        "Failed to update user. Please check your network connection."
      );
    }
  },

  async createUser(userData: any): Promise<any> {
    try {
      const response = await api.post("/admin", userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Failed to create user");
      }
      throw new Error(
        "Failed to create user. Please check your network connection."
      );
    }
  },

  async updateUserRole(userId: string, roleId: string): Promise<any> {
    try {
      const response = await api.patch(`/users/${userId}/role`, {
        role_id: roleId,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to update user role"
        );
      }
      throw new Error(
        "Failed to update user role. Please check your network connection."
      );
    }
  },

  async sendPasswordReset(id: string): Promise<void> {
    try {
      await api.get(`/admin/${id}/send-password-reset`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to send password reset email"
        );
      }
      throw new Error(
        "Failed to send password reset email. Please check your network connection."
      );
    }
  },

  async getReportedUsers(): Promise<any> {
    try {
      const response = await api.get("/users/reported-users");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to get reported users"
        );
      }
      throw new Error(
        "Failed to get reported users. Please check your network connection."
      );
    }
  },

  async updateReportStatus(userId: string, status: string): Promise<any> {
    try {
      const response = await api.put(`/users/${userId}/report-status`, {
        status,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to update report status"
        );
      }
      throw new Error(
        "Failed to update report status. Please check your network connection."
      );
    }
  },

  async reopenReport(userId: string): Promise<any> {
    try {
      const response = await api.put(`/users/${userId}/reopen-report`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to reopen report"
        );
      }
      throw new Error(
        "Failed to reopen report. Please check your network connection."
      );
    }
  },

  async dismissReport(userId: string): Promise<any> {
    try {
      const response = await api.put(`/users/${userId}/dismiss-report`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to dismiss report"
        );
      }
      throw new Error(
        "Failed to dismiss report. Please check your network connection."
      );
    }
  },

  async resolveReport(userId: string): Promise<any> {
    try {
      const response = await api.put(`/users/${userId}/resolve-report`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to resolve report"
        );
      }
      throw new Error(
        "Failed to resolve report. Please check your network connection."
      );
    }
  },

  async getReports(): Promise<any> {
    try {
      const response = await api.get("/reports/stats");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Failed to get reports");
      }
      throw new Error(
        "Failed to get reports. Please check your network connection."
      );
    }
  },
};

export default userService;

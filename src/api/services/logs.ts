import { logsaudit } from "../logs-audit";

export const logsService = {
  getAuditLogs: async (params?: Record<string, any>) => {
    const response = await logsaudit.get('/audits', { params });
    return response.data;
  },

  getAuditLogById: async (id: string) => {
    const response = await logsaudit.get(`/audits/${id}`);
    return response.data;
  },

  exportAuditLogs: async (format: 'csv' | 'json', filters: Record<string, any> = {}) => {
    const response = await logsaudit.post('/audits/export', {
      format,
      filters
    });
    return response.data;
  }
};

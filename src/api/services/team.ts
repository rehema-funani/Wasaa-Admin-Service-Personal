import { Team, TeamMember, TeamFormData } from '../../types/team';
import { supportaxios } from '../support-axios';

export const teamService = {
  getTeams: async (): Promise<any> => {
    const response = await supportaxios.get('/teams');
    return response.data;
  },

  getTeam: async (id: string): Promise<Team> => {
    const response = await supportaxios.get(`/teams/${id}`);
    return response.data;
  },

  createTeam: async (team: TeamFormData): Promise<Team> => {
    const response = await supportaxios.post('/teams', team);
    return response.data;
  },

  updateTeam: async (id: string, team: TeamFormData): Promise<Team> => {
    const response = await supportaxios.put(`/teams/${id}`, team);
    return response.data;
  },

  deleteTeam: async (id: string): Promise<void> => {
    await supportaxios.delete(`/teams/${id}`);
  },

  // Team Members
  getTeamMembers: async (teamId: string): Promise<TeamMember[]> => {
    const response = await supportaxios.get(`/teams/${teamId}/members`);
    return response.data;
  },

  addTeamMember: async (teamId: string, member: Omit<TeamMember, 'id'>): Promise<TeamMember> => {
    const response = await supportaxios.post(`/teams/${teamId}/members`, member);
    return response.data;
  },

  removeTeamMember: async (teamId: string, memberId: string): Promise<void> => {
    await supportaxios.delete(`/teams/${teamId}/members/${memberId}`);
  },

  updateTeamMember: async (teamId: string, memberId: string, member: Partial<TeamMember>): Promise<TeamMember> => {
    const response = await supportaxios.put(`/teams/${teamId}/members/${memberId}`, member);
    return response.data;
  }
};
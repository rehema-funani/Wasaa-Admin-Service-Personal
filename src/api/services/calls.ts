import type { Call, CallRecording } from '../../types/calls';
import type { User } from '../../types';

const mockUsers: User[] = [
  { id: 'usr_1', name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Online', activeCalls: 2, lastSeen: new Date(Date.now() - 2 * 60 * 1000).toISOString(), isVerified: true, createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), phoneNumber: '+254712345678', country: 'Kenya' },
  { id: 'usr_3', name: 'Peter Jones', email: 'peter.jones@example.com', role: 'Host', status: 'Online', activeCalls: 5, lastSeen: new Date(Date.now() - 1 * 60 * 1000).toISOString(), isVerified: true, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), phoneNumber: '+256712345678', country: 'Uganda' },
  { id: 'usr_4', name: 'Mary Williams', email: 'mary.williams@example.com', role: 'User', status: 'Offline', activeCalls: 0, lastSeen: new Date(Date.now() - 60 * 60 * 1000).toISOString(), isVerified: false, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), phoneNumber: '+255712345678', country: 'Tanzania' },
];

const mockCalls: Call[] = [
    { id: 'call_1', host: mockUsers[1], participants: [mockUsers[0], mockUsers[2]], status: 'Live', type: 'Video', startTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(), quality: { score: 95, latency: 25, jitter: 3, packetLoss: 0.1, bitrate: 1500, resolution: '1080p' }, billing: { escrowAmount: 100, currency: 'KES', paymentMethod: 'M-Pesa', status: 'Locked' } },
    { id: 'call_2', host: mockUsers[2], participants: [mockUsers[1]], status: 'Live', type: 'Audio', startTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(), quality: { score: 85, latency: 40, jitter: 5, packetLoss: 0.5, bitrate: 128 }, billing: { escrowAmount: 50, currency: 'KES', paymentMethod: 'Card', status: 'Locked' } }
];

const mockRecordings: CallRecording[] = [
    { id: 'rec_1', callId: 'call_prev_1', duration: 1230, size: 25000000, hasConsent: true, participants: ['usr_1', 'usr_2'], createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), url: 'https://example.com/rec_1.mp4' },
    { id: 'rec_2', callId: 'call_prev_2', duration: 650, size: 12000000, hasConsent: false, participants: ['usr_3', 'usr_4'], createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), url: 'https://example.com/rec_2.mp4' },
];

export const callsService = {
  getAnalytics: async (period: string) => {
    console.log(`Fetching call analytics for ${period}`);
    // Mock response
    return {
      activeCalls: Math.floor(Math.random() * 500),
      avgDuration: Math.floor(Math.random() * 20),
      avgQoS: Math.floor(Math.random() * 10 + 90),
      activeUsers: Math.floor(Math.random() * 5000),
    };
  },
  getActiveCalls: async (): Promise<Call[]> => {
    console.log('Fetching active calls');
    return Promise.resolve(mockCalls);
  },
  getRecordings: async (params: { limit: number }): Promise<{ data: CallRecording[] }> => {
    console.log(`Fetching recordings with limit ${params.limit}`);
    return Promise.resolve({ data: mockRecordings });
  },
  joinCallAsAdmin: async (callId: string): Promise<{ roomUrl: string }> => {
    console.log(`Joining call ${callId} as admin`);
    return Promise.resolve({ roomUrl: `https://meet.example.com/admin/${callId}` });
  },
  muteUser: async (callId: string, userId: string): Promise<void> => {
    console.log(`Muting user ${userId} in call ${callId}`);
    return Promise.resolve();
  },
  kickUser: async (callId: string, userId: string, reason: string): Promise<void> => {
    console.log(`Kicking user ${userId} from call ${callId} for: ${reason}`);
    return Promise.resolve();
  },
  endCall: async (callId: string, reason?: string): Promise<void> => {
    console.log(`Ending call ${callId} for: ${reason}`);
    return Promise.resolve();
  }
};
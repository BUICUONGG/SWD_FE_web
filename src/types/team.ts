import type { ApiErrorResponse } from './user';

export type { ApiErrorResponse };

export interface TeamMember {
  userId: number;
  fullName: string;
  email: string;
  avatarUrl?: string;
  role: 'LEADER' | 'MEMBER';
  joinedAt: string;
}

export interface Team {
  teamId: number;
  name: string;
  description?: string;
  courseId: number;
  courseName: string;
  leaderId: number;
  leaderName: string;
  maxMembers: number;
  currentMembers: number;
  members: TeamMember[];
  status: 'FORMING' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export interface TeamResponse {
  success: true;
  message: string;
  data: Team;
}

export interface TeamListResponse {
  success: boolean;
  message: string;
  data: Team[];
}

export interface JoinTeamRequest {
  teamId: number;
}

export interface JoinTeamResponse {
  success: true;
  message: string;
  data: {
    teamId: number;
    userId: number;
    joinedAt: string;
  };
}

// Type guards
/* eslint-disable @typescript-eslint/no-explicit-any */
export function isTeamResponse(response: unknown): response is TeamResponse {
  const res = response as any;
  return res && res.success === true && res.data && typeof res.data.teamId === 'number';
}

export function isTeamListResponse(response: unknown): response is TeamListResponse {
  const res = response as any;
  return res && res.success === true && Array.isArray(res.data);
}

export function isJoinTeamResponse(response: unknown): response is JoinTeamResponse {
  const res = response as any;
  return res && res.success === true && res.data && typeof res.data.teamId === 'number';
}

export function isApiError(response: unknown): response is ApiErrorResponse {
  const res = response as any;
  return res && res.success === false && typeof res.message === 'string';
}
/* eslint-enable @typescript-eslint/no-explicit-any */

import type { ApiErrorResponse } from './user';

export type { ApiErrorResponse };

// Match with backend TeamEntity
export type TeamStatus = 'OPENING' | 'CLOSED' | 'COMPLETED';

// Match backend TeamResponse.TeamMemberResponse
export interface TeamMember {
  enrollmentId: number;
  userId: number;
  userFullName: string;
  userEmail: string;
  isLeader: boolean;
  majorName?: string;
  // Legacy fields for compatibility
  id?: number;
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  role?: string;
  joinedAt?: string;
}

// Match backend TeamResponse.IdeaResponse
export interface TeamIdea {
  ideaId: number;
  name: string;
  description?: string;
  ownerId: number;
  ownerName: string;
  isMainIdea: boolean;
}

// Match exactly with backend TeamResponse
export interface Team {
  id: number;
  name: string;
  courseId: number;
  courseName: string;
  courseCode: string;
  semesterId: number;
  semesterName: string;
  mentorId?: number;
  mentorName?: string;
  memberCount: number;
  mainIdeaId?: number;
  mainIdeaName?: string;
  members: TeamMember[];
  ideas?: TeamIdea[];
  
  // Computed fields for compatibility
  status?: TeamStatus;
  leaderId?: number;
  leaderName?: string;
  createdAt?: string;
  updatedAt?: string;
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
  return res && res.success === true && res.data && typeof res.data.id === 'number';
}

export function isTeamListResponse(response: unknown): response is TeamListResponse {
  const res = response as any;
  return res && typeof res.success === 'boolean' && Array.isArray(res.data);
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

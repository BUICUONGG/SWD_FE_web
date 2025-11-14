// Idea Types
export interface Idea {
  ideaId: number;
  name: string;
  description: string;
  enrollment: {
    enrollmentId: number;
    user: {
      userId: number;
      fullName: string;
      email: string;
    };
    course?: {
      courseId: number;
      code: string;
      name: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateIdeaRequest {
  enrollmentId: number;
  name: string;
  description: string;
}

export interface UpdateIdeaRequest {
  enrollmentId: number;
  name: string;
  description: string;
}

export interface IdeaResponse {
  success: boolean;
  message: string;
  data: Idea;
}

export interface IdeaListResponse {
  success: boolean;
  message: string;
  data: Idea[];
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errorCode?: string;
}

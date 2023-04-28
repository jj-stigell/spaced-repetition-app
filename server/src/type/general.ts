import { FindOptions } from 'sequelize';

export type JwtPayload = {
  id: number;
  sessionId: string;
};

export enum Role {
  NON_MEMBER = 'NON_MEMBER',
  MEMBER = 'MEMBER',
  READ_RIGHT = 'READ_RIGHT',
  WRITE_RIGHT = 'WRITE_RIGHT',
  SUPERUSER = 'SUPERUSER'
}

export type LoginResult = {
  id: number;
  role: Role;
  username: string;
  email: string;
  allowNewsLetter: boolean;
  language: string;
  jlptLevel: number;
  sessionId: string;
};

export type BugReportData = {
  bugMessage: string;
  type: string;
  cardId?: number;
};

export type SolvedBugReportData = {
  solved: boolean;
  solvedMessage: string;
};

export interface BugReportQueryParams {
  type?: string;
  page?: number;
  limit?: number;
}

export interface BugReportOptions extends FindOptions {
  where?: {
    type?: string;
  };
}

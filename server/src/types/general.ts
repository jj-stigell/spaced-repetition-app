import { FindOptions } from 'sequelize';

export type JwtPayload = {
  id: number;
  sessionId: string;
};

export type LoginResult = {
  id: number;
  sessionId: string;
};

export enum Role {
  User = 'USER',
  Read = 'READ_RIGHT',
  Write = 'WRITE_RIGHT',
  Super = 'SUPERUSER'
}

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

export type AccountAction = {
  id: number,
  accountId: number;
  type: string;
  expireAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type BugReport = {
  id: number;
  accountId: number;
  cardId: number;
  type: string;
  bugMessage: string;
  solvedMessage: string;
  solved: boolean;
  createdAt: Date;
  updatedAt: Date;
};

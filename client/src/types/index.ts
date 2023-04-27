/* Type for weekly occurring event. */
export interface WeeklyEvent {
  weekday: number
  startHour: number
  endHour: number
  timeZone: string
  multiplier: number
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData extends LoginData {
  username: string
  passwordConfirmation: string
  allowNewsLetter?: boolean
  language: string
}

export enum JlptLevel {
  N1 = 'N1',
  N2 = 'N2',
  N3 = 'N3',
  N4 = 'N4',
  N5 = 'N5',
}

export enum Role {
  NonMember = 'NonMember',
  Member = 'Member',
  AdminRead = 'AdminRead',
  AdminWrite = 'AdminWrite',
  SuperUser = 'SuperUser'
}

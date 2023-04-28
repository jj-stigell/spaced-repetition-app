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

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  newPasswordConfirmation: string
}

export enum JlptLevel {
  N1 = 1,
  N2,
  N3,
  N4,
  N5,
}

export enum Role {
  NON_MEMBER = 'NON_MEMBER',
  MEMBER = 'MEMBER',
  READ_RIGHT = 'READ_RIGHT',
  WRITE_RIGHT = 'WRITE_RIGHT',
  SUPERUSER = 'SUPERUSER'
}

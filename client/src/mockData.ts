import { AccountState } from './features/account/accountSlice'
import { JlptLevel, Role } from './types'

export const loggedInAccount: AccountState = {
  isLoggedIn: true,
  account: {
    role: Role.Member,
    jlptLevel: JlptLevel.N5,
    username: 'testingMan',
    email: 'test@test.com'
  }
}

export interface JLPT {
  id: string
  name: string
}

export interface Category {
  id: string
  name: string
}

export const jlptLevels: JLPT[] = [
  {
    id: 'N1',
    name: 'JLPT N1'
  },
  {
    id: 'N2',
    name: 'JLPT N2'
  },
  {
    id: 'N3',
    name: 'JLPT N3'
  },
  {
    id: 'N4',
    name: 'JLPT N4'
  },
  {
    id: 'N5',
    name: 'JLPT N5'
  }
]

export const categories: Category[] = [
  {
    id: 'KANJI',
    name: 'Learn japanese kanji'
  },
  {
    id: 'VOCAB',
    name: 'Learn japanese vocabulary'
  },
  {
    id: 'GRAMMAR',
    name: 'Learn japanese grammar'
  },
  {
    id: 'LISTENING',
    name: 'Learn japanese listening'
  }
]

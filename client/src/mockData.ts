import { AccountState } from './features/account/accountSlice'

export const loggedInAccount: AccountState = {
  token: 'oiueireuwrpopwefiopewif043948roeiweor',
  isLoggedIn: false,
  account: {
    role: 'USER-MEMBER',
    username: 'testingMan',
    email: 'test@test.com',
    sessionId: '23423432-9534759-58943fokf',
    sessions: null
  }
}

export const logInErrorResponse: string[] = ['userOrPassIncorrectError', 'noDueCardsError']

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

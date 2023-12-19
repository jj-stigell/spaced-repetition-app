/* Password validator for register/update password page */

interface EvaluationResult {
  label: string
  color: string
}

const errorMain: string = '#f44336'
const warningDark: string = '#ffc107'
const orangeMain: string = '#ffab91'
const successMain: string = '#00e676'
const successDark: string = '#00c853'

// has number
function hasNumber (value: string): boolean {
  return /[0-9]/.test(value)
}

// has mix of small and capitals
function hasMixed (value: string): boolean {
  return /[a-z]/.test(value) && /[A-Z]/.test(value)
}

// has special chars
function hasSpecial (value: string): boolean {
  return /[!#@$%^&*)(+=._-]/.test(value)
}

// set color based on password strength
export function strengthColor (count: number): EvaluationResult {
  if (count < 2) return { label: 'poor', color: errorMain }
  if (count < 3) return { label: 'weak', color: warningDark }
  if (count < 4) return { label: 'normal', color: orangeMain }
  if (count < 5) return { label: 'good', color: successMain }
  return { label: 'strong', color: successDark }
}

// password strength indicator
export function strengthIndicator (value: string): number {
  let strengths = 0
  if (value.length > 5) strengths++
  if (value.length > 7) strengths++
  if (hasNumber(value)) strengths++
  if (hasSpecial(value)) strengths++
  if (hasMixed(value)) strengths++
  return strengths
}

const tokenKey = 'user_token'

export function getToken() {
  return localStorage.getItem(tokenKey)
}

export function setToken(token) {
  localStorage.setItem(tokenKey, token)
}

export function removeToken() {
  localStorage.removeItem(tokenKey)
}

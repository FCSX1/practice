import Cookies from 'js-cookie'

// 设置一个独一无二的key
const TokenKey = 'hr-token'
// 设置一个独一无二的时间戳
const timeKey = 'hr-time'

// 设置共享token
export function getToken() {
  return Cookies.get(TokenKey)
}

// 设置token
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

// 清空token
export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 获取时间戳
export function getTimeStamp() {
  return Cookies.get(timeKey)
}

// 读取时间戳
export function setTimeStamp() {
  Cookies.set(timeKey, Date.now())
}

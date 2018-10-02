import storage from 'good-storage'
const USER_INFO = '__userInfo__'
const IS_LOGIN = '__isLogin__'
const MEMBER_ID = '__memberId__'

export function setUserInfo (val) {
  storage.set(USER_INFO, val)
}

export function getUserInfo () {
  return storage.get(USER_INFO, {})
}

export function setIsLogin (val) {
  storage.set(IS_LOGIN, val)
}

export function getIsLogin () {
  return storage.get(IS_LOGIN, {})
}

export function setMemberId (val) {
  storage.set(MEMBER_ID, val)
}

export function getMemberId () {
  return storage.get(MEMBER_ID, '')
}

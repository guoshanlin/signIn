import {getUserInfo, getIsLogin, getMemberId} from 'js/cache'

const state = {
  userData: getUserInfo(),
  isLogin: getIsLogin(),
  memberId: getMemberId(),

  draftActivity: null     // 草稿活动数据
}

export default state

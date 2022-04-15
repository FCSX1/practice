import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'

import { login, getUserInfo, getUserId } from '@/api/user'

import { resetRouter } from '@/router'

// 数据
const state = {
  // 共享token
  token: getToken(),
  userInfo: {}
}

const mutations = {
  setToken(state, token) {
    state.token = token // 将token存入vuex
    setToken(token) // 同步缓存
  },
  removeToken(state) {
    state.token = null // 将vuex的数据清空
    removeToken()
  },
  setUserInfo(state, result) {
    state.userInfo = result
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}

const actions = {
  async login(context, data) {
    // 调用api接口
    // 拿到token
    const result = await login(data)
    // 设置token
    context.commit('setToken', result)
    setTimeStamp() // 设置当前时间戳
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    // 获取用户的详情  用户详情的数据
    const baseInfo = await getUserId(result.userId)
    // 提交到mutations
    context.commit('setUersInfo', ...result, ...baseInfo)
    return result
  },
  // 登出
  logout(context) {
    // 删除token
    context.commit('removeToken')
    // 删除用户资料
    context.commit('removeUserInfo')
    // 重置路由
    resetRouter()
    // 去设置权限模块下路由为初始状态
    context.commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

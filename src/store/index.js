import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import token from './modules/token'
import http from '@/views/Authentication/api/service'

Vue.use(Vuex)

const state = {
  areaAllList: [],
  getUserMsg: sessionStorage.getItem('getUserMsg')?sessionStorage.getItem('getUserMsg'):localStorage.getItem('NewgetUserMsg'), // 当前账户token
  getMeunActive: '', // 菜单跳转的id
  applicationStatus:'',
}

const mutations = {
  GET_AREA_ALL_LIST: (state, data) => {
    state.areaAllList = data
  },
  getUserMsg(state) {
    if (sessionStorage.getItem('getUserMsg')) {
      state.getUserMsg = sessionStorage.getItem('getUserMsg')
    } else if (sessionStorage.getItem('getUserMsg') != '' && localStorage.getItem('NewgetUserMsg')) {
      state.getUserMsg = localStorage.getItem('NewgetUserMsg')
    }
  },
  applicationStatus(state,data){
    state.applicationStatus = data
  },
  getMeunActive:(state,data) => {
    state.getMeunActive = data
  }
}

const actions = {
  setAreaAllList({ commit, state }) {
    return new Promise(resolve => {
      const param ={
        id:'100000'
      }
      http.getArea(param).then(response => {
        const list = JSON.parse(JSON.stringify(response.data.datas[0].children))
        commit('GET_AREA_ALL_LIST', list)
        resolve()
      })
    })
  },
  getMeunActive(state,data) {
    // state.getMeunActive = data
  },
  applicationStatus(state,data){
  }
}

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    token
  },
  getters,
  state,
  mutations,
  actions
})

export default store

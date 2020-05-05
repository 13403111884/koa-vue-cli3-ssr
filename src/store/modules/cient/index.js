import state from './state'
import mutations from './mutations'

export default {
  namespaced: true,
  state,
  mutations,
  getters: {
    tableData: state => state.tableData
  },
  actions: {
    getClient ({ commit }, item = {}) {
      commit('getClient', item)
    },
    addClient ({ commit }, item) {
      commit('addClient', item)
    },
    addBusiness({ commit }, item) {
      commit('addBusiness', item)
    },
    editClient ({ commit }, item) {
      commit('editClient', item)
    },
    deleteClient ({ commit }, item) {
      commit('deleteClient', item)
    }
  }
}

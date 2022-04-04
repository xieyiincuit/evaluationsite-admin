//initial state
const state = () => ({
    user: null,
})

//getters
const getters = {

}

// actions
const actions = {
}

// mutations
const mutations = {
    saveUserInfo(state, userInfo) {
        state.user = userInfo.profile
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import tagsView from './modules/tagsView'
import identity from './modules/identity'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        app,
        tagsView,
        identity
    }
})

export default store

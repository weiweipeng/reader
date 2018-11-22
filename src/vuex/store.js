import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    tabListShow: true,
    userInfo: null,
    checkSubject: [],
    checkClass: [],
    grade: null
}
const mutations={
    tabListHide: function(state){
        state.tabListShow = false;
    },
    tabListShow: function(state){
        state.tabListShow = true;
    },
    getUserInfo: function(state, data){
        state.userInfo = data;
    },
    getCheckSubject: function(state, data){
    	state.checkSubject = data;
    },
    getCheckClass: function(state, data){
    	state.checkClass = data;
    },
    getGrade: function(state, data){
    	state.grade = data;
    }
}


export default new Vuex.Store({
    state,mutations
});

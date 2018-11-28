import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    tabListShow: true,
    userInfo: null,
    checkSubject: [],
    checkClass: [],
    accounts: {},
    postArticelData: {},
    schoolId:'',
    techerId:'',
    classOrPerson:false,//判断是班级还是个人任务
    checkStu: [],
   
    grade: null,
    classes: []
}
const mutations={
    tabListHide: function(state){
        state.tabListShow = false;
    },
    tabListShow: function(state){
        state.tabListShow = true;
    },
    studentListShow: function(state,data){
    	state.classOrPerson=data;
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
    },
    getClasses: function(state, data){
    	state.classes = data;
    },
    getAccountData: function(state,data){
    	state.accounts=data;
    },
    getAccountDatas: function(state,data){
    	state.accounts=data;
    },
    getPostArticelData: function(state,data){
    	state.postArticelData=data;
    },
    getSchoolId: function(state, data){
    	state.schoolId=data;
    },
    getTeacherId: function(state ,data){
    	state.TeacherId=data;
    },
    getStudentList: function(state, data){
    	state.checkStu=data;
    }
}


export default new Vuex.Store({
    state,mutations
});

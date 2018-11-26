<template>
	<div id="releaseTask" class="bg-wrap">
		<!--header-->
		<div class="header-title mui-text-center">
			<span>布置作业</span>
			<a class="iconfont icon-tuichu3" @click="goOut"></a>
		</div>
		<div id="main-scroll" class="mui-scroll-wrapper">
			<div class="mui-scroll">
				<!--list-->
				<ul class="mui-table-view mui-table-view-chevron">
					<li class="mui-table-view-cell">
						<a class="mui-navigate-right" @tap="picker">
							<i class="iconfont icon-gengduoneirong"></i>
							<span>选择年级</span>
							<span class="mui-pull-right" v-text="checkGrade"></span>
						</a>
					</li>
					<li class="mui-table-view-cell">
						<router-link to="/classList" class="mui-navigate-right">
							<i class="iconfont icon-weibiaoti-_huabanfuben"></i>
							<span>选择班级</span>
							<span class="mui-pull-right" v-if="SubjectClass.length === 0">未选择</span>
							<div class="checkBox">
								<p v-for="sub in SubjectClass" v-text="sub.name"></p>
							</div>
						</router-link>
					</li>
					<li class="mui-table-view-cell">
						<router-link to="/studentList" class="mui-navigate-right">
							<i class="iconfont icon-weibiaoti-_huabanfuben"></i>
							<span>选择学生</span>
							<span class="mui-pull-right" v-if="SubjectClass.length === 0">未选择</span>
							<div class="checkBox">
								<p v-for="sub in SubjectClass" v-text="sub.name"></p>
							</div>
						</router-link>
					</li>
					<li class="mui-table-view-cell">
						<a class="mui-navigate-right" @tap="pickerClassOrPerson">
							<i class="iconfont icon-gengduoneirong"></i>
							<span>选择练习类型</span>
							<span class="mui-pull-right" v-text="practiceName"></span>
						</a>
					</li>
					<li class="mui-table-view-cell">
						<a class="mui-navigate-right" @tap="pickerBig">
							<i class="iconfont icon-gengduoneirong"></i>
							<span>选择大知识点</span>
							<span class="mui-pull-right" v-text="bigKnow"></span>
						</a>
					</li>
					<li class="mui-table-view-cell">
						<a class="mui-navigate-right" @tap="pickerSmall">
							<i class="iconfont icon-gengduoneirong"></i>
							<span>选择小知识点</span>
							<span class="mui-pull-right" v-text="smallKnow"></span>
						</a>
					</li>
					<li class="mui-table-view-cell">
						<a class="mui-navigate-right" @tap="pickerDifficult">
							<i class="iconfont icon-gengduoneirong"></i>
							<span>选择难度</span>
							<span class="mui-pull-right" v-text="diffcultyStr"></span>
						</a>
					</li>
					
					
					<li class="mui-table-view-cell">
						<router-link :to="{path:'/articleList',query: {checkGrade: checkGrade}}" class="mui-navigate-right">
							<i class="iconfont icon-svgwrite"></i>
							<span>选择篇章</span>
							<span class="mui-pull-right" v-if="checkSubject.length === 0">未选择</span>
							<span class="mui-pull-right" v-else v-text="checkSubject.length"></span>
							<!--<div class="checkBox">
								<p  v-text="checkSubject.length"></p>
							</div>-->
						</router-link>
					</li>
					<li class="mui-table-view-cell">
						<a class="mui-navigate-right" @tap="pickerTime">
							<i class="iconfont icon-riqi1"></i>
							<span>做题日期</span>
							<span class="mui-pull-right" v-text="checkTime"></span>
						</a>
					</li>
					<li class="mui-table-view-cell">
						<a class="mui-navigate-right" @tap="checkUseTime">
							<i class="iconfont icon-shijian1"></i>
							<span>做题用时</span>
							<span class="mui-pull-right" v-text="timeOfUse"></span>
						</a>
					</li>
				</ul>
				<div class="submit-btn-wrap">
					<button class="picker-btn picker-btn-block" :disabled="disable" type="button" @tap="sendTask">布置作业</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import store from '@/vuex/store'
export default {
  	name: 'releaseTask',
  	store,
  	data: function(){
      	return {
      		userInfo: null,
      		bigKnow: "",
      		smallKnow:　"",
      		jsonsBigData: [],
      		jsonsSmallData:[],
      		jsonGetGrade: {},
      		getArticleJson: {},
      		diffcultyStr: "",
      		classOrperson: true,
      		practiceName: '',
      		classInfo: [],
			grade: [],
			gradeId:1,
			checkGrade: '',
			textList: [],
			checkSubject: [],
			SubjectClass: [],
			checkTime: '',
			timeOfUse: '默认不限制',
			disable: false
      	}
   	},
   	watch: {
		$route(to, from) {
			if(store.state.userInfo && from.name == 'login'){
				this.classInfo= [];
				this.grade= [];
				this.checkGrade= '';
				this.textList= [];
				this.checkSubject= [];
				this.SubjectClass= [];
				this.checkTime= '';

				this.userInfo = store.state.userInfo;
	   			this.checkTime = this.getNowTime();
//	   			this.initGetData();
//	   			this.getInfo();
			}
			if(from.name == 'classList'){
				this.SubjectClass = store.state.checkClass;
				
			}
			if(from.name == 'articleList'){
				this.checkSubject = store.state.checkSubject;
			}
		}
	},
   	activated: function(){
   		if(!store.state.userInfo){
   			this.$router.push({path: '/login'});
   		}
   	},
   	created: function(){
   		if(store.state.userInfo){
   			this.userInfo = store.state.userInfo;
   			this.checkTime = this.getNowTime();
// 			this.getInfo();
   		}
   	},
   	mounted: function() {
   		//初始化滚动组件
   		mui('.mui-scroll-wrapper').scroll({deceleration:0.002});
   	},
   	methods: {
   		initGetData: function(pid){
   			var id=pid!=undefined?pid:0;
   			var _this=this;
			this.jsonGetGrade={
				'PId': id,
				'Code': 2,
				'Grade': _this.gradeId,
				'Term': 1,
				'TOKEN': store.state.userInfo
			};
			this.$http.post("http://ksapi.keys-edu.com//api/common/GetKnowledgeList" , _this.jsonGetGrade , {"emulateJSON":true}).then(function(res){
				var gradeData = JSON.parse(res.body);
				
				if(pid==undefined){
					_this.jsonsBigData=JSON.parse(gradeData.Data);
				}else{
					_this.jsonsSmallData=JSON.parse(gradeData.Data);
				}
			},function(err){
				
			});
		},
		picker: function(){
			var _this = this;
			var picker3 = new mui.PopPicker();

			var newData = [
					{
						text: '一二年级',
						value: '1'
						
					},
					{
						text: '三年级',
						value: '3'
					}]
			
			picker3.setData(newData);
			picker3.show(function(items) {
				
				_this.checkGrade = items[0].text;
				_this.gradeId = items[0].value;
				_this.initGetData();

				
			});
		},
		pickerClassOrPerson :function(){
			var _this=this;
			var picker4 = new mui.PopPicker();

			var newData = [
					{
						text: '班级练习',
						value: true
						
					},
					{
						text: '个人练习',
						value: false
					}]
			
			picker4.setData(newData);
			picker4.show(function(items) {
				
				_this.practiceName = items[0].text;
				_this.classOrperson = items[0].value;
//				_this.initGetData();

				
			});
		},
		pickerBig: function(){
			var _this = this;
			
			var items={};
			var newData=[];
			
			for(var item in _this.jsonsBigData){
				var itemsObj={};
				itemsObj.value=_this.jsonsBigData[item].KnowledgePointId;
				itemsObj.text=_this.jsonsBigData[item].Name;
				
				newData.push(itemsObj);
			}
			
			var picker1 = new mui.PopPicker();
			picker1.setData(newData);	
			picker1.show(function(itemes){
				_this.bigKnow=itemes[0].text;
				_this.initGetData(itemes[0].value);
				
			});
		},
		pickerSmall: function(){
		 	var _this=this;
			var items={};
			var newData=[];
			
			for(var item in _this.jsonsSmallData){
				var itemsObj={};
				itemsObj.value=_this.jsonsSmallData[item].KnowledgePointId;
				itemsObj.text=_this.jsonsSmallData[item].Name;
				
				newData.push(itemsObj);
			}
			
			this.getArticleJson=_this.jsonGetGrade;
			this.getArticleJson.PageIndex=1;
			this.getArticleJson.PageSize=10;
			this.getArticleJson.Difficulty='';
			this.getArticleJson.Author=store.state.accounts.UserAccountId;
			delete this.getArticleJson.PId;
			delete this.getArticleJson.Code;
			var picker1 = new mui.PopPicker();
			picker1.setData(newData);	
			picker1.show(function(itemes){
				_this.smallKnow=itemes[0].text;
//				_this.initGetData(itemes[0].value);
				_this.getArticleJson.KnowledgePointId=itemes[0].value;
				store.commit('getPostArticelData',_this.getArticleJson);

			});
		},
		pickerDifficult: function(){
			var _this=this;
			var picker2=new mui.PopPicker();
			var diffData=[{
				text: 'A',
				value: 'A'
			},{
				text: 'B',
				value: 'B'
			},{
				text: 'C',
				value: 'C'
			}];
			picker2.setData(diffData)
			picker2.show(function(item){
				_this.diffcultyStr=item[0].value;
				_this.getArticleJson.Difficulty=item[0].value;
			});
		},
   		getInfo: function(){
   			var _this =this;
   			var classInfo = _this.userInfo.classList;
   			classInfo.forEach(function(json, index){
				if(_this.grade.length === 0){
					_this.grade.push(json.GradeName);
				}else{
					_this.grade.forEach(function(item, num){
						if(item != json.GradeName){
							_this.grade.push(json.GradeName);
						}
					})
				}
			})
   			
   			store.commit('getGrade', _this.grade);
			_this.checkGrade = _this.grade[0]+'-上学期-U1';
   		},
   		getData: function(){
			var _this = this;
			var checkGrade = _this.checkGrade.split('-');
			var options = {
				Grade: checkGrade[0],
				Term: checkGrade[1],
				Pagesize: _this.pSize,
				Pagination: _this.page,
				OrderBy: 'Sort ASC'
			}
			this.$http.post("http://syapp.keys-edu.com/api/Subject/GetData", options).then(function(res){

				_this.textList.push.apply(_this.textList, res.body);
				_this.page ++ ;
				mui('#pullrefresh').pullRefresh().endPullupToRefresh((res.body.length === 0));
			}, function(err){
				console.log(err);
			})
		},
		
		pickerTime: function(){
			var _this = this;
			var dtpicker = new mui.DtPicker({
			    type: "date"
			}) 
			dtpicker.show(function(e) {
			    
			    var checkTime = e.text;
			    if(_this.checkTime != checkTime){
			    	_this.checkTime = checkTime;
			    }
			    	
			})
		},
		checkUseTime: function(){
			var _this = this;
			var btnArray = ['取消', '确定'];
			mui.prompt('', '请选择学生做题用时（单位/分钟）', '启思教育', btnArray, function(e) {
				if (e.index == 1) {
					_this.timeOfUse = e.value + '分钟';
				}
			},'div');
		},
		sendTask: function(){
			var _this = this;
			if(!store.state.userInfo){
				mui.alert('登录过期,请重新登录！',function(){
					_this.$router.push({path: '/login'});
				});
				return false;
			}
			if(_this.SubjectClass.length === 0) {
				mui.alert('请选择班级!', '启思教育');
				return false;
			}else if(_this.checkSubject.length === 0){
				mui.alert('请选择篇章!', '启思教育');
				return false;
			}else if(_this.checkSubject.length > 5){
				mui.alert('不能超过5篇!', '启思教育');
				return false;
			}else{
				_this.disable = true;
//				var SubjectId = '',subjectScore = 0,wringtingScore = 0, subjectWords = 0;
//				_this.checkSubject.forEach(function(json, index){
//					if(_this.checkSubject.length === (index + 1)){
//						SubjectId += json.Id;
//						return false;
//					}else{
//						SubjectId += json.Id + '|';
//					}
//					if(json.wringtingScore){
//						wringtingScore += json.wringtingScore;
//					}
//					subjectScore += json.Fraction;
//					subjectWords += json.Words;
//				})
				var subjectStr='';
				for(var j=0;j<_this.checkSubject.length;j++){
					subjectStr+=_this.checkSubject[j]+',';
				}
				var classIdStr='';
				for(var i=0;i<_this.SubjectClass.length;i++){
					classIdStr+=_this.SubjectClass[i].Id+',';
				}
				var options = {
					Name: "班级练习",
					SubjectId: subjectStr,
					ClassesId: classIdStr,
					SchoolId: store.state.schoolId,
					TeacherName: store.state.accounts.UserAccountId,
					TeacherId: store.state.TeacherId,
					TaskType: 1,
					WriteTime: _this.checkTime,
					EndTime: 0
				};
				if(_this.timeOfUse != '默认不限制'){
					options.EndTime = _this.timeOfUse;
				}
//				options.ObjectID = '';
//				_this.SubjectClass.forEach(function(json, index){
//					if(_this.SubjectClass.length === (index + 1)){
//						options.ObjectID += json.ClassId
//						return false;
//					}else{
//						options.ObjectID += json.ClassId + '|';
//					}
//				})
console.log(_this.SubjectClass)
//				for(var i=0;i<_this.SubjectClass.length;i++){
//					options.ClassesId=_this.SubjectClass[i].Id;
					_this.$http.post("http://ksapi.keys-edu.com///api/task/insertteachertask", options, {"emulateJSON":true}).then(function(res){
						_this.disable = false;
						mui.alert('练习发送成功!', '启思教育', function() {
							_this.checkSubject= [];
							_this.SubjectClass= [];
							_this.checkTime= _this.getNowTime();
							_this.timeOfUse= '默认不限制';
							store.commit('getCheckSubject', null);
							store.commit('getCheckClass', null);
							
						});
						
					}, function(err){
						_this.disable = false;
						mui.alert('练习发送失败!', '启思教育');
						console.log(err);
					})
//				}
				
				
			}
		},
		getNowTime: function(){
			var time = new Date();
			var year=time.getFullYear(); //获取当前年份
			var mon=(time.getMonth()+1).toString(); //获取当前月份
			var day=(time.getDate()).toString(); //获取当前日
			mon = mon.length === 1 ? '0' + mon : mon;
			day = day.length === 1 ? '0' + day : day;
			return year + '-' + mon + '-' + day;
		},
		goOut: function(){
			var _this = this;
			var btnArray = ['否', '是'];
			mui.confirm('您确认要退出吗？', '启思教育', btnArray, function(e) {
				if(e.index == 1) {
					_this.$router.push({path: '/login'});
				}
			})
		}
   	}
}
</script>
<style lang="scss">
#releaseTask{
	.mui-scroll-wrapper{
		bottom: 1.3rem;
	}
	.mui-table-view{
		margin-top: 10px;
	}
	.mui-table-view-cell{
		padding: .3rem .4rem;
		font-size: .36rem;
		.iconfont{
			color: #4aad6a;
			margin-right: .15rem;
		}
		>a:not(.mui-btn){
			margin: -.3rem -.4rem;
		}
		.mui-navigate-right{
			.mui-pull-right{
				padding-right: .5rem;
				color: #999;
			}
		}
		.mui-navigate-right:after, .mui-push-right:after{
			right: .3rem;
		}
	}
	.mui-table-view-cell:after{
		background-color: #ddd;
	}
	.mui-table-view:after,.mui-table-view:before{
		display: none;
	}
	.submit-btn-wrap{
		margin-top: 1rem;
		margin-bottom: 1rem;
	    width: 100%;
	    text-align: center;
	}
	.picker-btn {
	    border-radius: .1rem;
	    background: #4aad6a;
	    border: none;
	    color: #FFFFFF;
	    font-weight: bold;
	    width: 50%;
	    line-height: 1rem;
	    height: 1rem;
	}
	.submit-btn-wrap .picker-btn-block{
		width: 90%;
	}
	.checkBox{
		padding-left: .6rem;
	}
}

</style>
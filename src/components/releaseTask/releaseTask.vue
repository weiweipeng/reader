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
							<span>选择范围</span>
							<span class="mui-pull-right" v-text="checkGrade"></span>
						</a>
					</li>
					<li class="mui-table-view-cell">
						<router-link to="/classList" class="mui-navigate-right">
							<i class="iconfont icon-weibiaoti-_huabanfuben"></i>
							<span>选择班级</span>
							<span class="mui-pull-right" v-if="SubjectClass.length === 0">未选择</span>
							<div class="checkBox">
								<p v-for="sub in SubjectClass" v-text="sub.ClassName"></p>
							</div>
						</router-link>
					</li>
					<li class="mui-table-view-cell">
						<router-link :to="{path:'/articleList',query: {checkGrade: checkGrade}}" class="mui-navigate-right">
							<i class="iconfont icon-svgwrite"></i>
							<span>选择篇章</span>
							<span class="mui-pull-right" v-if="checkSubject.length === 0">未选择</span>
							<div class="checkBox">
								<p v-for="sub in checkSubject" v-text="sub.SubjectName"></p>
							</div>
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
      		classInfo: [],
			grade: [],
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
	   			this.getInfo();
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
   			this.getInfo();
   		}
   	},
   	mounted: function() {
   		//初始化滚动组件
   		mui('.mui-scroll-wrapper').scroll({deceleration:0.002});
   	},
   	methods: {
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
				console.log(res.body);
				_this.textList.push.apply(_this.textList, res.body);
				_this.page ++ ;
				mui('#pullrefresh').pullRefresh().endPullupToRefresh((res.body.length === 0));
			}, function(err){
				console.log(err);
			})
		},
		picker: function(){
			var _this = this;
			var picker3 = new mui.PopPicker({
				layer: 3
			});
			var greadData = [];
			_this.grade.forEach(function(json, index){
				var newData = {
					text: json,
					children: [
						{
							text: '上学期',
							children: [
								{text: 'U1'},
								{text: 'U2'}
							]
						},
						{
							text: '下学期',
							children: [
								{text: 'U1'},
								{text: 'U2'}
							]
						}
					]
				}
				greadData.push(newData);
			})
			picker3.setData(greadData);
			picker3.show(function(items) {
				var checkGrade = items[0].text + '-' + items[1].text + '-' + items[2].text;
				if(_this.checkGrade != checkGrade){
					_this.checkGrade = checkGrade;
					//重置
					_this.checkSubject = [];
			   		_this.SubjectClass = [];
					store.commit('getCheckSubject', null);
					store.commit('getCheckClass', null);
				}
				
			});
		},
		pickerTime: function(){
			var _this = this;
			var dtpicker = new mui.DtPicker({
			    type: "date"
			}) 
			dtpicker.show(function(e) {
			    console.log(e);
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
				var SubjectId = '',subjectScore = 0,wringtingScore = 0, subjectWords = 0;
				_this.checkSubject.forEach(function(json, index){
					if(_this.checkSubject.length === (index + 1)){
						SubjectId += json.Id;
						return false;
					}else{
						SubjectId += json.Id + '|';
					}
					if(json.wringtingScore){
						wringtingScore += json.wringtingScore;
					}
					subjectScore += json.Fraction;
					subjectWords += json.Words;
				})
				var options = {
					SubjectId: SubjectId,
					Score: subjectScore + wringtingScore,
					SubjectScore: subjectScore,
					WritingSkillScore: wringtingScore,
					Words: subjectWords,
					TeacherId: _this.userInfo.UserId,
					TeacherName: _this.userInfo.UerName,
					TaskType: 1,
					WriteTime: _this.checkTime
				};
				if(_this.timeOfUse != '默认不限制'){
					options.EndTime = _this.timeOfUse;
				}
				options.ObjectID = '';
				_this.SubjectClass.forEach(function(json, index){
					if(_this.SubjectClass.length === (index + 1)){
						options.ObjectID += json.ClassId
						return false;
					}else{
						options.ObjectID += json.ClassId + '|';
					}
				})
				_this.$http.post("http://syapp.keys-edu.com/api/TeacherTask/SendTask", options).then(function(res){
					console.log(res.body);
					mui.alert('练习发送成功!', '启思教育', function() {
						_this.checkSubject= [];
						_this.SubjectClass= [];
						_this.checkTime= _this.getNowTime();
						_this.timeOfUse= '默认不限制';
						store.commit('getCheckSubject', null);
						store.commit('getCheckClass', null);
						_this.disable = false;
					});
				}, function(err){
					_this.disable = false;
					mui.alert('练习发送失败!', '启思教育');
					console.log(err);
				})
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
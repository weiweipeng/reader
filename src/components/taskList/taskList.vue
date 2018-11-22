<template>
	<div id="taskList" class="bg-wrap">
		<!--header-->
		<div class="header-title mui-text-center">
			<span>检查作业</span>
			<a class="iconfont icon-tuichu3" @click="goOut"></a>
		</div>
		<!--选择班级-->
		<ul class="mui-table-view mui-table-view-chevron">
			<li class="mui-table-view-cell">
				<a class="mui-navigate-right" @click="picker">
					<i class="iconfont icon-gengduoneirong"></i>
					<span>选择要检查的班级</span>
					<span class="mui-pull-right" v-text="checkClass"></span>
				</a>
			</li>
		</ul>
		<!--列表-->
		<div class="mui-scroll-wrapper">
			<div id="taskScroll" class="mui-scroll">
				<ul class="mui-table-view mui-table-view-striped mui-table-view-condensed">
			        <li class="mui-table-view-cell" v-for="item in taskList">
			            <a @tap="goHref(item.Id)" class="mui-navigate-right">
			            	<h4 class="mui-ellipsis" v-text="item.Name"></h4>
			            </a>
			        </li>
			    </ul>
				
			</div>
		</div>		
				
				
	</div>
</template>

<script>
import store from '@/vuex/store'
export default {
  	name: 'taskList',
  	store,
  	data: function(){
      	return {
      		checkClass: '未选择',
      		checkClassId: null,
      		classList: [],
      		taskList: [],
      		pSize: 20,
			page: 1,
			self: null
      	}
   	},
   	watch: {
		$route(to, from) {
			if(store.state.userInfo && from.name == 'releaseTask'){
				this.checkClassId = null;
				this.classList = [];
				this.taskList = [];
				this.page = 1;
				
				this.init();
				this.pullRefresh();
			}
		}
	},
	created: function(){
		if(store.state.userInfo){
			this.init();
			this.pullRefresh();
		}
			
	},
   	mounted: function() {
   		var deceleration = mui.os.ios?0.003:0.0009;
		mui('.mui-scroll-wrapper').scroll({bounce: false, deceleration:deceleration});
   	},
   	activated: function(){
   		
   	},
   	methods: {
   		init: function(){
   			var _this = this, grade = store.state.grade, classList = store.state.userInfo.classList;
	   		grade.forEach(function(json, index){
	   			var className = {
		   				text: json,
		   				children: []
		   			}
	   			classList.forEach(function(item, num){
	   				var ClassName = {
	   					text: item.ClassName,
	   					value: item.ClassId
	   				}
	   				if(json == item.GradeName){
	   					className.children.push(ClassName);
	   				}
	   					
	   			})
	   			_this.classList.push(className);
	   		})
	   		console.log(classList)
	   		_this.checkClass = _this.classList[0].text + '  -  ' + _this.classList[0].children[0].text;
	   		_this.checkClassId = _this.classList[0].children[0].value;
   		},
   		pullRefresh: function(){
   			var _this = this;
   			
			if(_this.self){
   				_this.self.refresh(true);//重置上拉加载
   			}
   			mui.ready(function() {
				mui('#taskScroll').pullToRefresh({
					down: {
						callback: function() {
							var self = this;
							//刷新先清空页数和数据
							_this.page = 1;
							_this.taskList = [];
							var options = {
								TeacherId: store.state.userInfo.UserId,
								ClassId: _this.checkClassId,
								Pagesize: _this.pSize,
								Pagination: 1,
								OrderBy: 'CreatorTime DESC'
							}
							self.refresh(true);//重置上拉加载	
							_this.getData(options, self, 0);
						}
					},
					up: {
						auto: true,
						callback: function() {
							var self = this;
							var options = {
								TeacherId: store.state.userInfo.UserId,
								ClassId: _this.checkClassId,
								Pagesize: _this.pSize,
								Pagination: _this.page,
								OrderBy: 'CreatorTime DESC'
							}
							_this.self = self;
							//data表示参数，index表示第一个选项卡， self表示当前dom节点，1 表示上拉加载
							_this.getData(options, self, 1);
						}
					}
				})
			})
   		},
   		getData: function(data, self, type){
			var _this = this;
			_this.$http.post("http://syapp.keys-edu.com/api/TeacherTask/TeacherTaskList", data).then(function(res){
				console.log(res.body);
				_this.taskList.push.apply(_this.taskList, res.body);
				_this.page ++ ;
				
				var noMore = res.body.length < _this.pSize ? true : false;
				//复位下拉 或者上拉状态
				//type 说明： 0 表示下拉刷新 1 表示上啦加载
   				if(type === 0){
   					self.endPullDownToRefresh();//关闭下拉刷新
   					if(noMore){
   						self.endPullUpToRefresh(noMore);
   					}else{
   						self.refresh(true);//重置上拉加载
   					}
   					mui.toast('刷新成功！');
   				}else if(type === 1){
					self.endPullUpToRefresh(noMore);//根据返回数据判断是否还有后续数据来控制加载状态
   				}
			}, function(err){
				console.log(err);
			})
		},
   		picker: function(){
   			var _this = this;
			var picker2 = new mui.PopPicker({
				layer: 2
			});
			picker2.setData(_this.classList);
			picker2.show(function(items) {
				var checkClass = items[0].text + '  -  ' + items[1].text;
				if(_this.checkClass != checkClass){
					_this.checkClass = checkClass;
					_this.checkClassId = items[1].value;
					//初始化
					_this.taskList = [];
					_this.page = 1;
					
					_this.pullRefresh();
					//mui bug,暂时解决方法
//					setTimeout(function(){
//						mui('#taskScroll').pullRefresh().scrollTo(0, 0, 100);
//					});
				}
				
			});
   		},
   		goOut: function(){
			var _this = this;
			var btnArray = ['否', '是'];
			mui.confirm('您确认要退出吗？', '启思教育', btnArray, function(e) {
				if(e.index == 1) {
					_this.$router.push({path: '/login'});
				}
			})
		},
		goHref: function(id){
			this.$router.push({path: '/taskDetail', query: {id: id}});
		}
   	}
}
</script>
<style lang="scss">
#taskList{
	.mui-table-view.mui-table-view-chevron{
		margin-top: 10px;
		.mui-table-view-cell{
			padding: 11px 15px;
			> a:not(.mui-btn){
				margin: -11px -15px;
			}
		}
	}
	&.main .mui-scroll-wrapper{
		top: 126px;
	}
	.mui-scroll-wrapper{
		top: 106px;
		bottom: 1.3rem;
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
		h4{
			font-size: .36rem;
			line-height: 1.8;
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
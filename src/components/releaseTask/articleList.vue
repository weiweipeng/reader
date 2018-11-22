<template>
	<div id="articleList">
		<!--header-->
		<div class="header-title mui-text-center">
			<a class="mui-icon mui-icon-left-nav" @tap="goBack"></a>
			<span>选择篇章</span>
		</div>
		<div class="mui-scroll-wrapper bg-wrap">
			<div class="mui-scroll" id="scroll">
				<div class="list-wrap">
					<!--tip-->
					<div class="tip">
						<span>Tip：</span>
						<span class="circle"></span>
						<span>带有小圆点表示已经选过的篇章！</span>
					</div>
					<form class="mui-input-group">
						<div class="mui-input-row mui-checkbox" v-for="(item, index) in textList">
							<label class="list-cont">
								<h4 class="mui-ellipsis"><span class="circle" v-show="item.SendCheck == '1'"></span><span v-text="item.SubjectName"></span></h4>
								<h5 v-text="item.QuestionsType"></h5>
							</label>
							<input name="checkbox1" :value="item" type="checkbox" v-model="checkSubject">
						</div>
					</form>
				</div>
					
			</div>
		</div>
	</div>
</template>

<script>
import store from '@/vuex/store'
export default {
  	name: 'articleList',
  	store,
  	data: function(){
      	return {
      		textList: [],
      		pSize: 20,
			page: 1,
			checkSubject: [],
			checkGrade: '',
			self: null
      	}
   	},
   	watch:{
		checkSubject: function(val,oldval){
			store.commit('getCheckSubject', val);
			if(val.length > 5){
				mui.toast('不能超过5篇哦!');
			}
		}
	},
   	activated: function() {
   		var deceleration = mui.os.ios?0.003:0.0009;
		mui('.mui-scroll-wrapper').scroll({bounce: false, deceleration:deceleration});
   		if(this.$route.query.checkGrade){
			//判断是否是第一次加载
   			if(this.checkGrade == ''){
	   			this.pullRefresh();
   			}else if(this.checkGrade != this.$route.query.checkGrade){
   				//当改变时，先重置历史数据
   				this.checkSubject = [];
				this.textList = [];
				this.page = 1;
				this.pullRefresh();
   			}
   			this.checkGrade = this.$route.query.checkGrade;
   		}
   	},
   	methods: {
   		pullRefresh: function(){
   			console.log(store.state.userInfo)
   			var _this = this;
   			
			if(_this.self){
   				_this.self.refresh(true);//重置上拉加载
   			}
   			mui.ready(function() {
				mui('#scroll').pullToRefresh({
					down: {
						callback: function() {
							var self = this;
							//刷新先清空页数和数据
							_this.page = 1;
							_this.textList = [];
							_this.checkSubject = [];
							var checkGrade = _this.$route.query.checkGrade.split('-');
							var options = {
								Grade: checkGrade[0],
								Term: checkGrade[1],
								Pagesize: _this.pSize,
								Pagination: 1,
								OrderBy: 'Sort ASC',
								Author: store.state.userInfo.UserId
							}
							self.refresh(true);//重置上拉加载	
							_this.getData(options, self, 0);
						}
					},
					up: {
						auto: true,
						callback: function() {
							var self = this;
							var checkGrade = _this.$route.query.checkGrade.split('-');
							var options = {
								Grade: checkGrade[0],
								Term: checkGrade[1],
								Pagesize: _this.pSize,
								Pagination: _this.page,
								OrderBy: 'Sort ASC',
								Author: store.state.userInfo.UserId
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
			this.$http.post("http://syapp.keys-edu.com/api/Subject/GetDataSendCheck", data).then(function(res){
				console.log(res.body);
				_this.textList.push.apply(_this.textList, res.body);
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
		goBack: function(){
			if(this.checkSubject.length > 5){
				mui.toast('不能超过5篇哦!');
				return false;
			}else{
				this.$router.back(-1);
			}
				
		}
   	}
}
</script>
<style lang="scss">
#articleList{
	.mui-input-group .mui-input-row{
		height: 1.5rem;
		padding: .2rem 1.2rem .2rem .3rem;
	}
	.list-cont{
		position: relative;
		h4{
			font-size: .4rem;
		    font-weight: 700;
		    line-height: 1.7;
		}
		h5{
			font-size: .36rem;
		}
		
	}
	.tip{
		padding: .2rem .4rem;
	}
	.circle{
		display: inline-block;
	    width: .2rem;
	    height: .2rem;
	    background: #f52f2f;
	    border-radius: 50%;
	    margin-right: .15rem;
	}
	.mui-checkbox input[type=checkbox]{
		top: 50%;
		margin-top: -15px;
	}
	.mui-checkbox input[type=checkbox]:checked:before{
		color: #57b273;
	}
	.mui-input-group .mui-input-row:last-child:after{
		display: none;
	}
	.mui-input-group:after{
		display: none;
	}
}

</style>
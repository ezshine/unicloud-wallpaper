<template>
	<div>
		<div class="header" :style="{'overflow':showNav?'':'hidden'}" @mouseover="showNav=true" @mouseout="showNav=false">
			<div class="titlebar">
				<div style="flex:1;text-align: left;">{{title}}</div>
				<div id='curMenu' style="text-align: right;">菜单</div>
			</div>
			<div class="navs">
				<div v-for="(item,index) in cateList" @click='onNavItemClicked' class='item' :data-index='index'>{{item.name}}</div>
			</div>
		</div>
		<div id="wallpapers">
			<div v-for="(item,index) in paperList" class='wpitem' :data-index="index" @mouseenter="onWPItemOver" @mouseleave="onWPItemOut">
				<image mode="aspectFill" :lazy-load="true" class='image' :src='item["url_mid"]'/>
				<div v-if="item.showmenu" class='downmenu' style='position:absolute;z-index:2;bottom:5px;right:5px;background:rgba(0,0,0,.3)'>
					<a v-for="(nitem) in ['1024_768','1280_800','1280_1024','1366_768','1440_900','1600_900']" class='downitem' :href='item["img_"+nitem]' :download='item["img_"+nitem]' target='_blank'>{{nitem}}</a>
				</div>
			</div>
		</div>
	</div>
</template>


<script>
	export default {
		data() {
			return {
				title:"全是壁纸",
				cateList:[],
				paperList:[],
				showNav:false,
				cid:0,
				start:0,
				canloadmore:true
			}
		},
		onLoad() {
			this.getAllCategories();
		},
		onReachBottom() {
			if(!this.canloadmore)return;
			
			this.getAppsByCategory();
		},
		methods: {
			onWPItemOver(e){
				var wpItem = this.paperList[e.currentTarget.dataset.index];
				wpItem.showmenu = true;
				this.$forceUpdate();
			},
			onWPItemOut(e){
				var wpItem = this.paperList[e.currentTarget.dataset.index];
				wpItem.showmenu = false;
				this.$forceUpdate();
			},
			onNavItemClicked(e){
				this.getWallpapersByCateIndex(e.currentTarget.dataset.index);
			},
			getWallpapersByCateIndex(index){
				var navItem = this.cateList[index];
				if(navItem.id==this.cid)return;
				this.paperList = [];
				this.title = navItem.name;
				this.cid = navItem.id;
				this.start = 0;
				this.getAppsByCategory();
			},
			getAllCategories(){
				uni.showLoading({mask:true});
				uniCloud.callFunction({
					name:"getAllCategories",
					success: (res) => {
						var oriData = res.result.data;
						var list = [];
						for(var item in oriData){
							list.push(oriData[item]);
						}
						this.cateList = list;
						this.getWallpapersByCateIndex(Math.floor(Math.random()*list.length));
					},
					complete: () => {
						uni.hideLoading();
					}
				})
			},
			getAppsByCategory(){
				uni.showLoading({mask:true,title:"壁纸加载中"});
				uniCloud.callFunction({
					name:"getAppsByCategory",
					data:{
						cid:this.cid,
						start:this.start
					},
					success: (res) => {
						this.paperList=this.paperList.concat(res.result.data);
						
						this.canloadmore = this.start+res.result.data.length>this.start;
						this.start += res.result.data.length;
					},
					complete: () => {
						uni.hideLoading();
					}
				})
			}
		}
	}
</script>

<style>
	
	
	.header
	{
		position: fixed;
		top: 0px;
		left: 0px;
		z-index: 999;
		background: rgba(0,0,0,.7);
		height: 60px;
	}
	
	.titlebar
	{
		display: flex;
		padding:0px 20px;
		height: 60px;
		line-height: 60px;
		font-size: 18px;
		color: #fff;
	}
	
	.navs
	{
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		background: rgba(0,0,0,.7);
	}
	.navs>.item
	{
		color:#fff;
		width:100px;
		text-align: center;
		height: 50px;
		line-height: 50px;
	}
	.navs>.item:hover
	{
		color:#fff;
		cursor: pointer;
	}
	
	#wallpapers
	{
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		padding-top:60px;
	}
	
	#wallpapers>.wpitem
	{
		width: 25%;
		height: 250px;
		transition: transform .4s;
		transition-timing-function: ease-out;
		background-color: #000;
	}
	
	#wallpapers>.wpitem>.image
	{
		object-fit: cover;
		width: 100%;
		height: 100%;
		background-color: #000;
	}
	
	.downitem
	{
		text-align: right;
		color: #fff;
		font-size: 14px;
		user-select: none;
		cursor: pointer;
		display: block;
		padding: 0px 5px;
	}
</style>

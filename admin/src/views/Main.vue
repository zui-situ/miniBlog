<template>
    <el-container>
        <el-aside width="200px">
            <el-menu mode="vertical" :default-active="$route.path" router
            style="height:100vh">
                <el-submenu v-for="(item, index) in menu.items"
					:index="`menu-item-${index}`"
					:key="`menu-item-${index}`">
					<template slot="title">{{item.title}}</template>
					<el-menu-item v-for="(subItem, subIndex) in item.items"
						:index="subItem.path"
						:key="`menu-item-${index}-${subIndex}`">
							{{subItem.title}}
					</el-menu-item>
				</el-submenu>
            </el-menu>
        </el-aside>
        <el-container>
            <el-header>
				<h3>小微博管理平台</h3>
			</el-header>
			<el-main>
				<router-view :key="$route.path"></router-view>
			</el-main>
        </el-container>
    </el-container>
    
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
	@Component({})
	

    export default class Main extends Vue {
        menu = {
			items:[
				{
					title: '内容管理',
					items:[
						{ title:'首页', path:'/' },
						{ title:'微博管理', path:'/articles/list' },
						{ title:'评论管理', path:'/comments/list' },
						{ title:'消息管理', path:'/messages/list' },
						{ title:'动作管理', path:'/actions/list' },
					]
				},
				{
					title: '运营管理',
					items:[
						{ title:'用户管理', path:'/users/list' },
					]
				}
			]
		}
    }
</script>
<style>
	body{
		margin:0;
	}
</style>
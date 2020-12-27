<template>
    <div class="login-container">
        <el-card header="请先登录" class="login-card">
            <el-form @submit.native.prevent="login(model)">
                <el-form-item label="用户名">
                    <el-input v-model="model.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="model.password" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" native-type="submit">登录</el-button>
                </el-form-item>
            </el-form>  
        </el-card>  
    </div>
</template>
<script>
    import { mapActions } from 'vuex'
    export default {
        data(){
            return{
                model:{}
            }
        },
        methods:{
            ...mapActions([
                'login'
            ])
        }
    }
</script>
<style>
    .login-card{
        width:25rem;
        margin:5rem auto;
    }
</style>

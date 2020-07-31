<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">东莞大学生兼职后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="param.password"
                        @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()" v-loading="loading">登录</el-button>
                </div>
               <el-form-item v-show="showMsg" style="margin-bottom:0;">
                 <span class="text-danger">提示：用户名或密码错误，请重试！</span>
               </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { toLogin	} from '@/api/admin'
export default {
    data: function() {
        return {
            param: {
							  id: '',
                username: 'admin',
                password: '123456'
            },
					 showMsg: false,
					 loading: false,
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
        };
    },
    methods: {
        submitForm() {								
					this.$refs.login.validate(valid => {
							if (valid) {
								this.loading = true
								toLogin(this.param.username,this.param.password).then(res => {
									if(res.status === 0){			
										this.$message.success('登录成功');
										this.param.id = res.data.id;
										sessionStorage.setItem('user', JSON.stringify(this.param))
										localStorage.setItem('ms_username', this.param.username);//开启，路由守卫会获取，否则bug
										this.$router.push('/');
										// this.loginForm.id = res.data.data.id;
										// sessionStorage.setItem('user', JSON.stringify(this.loginForm))
										// this.$router.replace({ path: '/console' })
									}else{
										this.loading = false
										this.showMsg = true
									}
								}).catch(res =>{
										this.$message.error('请求超时，请检查后台是否开启，数据库是否建立连接');
										this.loading = false
										return false;
								})
		 
							} else {
									this.$message.error('请输入账号和密码');
									console.log('error submit!!');
									return false;
							}
					});
        },
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login2.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
.text-danger {
		color: #F56C6C;
	}
</style>
<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :modal-append-to-body='false'
    :visible.sync="visible">
   <div  v-if="changePassword">
      <el-form :model="dataForm" :rules="dataRule" ref="passwordForm" label-width="80px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="dataForm.userName" disabled placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newpwd">
          <el-input v-model="dataForm.newpwd" placeholder="请输入长度为6-16的字母、数字或下划线'_'"></el-input>
        </el-form-item>
      </el-form>
   </div>
   <div v-else>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="dataForm.realName" disabled placeholder="用户名"></el-input>
        </el-form-item>
				<el-form-item label="用户名" prop="userName">
          <el-input v-model="dataForm.userName" disabled placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="民族" prop="nature">
          <el-input v-model="dataForm.nature" placeholder="民族"></el-input>
        </el-form-item>
				<el-form-item label="婚姻状况" prop="married">
				  <el-radio-group v-model="dataForm.married">
				      <el-radio :label="0">未婚</el-radio>
				      <el-radio :label="1">已婚</el-radio>
							<el-radio :label="2">离异</el-radio>
							<el-radio :label="3">丧偶</el-radio>
				  </el-radio-group>
				</el-form-item>

				<el-form-item label="性别">
				    <el-radio-group v-model="dataForm.sex">
				        <el-radio :label="1">男</el-radio>
				        <el-radio :label="0">女</el-radio>
				    </el-radio-group>
				</el-form-item>
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model="dataForm.phone" placeholder="电话号码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="dataForm.email" readonly placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item label="所在城市" prop="city">
          <el-input v-model="dataForm.city" placeholder="所在城市"></el-input>
        </el-form-item>
        <el-form-item v-if="dataForm.id" label="创建时间" prop="createTime">
          <el-input v-model="dataForm.createTime" readonly type="text" placeholder="创建时间"></el-input>
        </el-form-item>
        <el-form-item  label="头像" prop="photo">
          <img  :src="dataForm.photo" class="andre_avatars">
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getUserInfo, updateUser, resetPassword } from '@/api/user'
/* eslint-disable */
  export default {
    data () {
      var validatePassNew = (rule, value, callback) => {
        if (value === '')
        {
          callback(new Error('请输入密码'));
        }
        else if(! /^\w{6,16}$/.test(value))
        {
          callback(new Error("请输入长度为6-16的字母、数字或下划线'_'"));
        }
        else
        {
          callback();
        }
      };
      return {
        changePassword: false,
				img:'https://avatar.gitee.com/uploads/15/2168015_ShuzhengWithQiuqi.png!avatar60?1546102695',
				fileList: [],
				url:'',//七牛连接
        visible: false,
        dataForm: {
          id:0,
          userName:'',
					password:'',
					newpwd: ''
        },
        dataRule: {
          nickname: [
            { required: true, message: '昵称不能为空', trigger: 'blur' }
          ],
          newpwd: [
             { validator: validatePassNew, trigger: 'blur' }
          ]
        }
      }
    },
		filters:{
			formatSex(val){
				return val == null ? '--' : val ? '男' : '女';
			},
			formatMarried(val){
				return val == null ? '--' : val == 0? '未婚' : val == 1? '已婚':
				 val === 1? '离异' : '其他';
			}
		},
    methods: {
      init(id,isChage) {
				this.url = 'common/upload?';
				 //this.$http.get(`/common/upload.do?`)
        this.changePassword = isChage
        this.dataForm.id = id || 0
        this.visible = true
        if(this.dataForm.id){
					getUserInfo(this.dataForm.id).then(response => {
						if (response.status === 0) {
							 this.dataForm = response.data
							// console.log( this.dataForm)
						}else{
               this.visible = false
               this.$message.error(response.msg)
            }
					}).catch(response => {
						// this.loading = false
					})
				}
      },

      toChangePassword(){
        this.$refs['passwordForm'].validate((valid) => {
          if (valid) {
        		resetPassword(this.dataForm).then(response => {
        				if (response.status === 0) {
                  this.resetForm('passwordForm')
        					this.$message({
        						message: '重置密码成功',
        						type: 'success',
        						duration: 1500,
        						onClose: () => {
        							this.visible = false
                      this.changePassword = false
        						}
        					})
        				} else {
        					  this.$message.error(response.msg)
        				}
        			});
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        if(this.changePassword)
        {
          this.toChangePassword()
          return false
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {

						updateUser(this.dataForm).then(response => {
								if (response.status === 0) {
                  this.resetForm('dataForm')
									this.$message({
										message: '操作成功',
										type: 'success',
										duration: 1500,
										onClose: () => {
											this.visible = false
											this.$emit('refreshDataList')
										}
									})
								} else {
									  this.$message.error(response.msg)
								}
							});
          }
        })
      },

      resetForm(formName) {
      	this.visible = false
      	this.$refs[formName].resetFields();
      },
 /* eslint-disable */
			 // 上传之前
			beforeUploadHandle (file) {
				const isLt2M = file.size / 1024 / 1024 < 2;
				 if (!isLt2M) {
				   this.$message.error('上传头像图片大小不能超过 2MB!');
				 }
			  if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png') {
			    this.$message.error('只支持jpg、png、jpeg格式的图片！')
			    return false
			  }
				let fd = new FormData()
				fd.append('file', file)
					uploadeImg(fd).then(response => {
						if (response.data.status === 0) {
							 this.dataForm.url = response.data.data
							// console.log(response.data.data)
						}
					}).catch(response => {
						// this.loading = false
					})

			},
			// 上传成功
			successHandle (response, file, fileList) {

        var list = file;
        var ll = fileList;
        //console.log(this.fileList)
			  //this.successNum++
			  if (response && response.code === 0) {
						this.dataForm.url = response.url;
						this.$message.success('图片上传' + response.msg);
			  } else {
			    this.$message.error(response.msg)
			  }
			},

			// 弹窗关闭时 取消或右上角x 都会触发
			closeHandle () {
			  this.fileList = [];
			  this.$emit('refreshDataList')
			}

    }
  }
</script>

<style scoped="scoped">

	.andre_avatars {
	  width: 150px;
	  height: 150px;
	  display: block;
	}

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>

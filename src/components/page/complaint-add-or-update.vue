<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '详情'"
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

				<el-form-item label="投诉建议" prop="details">
				  <el-input type="textarea" :rows="2" 
						v-model="dataForm.details"
						readonly
						placeholder="投诉建议">
					</el-input>
				</el-form-item>
				
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model="dataForm.phone" readonly placeholder="电话号码"></el-input>
        </el-form-item>
				
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="dataForm.email" readonly placeholder="邮箱"></el-input>
        </el-form-item>
				
        <el-form-item v-if="dataForm.id" label="创建时间" prop="createTime">
          <el-input v-model="dataForm.createTime" readonly type="text" placeholder="创建时间"></el-input>
        </el-form-item>
    <!--    <el-form-item  label="头像" prop="photo">
          <img  :src="dataForm.photo" class="andre_avatars">
        </el-form-item> -->
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <!-- <el-button type="primary" @click="dataFormSubmit()">确定</el-button> -->
    </span>
  </el-dialog>
</template>

<script>
import { getInfo } from '@/api/complaint'
/* eslint-disable */
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          userName: '',
					password: '',
					newpwd: ''
        },
        dataRule: {
        }
      }
    },

    methods: {
      init(id) {
        this.dataForm.id = id || 0
        this.visible = true
        if(this.dataForm.id){
					getInfo(this.dataForm.id).then(response => {
						if (response.status === 0) {
							 this.dataForm = response.data
							// console.log( this.dataForm)
						}else{
               this.visible = false
               this.$message.error(response.msg)
            }
					}).catch(response => {
						 // this.visible = false
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
  
      resetForm(formName) {
      	this.visible = false
      	this.$refs[formName].resetFields();
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

<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '详情'"
    :close-on-click-modal="false"
    :modal-append-to-body='false'
    :visible.sync="visible">
  
   <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      
      <el-form-item label="用户名" prop="houseid">
        <el-input v-model="dataForm.userName" readonly placeholder="用户名"></el-input>
      </el-form-item>
			<el-form-item label="姓名" prop="realName">
			  <el-input v-model="dataForm.realName" readonly placeholder="姓名"></el-input>
			</el-form-item>
			
			<el-form-item label="状态" prop="status">
			  <el-radio-group v-model="dataForm.status">
			      <el-radio :label="0">待审核</el-radio>
			      <el-radio :label="1">通过</el-radio>
						<el-radio :label="2">谢绝</el-radio>
						<el-radio :label="2">取消</el-radio>
			  </el-radio-group>
			</el-form-item>
      <el-form-item label="企业" prop="cname">
        <el-input v-model="dataForm.cname" readonly placeholder="房源名称"></el-input>
      </el-form-item>
      <el-form-item  readonly label="申请时间" prop="applyTime">
        <el-input v-model="dataForm.applyTime" readonly type="text" placeholder="申请时间"></el-input>
      </el-form-item>
			<el-form-item v-if="dataForm.fileName" label="简历" prop="fileName">
				<el-tooltip class="item" effect="dark" content="点击预览" placement="right">
					<el-button type="primary" @click="showFile">{{dataForm.fileName}}</el-button> 
						<!-- <sub style="color: grey;"></sub> -->
				</el-tooltip>
			</el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeHandle()">返回</el-button>
      <!-- <el-button type="primary" @click="dataFormSubmit()">确定</el-button> -->
    </span>
  </el-dialog>
</template>

<script>
import { getInfo } from '@/api/applyjob'

/* eslint-disable */
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          userName: '',
					fileName: '',
        },
				Cv:{
					fileName: '',
					paths: '',
					fileId: '',
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
							 this.dataForm = response.data.Info
							 this.dataForm.fileName = response.data.Cv.fileName
							 this.Cv = response.data.Cv;
							 // if(this.dataForm.fileName != null && this.dataForm.fileName != ''){
								//  this.getCv(this.dataForm.jobId)
							 // }
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
			
			// //获取简历
			// getCv(id){
			// 	getByJobId(id).then(response => {
			// 			if (response.status === 0) {
			// 				 this.Cv = response.data
			// 			}else{
   //             this.$message.error("获取简历失败")
   //          }
			// 		})
			// },
			
			//展示简历
			showFile(){
				if (!this.Cv) {
					this.$message.error("加载简历失败")
					return false;
				} 
				var url = this.Cv.paths + this.Cv.fileId;
				window.open(url);
			},
  
      resetForm(formName) {
      	this.visible = false
      	this.$refs[formName].resetFields();
      },
 
			// 弹窗关闭时 取消或右上角x 都会触发
			closeHandle () {
			  this.$refs['dataForm'].resetFields();
			  this.visible = false
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

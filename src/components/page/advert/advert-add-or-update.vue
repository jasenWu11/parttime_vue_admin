<template>
  <div>
		<el-dialog
			:title="!dataForm.id ? '新增' : '修改'"
			:close-on-click-modal="false"
			:modal-append-to-body='false'
			@close="closeHandle()"
			:visible.sync="visible">
			<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
				<el-form-item label="广告标题" prop="title">
					<el-input v-model="dataForm.title" placeholder="广告标题"></el-input>
				</el-form-item>
	
				<el-form-item label="广告链接" prop="urls">
					<el-input v-model="dataForm.urls" placeholder="广告链接"></el-input>
				</el-form-item>
				<el-form-item v-if="dataForm.id" label="创建时间" prop="createTime">
					<el-input v-model="dataForm.createTime" disabled="" placeholder="广告标题"></el-input>
				</el-form-item>
	
	<!--       <el-form-item label="是否启用" prop="disabled">
					<el-radio-group v-model="dataForm.disabled">
						<el-radio :label="false" :key="0">启用</el-radio>
						<el-radio :label="true" :key="1">禁用</el-radio>
					</el-radio-group>
				</el-form-item> -->
				<el-form-item label="内容" prop="details">
					<el-input type="textarea" :rows="2" 
						v-model="dataForm.details"
						placeholder="内容">
					</el-input>
				</el-form-item>
				<el-form-item label="广告图片" ref="uploadElement" prop="photo">
					<el-upload
						drag
						action="notError"
						:before-upload="beforeUploadHandle"
						:on-success="successHandle"
						:show-file-list="false"
						:file-list="fileList"
						style="text-align: center;">
						<img v-if="dataForm.photo" :src="dataForm.photo" width="50px" class="avatar">
						<i  v-else class="el-icon-upload"></i>
						<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
						<div class="el-upload__tip" slot="tip">
								<span v-if="dataForm.photo">点击图片进行更换</span>
								<span>只支持jpg、png格式的图片！</span>
						</div>
					</el-upload>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="closeHandle()">取消</el-button>
				<el-button type="primary" @click="dataFormSubmit()">确定</el-button>
			</span>
		</el-dialog>
		
		<!-- <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%">
		    <vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%;height:300px;"></vue-cropper>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="cancelCrop">取 消</el-button>
		        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
		    </span>
		</el-dialog> -->
  </div>
</template>

<script>
/* eslint-disable */
import { getInfo, updateAdvert, uploadIMG, addAdvert} from '@/api/advert'
  export default {
    data () {
      return {
				fileList: [],
				url:'',//七牛连接
        visible: false,
        dataForm: {
          id: '',
          photo: '',
          createTime: ''
        },
        dataRule: {
          title: [
            { required: true, message: '广告标题不能为空', trigger: 'blur' }
          ],
					details: [
					  { required: true, message: '内容不能为空', trigger: 'blur' }
					],
					
					// title: [
					//   { required: true, message: '广告标题不能为空', trigger: 'blur' }
					// ],
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        if(this.dataForm.id){
        	getInfo(this.dataForm.id).then(response => {
        		if (response.status === 0) {
        			 this.dataForm = response.data
        		}else{
               this.visible = false
               this.$message.error(response.msg)
            }
        	}).catch(response => {
        		   this.loading = false
               this.$message.error(response.msg)
        	})
        }else{
           this.dataForm.disabled = false
        }
      },

      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if(this.dataForm.id){
              this.toUpdate()
            }else{
              this.toAdd()
            }
          }
        })
      },
      toAdd(){
        addAdvert(this.dataForm).then(response => {
            if (response.status === 0) {
             this.$message({
             	message: '操作成功',
             	type: 'success',
             	duration: 1500,
             	onClose: () => {
             		this.visible = false
                this.resetForm('dataForm')
             		this.$emit('refreshDataList')
             	}
             })
          } else {
            this.$message.error(response.msg)
          }
        })
      },

      toUpdate(){
        updateAdvert(this.dataForm).then(response => {
            if (response.status === 0) {
             this.$message({
             	message: '操作成功',
             	type: 'success',
             	duration: 1500,
             	onClose: () => {
                this.resetForm('dataForm')
             		this.$emit('refreshDataList')
             	}
             })
          } else {
            this.$message.error(response.msg)
          }
        })
      },

      resetForm(formName) {
        this.$refs[formName].resetFields();
      	this.visible = false
      },
 /* eslint-disable */
			 // 上传之前
			beforeUploadHandle (file) {
			  if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png') {
			    this.$message.error('只支持jpg、png、jpeg格式的图片！')
			    return false
			  }
        let fd = new FormData()
        // fd.append('file', file)
        fd.append('image', file)
        uploadIMG(fd).then(response => {
          if (response.status === 0) {
            this.dataForm.photo = response.data.url
            this.$message({
              message: '图片已上传',
              type: 'success',
              duration: 1500
            })
          } else {
            this.$message.error(response.msg)
          }
         })
			},

			// 上传成功
			successHandle (response, file, fileList) {
        var list = file;
        var ll = fileList;
			  //this.successNum++
			  if (response && response.code === 0) {
						this.dataForm.photo = response.data.url
						this.$message.success('图片上传' + response.msg);
			  } else {
			    this.$message.error(response.msg)
			  }
			},


			// 弹窗关闭时 取消或右上角x 都会触发
			closeHandle () {
			  this.fileList = [];
			  this.$refs['dataForm'].resetFields();
        this.visible = false
			}

    }
  }
</script>

<style scoped="scoped">
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

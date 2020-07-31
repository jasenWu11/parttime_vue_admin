<template>
	<el-dialog :title="!dataForm.id ? '新增' : '详情'" :close-on-click-modal="false" :modal-append-to-body='false'
	 :visible.sync="visible">

		<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">

			<el-form-item label="职业名称" prop="title">
				<el-input v-model="dataForm.title" placeholder="职业名称"></el-input>
			</el-form-item>
			<el-form-item label="企业名称" prop="cname">
				<el-input v-model="dataForm.cname" disabled="" placeholder="企业名称"></el-input>
			</el-form-item>
			<el-form-item label="行业" prop="professionName">
				<!-- <el-input v-model="dataForm.professionName" placeholder="行业名称"></el-input> -->
				<el-select v-model="dataForm.professionName" 
						placeholder="请选择"
						filterable
						@change="selectChanged"
						value-key="id"
						v-el-select-loadmore="loadmore">
					<el-option v-for="item in professionList" 
						:key="item.id" 
						:label="item.name" 
						:value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="联系电话" prop="phone">
				<el-input v-model="dataForm.phone" readonly placeholder="联系电话"></el-input>
			</el-form-item>
			<el-form-item label="联系人" prop="contact">
				<el-input v-model="dataForm.contact" readonly placeholder="联系人"></el-input>
			</el-form-item>
			<el-form-item label="学历要求" prop="education">
				<el-input v-model="dataForm.education" placeholder="学历要求"></el-input>
			</el-form-item>
			<el-form-item label="最低薪酬" prop="minMoney">
				<el-input v-model="dataForm.minMoney" disabled="" placeholder="薪酬">what the fuck</el-input>
			</el-form-item>
			<el-form-item label="最高薪酬" prop="minMoney">
				<el-input v-model="dataForm.maxMoney" disabled placeholder="薪酬">what the fuck</el-input>
			</el-form-item>

			<el-form-item label="需求" prop="jobRequire">
				<el-input type="textarea" :rows="2" v-model="dataForm.jobRequire" placeholder="需求">
				</el-input>
			</el-form-item>
			<el-form-item label="工作内容" prop="jobDescribe">
				<el-input type="textarea" :rows="2" v-model="dataForm.jobDescribe" placeholder="工作内容">
				</el-input>
			</el-form-item>
			<el-form-item label="招聘人数" prop="employNum">
				<el-input v-model="dataForm.employNum" placeholder="招聘人数">
				</el-input>
			</el-form-item>
			<el-form-item label="工作地点" prop="workPlace">
				<el-input v-model="dataForm.workPlace" disabled placeholder="工作地点">
				</el-input>
			</el-form-item>
			<el-form-item v-if="dataForm.id" readonly label="创建时间" prop="applyTime">
				<el-input v-model="dataForm.createTime" readonly type="text" placeholder="创建时间"></el-input>
			</el-form-item>

		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="closeHandle()">返回</el-button>
			<el-button type="primary" @click="dataFormSubmit()">确定</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import {getInfo, update, add } from '@/api/job'
	import { getList } from '@/api/profession'
	/* eslint-disable */
	export default {
		directives: {
			'el-select-loadmore': {
				bind(el, binding) {
					// 获取element-ui定义好的scroll盒子
					const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
					SELECTWRAP_DOM.addEventListener('scroll', function() {
						/**
						 * scrollHeight 获取元素内容高度(只读)
						 * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
						 * clientHeight 读取元素的可见高度(只读)
						 * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
						 * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
						 */
						var condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
						console.log(condition);
						if (condition) {
							binding.value();
						}
					});
				}
			}
		},
		data() {
			return {
				visible: false,
				dataForm: {
					id: 0,
					userName: '',
					fileName: '',
				},
				formData: {
					pageIndex: 1,
					pageSize: 10,
				},
				professionList: [],
				dataRule: {
					name: [{
						required: true,
						message: '昵称不能为空',
						trigger: 'blur'
					}],
					details: [{
						required: true,
						message: '昵称不能为空',
						trigger: 'blur'
					}],
				}
			}
		},
		created() {
			this.getList();
		},
		methods: {
			init(id) {
				this.dataForm.id = id || 0
				this.visible = true
				if (this.dataForm.id) {
					getInfo(this.dataForm.id).then(response => {
						if (response.status === 0) {
							this.dataForm = response.data
						} else {
							this.visible = false
							this.$message.error(response.msg)
						}
					}).catch(response => {
						// this.visible = false
					})
				}
			},

			loadmore() {
				this.formData.pageSize +=  10;
				// console.log("yeshu = " + this.formData.pageSize)
				this.getList();
			},
			
			selectChanged(val){
				console.log("changge" + val)
				this.dataForm.professionId = val;
			},
			getList() {
				getList(this.formData.pageIndex, this.formData.pageSize, null).then(response => {
					if (response.status === 0) {
						this.professionList = response.data.records
						if(response.data.current == 1){
							this.formData.pageIndex = 1
						}
						// this.totalPage = response.data.total
					} else {
						this.$message({
							type: 'error',
							message: '获取失败!'
						})
					}
				}).catch(response => {
					// this.loading = false
				})
			},

			// 表单提交
			dataFormSubmit() {
				this.$refs['dataForm'].validate((valid) => {
					if (valid) {
						if (this.dataForm.id) {
							console.log("shifou jinalia ")
							update(this.dataForm).then(response => {
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
						} else {
							// this.toAdd();
						}

					}
				})
			},

			toAdd() {
				add(this.dataForm).then(response => {
					if (response.status === 0) {
						this.resetForm('dataForm')
						this.$message({
							message: '添加成功',
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
			},

			resetForm(formName) {
				this.visible = false
				this.$refs[formName].resetFields();
			},

			// 弹窗关闭时 取消或右上角x 都会触发
			closeHandle() {
				this.fileList = [];
				this.resetForm('dataForm')
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

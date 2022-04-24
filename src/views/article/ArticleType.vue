<template>
  <div class="article-type">
    <el-card shadow="always">
      <div class="control-btns">
        <el-button type="primary" @click="handleCreate">新增测评分类</el-button>
      </div>
    </el-card>
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      size="medium"
    >
      <el-table-column
        prop="categoryId"
        label="ID"
        align="center"
        width="500"
        sortable
      />
      <el-table-column
        prop="categoryType"
        label="测评文章类别"
        align="center"
        width="300"
      />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            :disabled="scope.row.forbid"
            @click="handleEdit(scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.categoryId)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页栏 -->
    <el-dialog
      title="新增/编辑"
      :visible.sync="formVisible"
      width="30%"
      class="dialog-form"
      :before-close="handleClose"
    >
      <el-form
        ref="dialogForm"
        :model="dialogForm"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="类型名：" prop="categoryType">
          <el-input v-model="dialogForm.categoryType" />
        </el-form-item>
        <div class="footer-item">
          <el-button @click="cancleForm">取 消</el-button>
          <el-button
            type="primary"
            :disabled="isSubmit"
            @click="submitForm('dialogForm')"
          >确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ArticleType',
  data() {
    return {
      // 数据列表加载动画
      listLoading: true,
      // 表格数据数组
      tableData: [],
      // 新增/编辑 弹出框显示/隐藏
      formVisible: false,
      // 防止多次连续提交表单
      isSubmit: false,
      // 弹出表单
      dialogForm: {
        id: null,
        categoryType: undefined
      },
      // 表单校验 trigger: ['blur', 'change'] 为多个事件触发
      formRules: {
        categoryType: [
          { required: true, message: '请输入测评类型名', trigger: 'blur' },
          {
            min: 0,
            max: 10,
            message: '不应超过10个字符',
            trigger: 'blur'
          }
        ]
      },
      isEdit: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取数据列表
    fetchData() {
      this.listLoading = true
      // 获取数据列表接口
      this.$http.get(
        `/v1/e/category/list`,
        null,
        (res) => {
          this.tableData = res
          this.listLoading = false
        },
        () => {
          this.$message({
            type: 'error',
            message: '测评类型列表获取失败'
          })
        }
      )
    },
    // 新建数据
    handleCreate() {
      this.formVisible = true
    },
    // 编辑数据
    handleEdit(row) {
      this.formVisible = true
      this.dialogForm.id = row.categoryId
      this.dialogForm.categoryType = row.categoryType
      this.isEdit = true
    },
    // 新增/编辑表单确认提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 此处添加 新增/编辑数据的接口 新增成功后调用fetchData方法更新列表
          // 为修改操作
          if (this.isEdit) {
            const categoryUpdateDto = {
              categoryId: this.dialogForm.id,
              categoryType: this.dialogForm.categoryType
            }
            this.$http.put(
              'v1/e/category',
              categoryUpdateDto,
              () => {
                this.$message({
                  type: 'success',
                  message: '更新成功!'
                })
                this.fetchData()
              },
              () => {
                this.$message({
                  type: 'error',
                  message: '更新失败!'
                })
                this.$refs.dialogForm.resetFields()
              }
            )
          } else {
            const categoryAddDto = {
              categoryType: this.dialogForm.categoryType
            }
            this.$http.post(
              'v1/e/category',
              categoryAddDto,
              () => {
                this.$message({
                  type: 'success',
                  message: '新增成功!'
                })
                this.fetchData()
              },
              () => {
                this.$message({
                  type: 'error',
                  message: '新增失败!'
                })
                this.$refs.dialogForm.resetFields()
              }
            )
          }
          this.formVisible = false
        } else {
          this.isSubmit = false
          return false
        }
      })
    },
    // 删除数据
    handleDelete(id) {
      this.$confirm('此操作将删除选中数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.delete(
            `/v1/e/category/${id}`,
            null,
            () => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.fetchData()
            },
            () => {
              this.$message({
                type: 'error',
                message: '删除失败，该类型下可能以存在测评文章。'
              })
            }
          )
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 新增/编辑表单取消提交
    cancleForm() {
      this.$refs.dialogForm.resetFields()
      this.formVisible = false
    },
    // 新增/编辑弹出框 关闭时操作
    handleClose() {
      this.formVisible = false
      this.$refs.dialogForm.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.article-type {
  .control-btns {
    margin-bottom: 20px;
  }
  .el-table thead {
    font-weight: 600;
    th {
      background-color: #f2f3f7;
    }
  }
  .dialog-form {
    .el-input {
      width: 350px;
    }
    .footer-item {
      margin-top: 50px;
      text-align: right;
    }
  }
}
</style>

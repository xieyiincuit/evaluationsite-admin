<template>
  <div class="game-management">
    <el-card shadow="always">
      <!-- 操作栏 -->
      <div class="control-btns">
        <el-button type="primary" @click="handleCreate">新建数据</el-button>
        <el-button type="danger" @click="batchDelete">批量删除</el-button>
      </div>
      <!-- 查询栏 -->
      <el-form
        ref="searchForm"
        :inline="true"
        :model="listQuery"
        label-width="90px"
        class="search-form"
      >
        <el-form-item label="编号">
          <el-input v-model="listQuery.id" placeholder="编号" />
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="listQuery.phone" placeholder="手机" />
        </el-form-item>
        <el-form-item label="婚姻状况">
          <el-select v-model="listQuery.married" placeholder="婚姻状况">
            <el-option :value="0" label="单身" />
            <el-option :value="1" label="未婚" />
            <el-option :value="2" label="已婚" />
            <el-option :value="3" label="离异" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格栏 -->
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        size="medium"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="60" />
        <el-table-column
          prop="id"
          label="游戏编号"
          align="center"
          width="170"
          sortable
        />
        <el-table-column
          prop="name"
          label="游戏名"
          align="center"
          width="170"
        />
        <el-table-column
          prop="companyName"
          label="游戏公司"
          align="center"
          width="170"
        />
        <el-table-column
          prop="categoryName"
          label="游戏类型"
          align="center"
          width="170"
        />
        <el-table-column
          prop="averageScore"
          label="评分"
          align="center"
          width="170"
        />
        <el-table-column
          prop="hotPoints"
          label="热度"
          align="center"
          width="170"
        />
        <el-table-column
          prop="sellTime"
          label="发布时间"
          align="center"
          width="170"
        />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              :disabled="scope.row.forbid"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页栏 -->
      <Pagination
        :total="total"
        :page.sync="listQuery.currentPage"
        :limit.sync="listQuery.pageSize"
        @pagination="fetchData"
      />
      <!-- 新增/编辑 弹出栏 -->
      <el-dialog
        title="编辑"
        :visible.sync="formVisible"
        width="30%"
        class="dialog-form"
        :before-close="handleClose"
      >
        <el-steps :active="active" finish-status="success" align-center>
          <el-step title="游戏信息"></el-step>
          <el-step title="游戏建议"></el-step>
        </el-steps>

        <el-form
          ref="dialogForm"
          :model="dialogForm"
          :rules="formRules"
          label-width="100px"
        >
          <el-form-item label="游戏名：" prop="name">
            <el-input v-model="dialogForm.name" />
          </el-form-item>
          <el-form-item label="基本描述：" prop="description">
            <el-input type="textarea" v-model="dialogForm.description" />
          </el-form-item>

          <el-form-item label="略缩图：">
            <el-upload
              class="avatar-uploader"
              action="http://zhousl.australiaeast.cloudapp.azure.com:20000/v1/g/pic"
              :headers="filereqHeader"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :on-error="handleAvatarFail"
              name="file"
            >
              <img
                :src="'http://zhousl.australiaeast.cloudapp.azure.com:9000/' + dialogForm.avatar"
                class="avatar"
              />
              <div
                class="rounded-2 color-fg-default px-2 py-1 left-0 bottom-0 ml-2 mb-2"
              >
                <svg
                  aria-hidden="true"
                  height="16"
                  viewBox="0 0 16 16"
                  version="1.1"
                  width="16"
                  data-view-component="true"
                  class="octicon octicon-pencil"
                >
                  <path
                    fill-rule="evenodd"
                    d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 00-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 000-.354l-1.086-1.086zM11.189 6.25L9.75 4.81l-6.286 6.287a.25.25 0 00-.064.108l-.558 1.953 1.953-.558a.249.249 0 00.108-.064l6.286-6.286z"
                  ></path>
                </svg>
                点击上传
              </div>
            </el-upload>
          </el-form-item>

          <el-form-item label="婚姻状况：" prop="married">
            <el-select v-model="dialogForm.married">
              <el-option :value="0" label="单身" />
              <el-option :value="1" label="未婚" />
              <el-option :value="2" label="已婚" />
              <el-option :value="3" label="离异" />
            </el-select>
          </el-form-item>
          <el-form-item label="爱好：" prop="hobby">
            <el-checkbox-group v-model="dialogForm.hobby">
              <el-checkbox label="羽毛球" name="hobby" />
              <el-checkbox label="乒乓球" name="hobby" />
              <el-checkbox label="篮球" name="hobby" />
              <el-checkbox label="排球" name="hobby" />
              <el-checkbox label="网球" name="hobby" />
              <el-checkbox label="旱冰" name="hobby" />
              <el-checkbox label="滑雪" name="hobby" />
              <el-checkbox label="跳高" name="hobby" />
              <el-checkbox label="冲浪" name="hobby" />
            </el-checkbox-group>
          </el-form-item>
          <div class="footer-item">
            <el-button @click="cancleForm">取 消</el-button>
            <el-button
              type="primary"
              :disabled="isSubmit"
              @click="submitForm('dialogForm')"
              >确 定</el-button
            >
          </div>
        </el-form>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import Upload from "@/components/Upload";
import dayjs from "dayjs";
import { getToken } from '../..//utils/cookie'

export default {
  name: "GameManagement",
  components: { Pagination, Upload },
  computed: {
    filereqHeader() {
      var token = getToken();
      var header = {
        Authorization: "Bearer " + token,
      };
      return header;
    },
  },
  data() {
    return {
      // 关于新增游戏信息的进度条
      active: 0,
      // 数据列表加载动画
      listLoading: true,
      // 查询列表参数对象
      listQuery: {
        id: undefined,
        phone: undefined,
        married: undefined,
        currentPage: 1,
        pageSize: 10,
      },
      // 新增/编辑提交表单对象
      dialogForm: {
        name: undefined,
        phone: undefined,
        married: undefined,
        avatar:'',
        hobby: [],
      },
      // 数据总条数
      total: 0,
      // 表格数据数组
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
      // 新增/编辑 弹出框显示/隐藏
      formVisible: false,
      // 表单校验 trigger: ['blur', 'change'] 为多个事件触发
      formRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "请输入正确的手机号",
            trigger: "blur",
          },
        ],
      },
      // 防止多次连续提交表单
      isSubmit: false,
      // 导出文件格式
      filesFormat: ".txt, .csv, .xls, .xlsx",
      // 导出数据 弹出框显示/隐藏
      exportVisible: false,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    beforeAvatarUpload(file) {
      const isJPGPNG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt3M = file.size / 1024 / 1024 < 3;

      if (!isJPGPNG) {
        this.$message.error("上传图片只能是 JPG, PNG 格式!");
      }
      if (!isLt3M) {
        this.$message.error("上传图片大小不能超过 3MB!");
      }
      return isJPGPNG && isLt3M;
    },
    handleAvatarSuccess(res, file) {
      this.dialogForm.avatar = res;
    },
    handleAvatarFail(err) {
      this.$message.error("系统错误，上传文件失败");
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 新建数据
    handleCreate() {
      this.formVisible = true;
      this.dialogForm.name = undefined;
      this.dialogForm.phone = undefined;
      this.dialogForm.married = undefined;
      this.dialogForm.hobby = [];
    },
    // 编辑数据
    handleEdit(index, row) {
      console.log(index, row);
      this.formVisible = true;
      this.dialogForm.name = row.name;
      this.dialogForm.phone = row.phone;
      this.dialogForm.married = row.married;
      this.dialogForm.hobby = row.hobby.split("、");
    },
    // 删除数据
    handleDelete(id) {
      console.log(id, "ididid");
      this.$confirm("此操作将删除选中数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 此处可添加--删除接口
          // 删除成功调用fetchData方法更新列表

          this.$http.delete(`/v1/g/info/${id}`, null, (res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getTableList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 批量删除
    batchDelete() {
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: "请先选择要删除的数据！",
          type: "warning",
        });
      } else {
        this.handleDelete();
      }
    },
    // 新增/编辑弹出框 关闭时操作
    handleClose() {
      this.formVisible = false;
      this.$refs.dialogForm.resetFields();
    },
    // 获取数据列表
    fetchData() {
      this.listLoading = true;
      // 获取数据列表接口
      this.$http.get(
        `/v1/g/admin/infos?pageIndex=${this.listQuery.currentPage}`,
        null,
        (res) => {
          console.log(res, "!!!!!!!!!!!!!!!!!");
          this.tableData = res.data;
          this.tableData.map((item) => {
            item.sellTime = dayjs(item.sellTime).format("YYYY-MM-DD HH:mm:ss");
            return item;
          });
          this.total = res.totalCount;
          this.listLoading = false;
        },
        (err) => {
          console.log(err);
        }
      );
    },
    // 查询数据
    onSubmit() {
      this.listQuery.currentPage = 1;
      this.fetchData();
    },
    // 新增/编辑表单确认提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 此处添加 新增/编辑数据的接口 新增成功后调用fetchData方法更新列表
          // 先 this.isSubmit = true 接口返回成功后 再 this.isSubmit = false
          this.formVisible = false;
        } else {
          this.isSubmit = false;
          return false;
        }
      });
    },
    // 新增/编辑表单取消提交
    cancleForm() {
      this.$refs.dialogForm.resetFields();
      this.formVisible = false;
    },
    // 列表中婚姻状况栏，状态值改变时，调用
    selectChange(row) {
      // 此处添加后台接口，成功后调用fetchData方法更新列表
    },
    // 列表中禁止编辑栏，状态值改变时，调用
    stateChange(row) {
      // 此处添加后台接口，成功后调用fetchData方法更新列表
    },
  },
};
</script>

<style lang="less">
.game-management {
  .el-card {
    min-height: 80vh;
  }
  .control-btns {
    margin-bottom: 20px;
  }
  .search-form {
    padding-top: 18px;
    margin-bottom: 15px;
    background-color: #f7f8fb;
  }
  .el-table thead {
    font-weight: 600;
    th {
      background-color: #f2f3f7;
    }
  }
  .dialog-form {
    .el-input {
      width: 380px;
    }
    .el-textarea {
      width: 380px;
    }
    .footer-item {
      margin-top: 50px;
      text-align: right;
    }
  }
  .upload-box,
  .export-data {
    width: 300px;
    margin: 0 auto 30px;
  }
  .upload-box {
    width: 156px;
    .files-upload {
      color: #20a0ff;
    }
  }
  .hints {
    font-size: 12px;
    color: #aaa;
    text-align: center;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }
  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  img {
    width: 250px;
  }
}
</style>

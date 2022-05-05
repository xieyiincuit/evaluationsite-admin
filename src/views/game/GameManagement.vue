<template>
  <div class="game-management">
    <el-card shadow="always">
      <!-- 操作栏 -->
      <div class="control-btns">
        <el-button type="primary" @click="handleCreate">录入游戏信息</el-button>
      </div>
      <!-- 查询栏 -->
      <el-form
        ref="searchForm"
        :inline="true"
        :model="listQuery"
        label-width="90px"
        class="search-form"
      >
        <el-form-item label="游戏类别">
          <el-select
            clearable
            v-model="listQuery.categoryId"
            placeholder="请选择游戏类别"
          >
            <el-option
              v-for="item in AllgameType"
              :key="item.id"
              :value="item.id"
              :label="item.categoryName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="游戏公司">
          <el-select
            clearable
            v-model="listQuery.companyId"
            placeholder="请选择游戏公司"
          >
            <el-option
              v-for="item in AllCompany"
              :key="item.id"
              :value="item.id"
              :label="item.companyName"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="排序方式">
          <el-select
            clearable
            v-model="listQuery.order"
            placeholder="请选择排序方式"
          >
            <el-option value="hot" label="游戏热度" />
            <el-option value="time" label="发售时间" />
            <el-option value="score" label="游戏评分" />
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
              @click="handleEdit(scope.row.id)"
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
        :page.sync="listQuery.pageIndex"
        :limit.sync="listQuery.pageSize"
        @pagination="fetchData"
      />
      <!-- 新增/编辑 弹出栏 -->
      <el-dialog
        title="编辑"
        :visible.sync="formVisible"
        width="30%"
        class="dialog-form"
        @close="closeDialog"
      >
        <el-steps :active="active" finish-status="success" align-center>
          <el-step title="游戏信息"></el-step>
          <el-step title="游戏建议"></el-step>
        </el-steps>

        <!-- 游戏信息表 -->
        <el-form
          v-if="active == 0"
          ref="formRules1"
          :model="dialogForm"
          :rules="formRules1"
          label-width="100px"
        >
          <el-form-item label="游戏名：" prop="name">
            <el-input v-model="dialogForm.name" />
          </el-form-item>
          <el-form-item label="基本描述：" prop="description">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5 }"
              v-model="dialogForm.description"
            />
          </el-form-item>

          <el-form-item label="略缩图：" prop="roughPicture">
            <el-upload
              class="avatar-uploader"
              action="http://localhost:20000/v1/g/pic"
              :headers="filereqHeader"
              :show-file-list="false"
              :on-success="roughPictureSuccess"
              :before-upload="beforeAvatarUpload"
              :on-error="handleAvatarFail"
              name="file"
            >
              <img
                :src="
                  dialogForm.roughPicture
                    ? ossUrl + dialogForm.roughPicture
                    : pugai
                "
                class="avatar"
              />
              <!-- <img
              v-if="dialogForm.roughPicture"
                :src="
                  'http://zhousl.australiaeast.cloudapp.azure.com:9000/' +
                  dialogForm.roughPicture
                "
                class="avatar"
              /> -->
              <div
                class="
                  rounded-2
                  color-fg-default
                  px-2
                  py-1
                  left-0
                  bottom-0
                  ml-2
                  mb-2
                "
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

          <el-form-item label="详细图：" prop="detailsPicture">
            <el-upload
              class="avatar-uploader"
              action="http://localhost:20000/v1/g/pic"
              :headers="filereqHeader"
              :show-file-list="false"
              :on-success="detailsPictureSuccess"
              :before-upload="beforeAvatarUpload"
              :on-error="handleAvatarFail"
              name="file"
            >
              <img
                :src="
                  dialogForm.detailsPicture
                    ? ossUrl + dialogForm.detailsPicture
                    : pugai
                "
                class="avatar"
              />
              <div
                class="
                  rounded-2
                  color-fg-default
                  px-2
                  py-1
                  left-0
                  bottom-0
                  ml-2
                  mb-2
                "
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

          <el-form-item label="支持平台：" prop="supportPlatform">
            <el-tooltip
              class="item"
              effect="dark"
              content="请使用  /  进行分隔"
              placement="top"
            >
              <el-input v-model="dialogForm.supportPlatform" />
            </el-tooltip>
          </el-form-item>

          <el-form-item label="游戏类型：" prop="categoryId">
            <el-select
              v-model="dialogForm.categoryId"
              placeholder="请选择游戏类型"
            >
              <el-option
                v-for="item in AllgameType"
                :key="item.id"
                :label="item.categoryName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="公司名称：" prop="companyId">
            <el-select
              v-model="dialogForm.companyId"
              placeholder="请选择游戏类型"
            >
              <el-option
                v-for="item in AllCompany"
                :key="item.id"
                :label="item.companyName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <div class="footer-item">
            <el-button @click="cancleInformation('formRules1')"
              >取 消</el-button
            >
            <el-button
              type="primary"
              :disabled="isSubmit"
              @click="submitInformation('formRules1')"
              >下一步</el-button
            >
          </div>
        </el-form>

        <!-- 游戏建议表 -->
        <el-form
          v-if="active > 0"
          ref="formRules2"
          :model="dialogForm2"
          :rules="formRules2"
          label-width="100px"
        >
          <el-form-item label="操作系统：" prop="operationSystem">
            <el-input v-model="dialogForm2.operationSystem" />
          </el-form-item>
          <el-form-item label="CPU建议：" prop="cpuName">
            <el-input v-model="dialogForm2.cpuName" />
          </el-form-item>
          <el-form-item label="显卡建议：" prop="graphicsCard">
            <el-input v-model="dialogForm2.graphicsCard" />
          </el-form-item>
          <el-form-item label="内存建议：" prop="memorySize">
            <el-input v-model="dialogForm2.memorySize" />
          </el-form-item>
          <el-form-item label="存储建议：" prop="diskSize">
            <el-input v-model="dialogForm2.diskSize" />
          </el-form-item>

          <div class="footer-item">
            <el-button @click="cancleSuggest('formRules2')">跳 过</el-button>
            <el-button
              type="primary"
              :disabled="isSubmit"
              @click="submitSuggest('formRules2')"
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
import { getToken } from "../..//utils/cookie";

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
      ossUrl: process.env.VUE_APP_OSS,
      pugai: require("@/assets/img/pugai.jpg"),
      // 关于新增游戏信息的进度条
      active: 0,
      // 关于是否是更新操作
      isUpdate: false,
      isSugUpdate: false,
      updateGameId: "",
      // 数据列表加载动画
      listLoading: true,
      // 查询列表参数对象
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
      },
      // 新增/编辑游戏信息的表单对象
      dialogForm: {
        name: "",
        description: "",
        detailsPicture: "",
        roughPicture: "",
        supportPlatform: "",
        categoryId: "",
        companyId: "",
      },
      // 新增/编辑游戏建议的表单对象
      dialogForm2: {
        operationSystem: "",
        cpuName: "",
        graphicsCard: "",
        diskSize: "",
        memorySize: "",
        gameId: "",
      },
      // 所有游戏类型
      AllgameType: [],
      // 所有公司
      AllCompany: [],

      // 数据总条数
      total: 0,
      // 表格数据数组
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
      // 新增/编辑 弹出框显示/隐藏
      formVisible: false,
      // 表单校验 trigger: ['blur', 'change'] 为多个事件触发
      formRules1: {
        name: [{ required: true, message: "该选项必填", trigger: "blur" }],
        description: [
          { required: true, message: "该选项必填", trigger: "blur" },
          { min: 50, message: "必须多于50字", trigger: "blur" },
        ],
        detailsPicture: [
          { required: true, message: "该选项必填", trigger: "change" },
        ],
        roughPicture: [
          { required: true, message: "该选项必填", trigger: "change" },
        ],
        supportPlatform: [
          { required: true, message: "该选项必填", trigger: "blur" },
        ],
        categoryId: [
          { required: true, message: "该选项必填", trigger: "change" },
        ],
        companyId: [
          { required: true, message: "该选项必填", trigger: "change" },
        ],
      },
      formRules2: {
        operationSystem: [
          { required: true, message: "该选项必填", trigger: "blur" },
        ],
        cpuName: [{ required: true, message: "该选项必填", trigger: "blur" }],
        memorySize: [
          { required: true, message: "该选项必填", trigger: "blur" },
        ],
        diskSize: [{ required: true, message: "该选项必填", trigger: "blur" }],
        graphicsCard: [
          { required: true, message: "该选项必填", trigger: "blur" },
        ],
      },
      // 防止多次连续提交表单
      isSubmit: false,
    };
  },
  created() {
    this.fetchData();
    this.getAllType();
    this.getAllCompany();
  },
  methods: {
    // 上传图片相关（以下四个）
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
    detailsPictureSuccess(res, file) {
      this.dialogForm.detailsPicture = res;
    },
    roughPictureSuccess(res, name) {
      this.dialogForm.roughPicture = res;
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
    },
    // 编辑数据
    handleEdit(id) {
      this.updateGameId = id;

      // 获取游戏信息
      this.$http.get(
        `/v1/g/info/${id}`,
        null,
        (res) => {
          let categoryId = this.AllgameType.filter(
            (item) => item.categoryName == res.categoryName
          );
          let companyId = this.AllCompany.filter(
            (item) => item.companyName == res.companyName
          );
          console.log(categoryId, "categoryId");
          console.log(companyId, "companyId");
          this.dialogForm = {
            ...res,
            ...{ categoryId: categoryId[0].id },
            ...{ companyId: companyId[0].id },
          };
          console.log(this.dialogForm, "aaaaaa");
          this.isUpdate = true;
          this.$http.get(
            `/v1/g/suggestion?gameId=${id}`,
            null,
            (res) => {
              this.dialogForm2 = res;
              if (res.id) {
                this.isSugUpdate = true;
              }
              this.formVisible = true;
            },
            (err) => {
              console.log(err);
            }
          );
        },
        (err) => {
          console.log(err);
        }
      );
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
          this.$http.delete(
            `/v1/g/info/${id}`,
            null,
            (res) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.fetchData();
            },
            (err) => {
              this.$message({
                type: "error",
                message: err.response.data,
              });
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 获取数据列表
    fetchData() {
      this.listLoading = true;
      // 获取数据列表接口
      this.$http.get(
        `/v1/g/admin/infos?`,
        this.listQuery,
        (res) => {
          this.tableData = res.data;
          this.tableData.map((item) => {
            item.sellTime = dayjs(item.sellTime).format("YYYY-MM-DD");
            return item;
          });
          this.total = res.totalCount;
          this.listLoading = false;
        },
        (err) => {
          this.tableData = [];
          this.listLoading = false;
          console.log(err);
        }
      );
    },

    // 获取所有类型
    getAllType() {
      // 获取数据列表接口
      this.$http.get(
        `/v1/g/categories/all`,
        null,
        (res) => {
          this.AllgameType = res;
        },
        (err) => {
          console.log(err);
        }
      );
    },
    // 获取所有公司
    getAllCompany() {
      // 获取数据列表接口
      this.$http.get(
        `/v1/g/companies/all`,
        null,
        (res) => {
          this.AllCompany = res;
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

    // 游戏信息表单上传
    submitInformation(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let sellTime = dayjs(new Date()).format("YYYY-MM-DD");
          let from = { ...this.dialogForm, ...{ sellTime } };
          if (this.isUpdate) {
            from = { ...from, ...{ id: this.updateGameId } };
            this.$http.put(
              `/v1/g/info`,
              from,
              (res) => {
                if (this.active++ > 1) this.active = 2;
                console.log(res);
                this.$refs[formName].resetFields();
                if (res) {
                  this.$set(this.dialogForm2, gameId, res);
                }
                this.$message({
                  type: "success",
                  message: "游戏信息修改成功!",
                });
                this.fetchData();
              },
              (err) => {
                this.$message({
                  type: "error",
                  message: "游戏信息修改失败!",
                });
              }
            );
          } else {
            this.$http.post(
              `/v1/g/info`,
              from,
              (res) => {
                if (this.active++ > 1) this.active = 2;
                console.log(res);
                this.$refs[formName].resetFields();
                this.$set(this.dialogForm2, gameId, res);
                this.$message({
                  type: "success",
                  message: "游戏信息录入成功!",
                });
                this.fetchData();
              },
              (err) => {
                this.$message({
                  type: "error",
                  message: err.response.data,
                });
              }
            );
          }
        }
      });
    },
    // 游戏信息表单取消上传
    cancleInformation(formName) {
      this.active = 0;
      this.dialogForm = {};
      this.dialogForm2 = {};
      this.$refs[formName].resetFields();
      this.formVisible = false;
    },

    // 游戏建议表单上传
    submitSuggest(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isSugUpdate == true) {
            let data = { ...this.dialogForm2 };
            this.$http.put(
              `/v1/g/suggestion`,
              data,
              (res) => {
                this.active = 0;
                this.$refs[formName].resetFields();
                console.log(res);
                this.formVisible = false;
                this.$message({
                  type: "success",
                  message: "游戏建议修改成功!",
                });
              },
              (err) => {
                console.log(err);
              }
            );
          } else {
            this.$http.post(
              `/v1/g/suggestion`,
              this.dialogForm2,
              (res) => {
                this.active = 0;
                this.$refs[formName].resetFields();
                console.log(res);
                this.formVisible = false;
              },
              (err) => {
                console.log(err);
              }
            );
          }
        }
      });
    },
    // 游戏建议表单取消上传
    cancleSuggest(formName) {
      this.active = 0;
      this.dialogForm = {};
      this.dialogForm2 = {};
      this.$refs[formName].resetFields();
      this.formVisible = false;
    },
    closeDialog() {
      this.active = 0;
      this.dialogForm = {};
      this.dialogForm2 = {};
      this.formVisible = false;
    },
  },
};
</script>

<style lang="less">
.game-management {
  .el-card {
    min-height: 85vh;
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
    max-height: 200px;
    width: 250px;
  }
}
</style>

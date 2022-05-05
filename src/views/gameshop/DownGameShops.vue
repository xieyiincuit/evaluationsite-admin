<template>
  <div class="down-game-shops">
    <el-card shadow="always">
      <!-- 操作栏 -->
      <div class="control-btns">
        <el-button type="primary" @click="handleCreate">新建数据</el-button>
      </div>
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
          label="商品编号"
          align="center"
          width="170"
          sortable
        />
        <el-table-column
          prop="gameName"
          label="游戏名"
          align="center"
          width="170"
        />
        <el-table-column prop="price" label="价格" align="center" width="170" />
        <el-table-column
          prop="discount"
          label="折扣"
          align="center"
          width="170"
        />
        <el-table-column
          prop="availableStock"
          label="库存"
          align="center"
          width="170"
        />
        <el-table-column label="游戏图片" width="300" align="center">
          <template slot-scope="scope">
            <el-popover placement="top-start" title="" trigger="hover">
              <img
                :src="
                  'http://zhousl.australiaeast.cloudapp.azure.com:9000/' +
                  scope.row.picture
                "
                alt=""
              />
              <img
                slot="reference"
                :src="
                  'http://zhousl.australiaeast.cloudapp.azure.com:9000/' +
                  scope.row.picture
                "
                style="width: 50%"
              />
            </el-popover>
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>

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
    </el-card>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import Upload from "@/components/Upload";
import dayjs from "dayjs";
import { getToken } from "../../utils/cookie";

export default {
  name: "DownGameShops",
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
      pugai: require("@/assets/img/pugai.jpg"),
      // 关于新增游戏信息的进度条
      active: 0,
      // 关于是否是跟新操作
      isUpdate: false,
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
        cupName: "",
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
        cupName: [{ required: true, message: "该选项必填", trigger: "blur" }],
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
          console.log(res, "1111");
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

          this.$http.get(
            `/v1/g/suggestion?gameId=${id}`,
            null,
            (res) => {
              // this.$nextTick(() => {
              //   this.dialogForm2 = res;
              // });
              this.dialogForm2 = res;
              console.log(this.dialogForm2, "2222");
              this.isUpdate = true;
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

    // 获取数据列表
    fetchData() {
      this.listLoading = true;
      // 获取数据列表接口
      this.$http.get(
        `/v1/g/shops`,
        this.listQuery,
        (res) => {
          console.log(res, "resres");
          this.tableData = res.data;
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
              },
              (err) => {
                console.log(err);
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
              },
              (err) => {
                console.log(err);
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
          if (this.isUpdate) {
            let data = { ...this.dialogForm2, ...{ id: this.updateGameId } };
            this.$http.put(
              `/v1/g/suggestion`,
              data,
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
.down-game-shops {
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
    width: 250px;
  }
}
</style>

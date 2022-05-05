<template>
  <div class="upgame-shops">
    <el-card shadow="always">
      <!-- 操作栏 -->
      <div class="control-btns">
        <el-button type="primary" @click="handleCreate">上架游戏商品</el-button>
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
        <el-table-column
          prop="id"
          label="商品编号"
          align="center"
          width="150"
          sortable
        />
        <el-table-column
          prop="gameName"
          label="商品名"
          align="center"
          width="150"
        />
        <el-table-column label="商品图片" width="300" align="center">
          <template slot-scope="scope">
            <el-popover placement="top-start" title="" trigger="hover">
              <img :src="ossUrl + scope.row.picture" alt="" />
              <img
                slot="reference"
                :src="ossUrl + scope.row.picture"
                style="width: 50%"
              />
            </el-popover>
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="价格" align="center" width="170">
          <template slot-scope="scope">{{ scope.row.price }}￥ </template>
        </el-table-column>

        <el-table-column label="折扣" align="center" width="150">
          <template slot-scope="scope">{{ scope.row.discount }}% </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="150">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.temporaryStopSell == true" type="danger"
              >不在售</el-tag
            >
            <el-tag v-else type="success">在售</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="availableStock"
          label="剩余SDK"
          align="center"
          width="170"
        >
          <template slot-scope="scope">
            <!-- 通过isSelected显示或隐藏 -->
            <el-input
              v-if="isSelected[scope.row.id]"
              v-model="newAvailableStock"
              @focus="focusEvent(scope.row)"
              @blur="blurEvent(scope.row)"
              v-focus
            ></el-input>
            <p @click="cellClick(scope.row)" v-else>
              {{ scope.row.availableStock }}
            </p>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              :disabled="scope.row.forbid"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleChange(scope.row.id, '上架')"
              v-if="scope.row.temporaryStopSell == true"
              >上架</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleChange(scope.row.id, '下架')"
              v-else
              >下架</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)"
              v-if="scope.row.temporaryStopSell == true"
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

    <el-dialog
      title="游戏上架"
      :visible.sync="formVisible"
      width="30%"
      class="dialog-form"
    >
      <!-- 上传表 -->
      <el-form
        ref="formRules2"
        :model="appendForm"
        :rules="formRules2"
        label-width="100px"
      >
        <el-form-item label="游戏：" prop="gameInfoId">
          <el-select
            clearable
            v-model="appendForm.gameInfoId"
            placeholder="请选择游戏"
          >
            <el-option
              infinite-scroll-immediate="true"
              infinite-scroll-disabled="busy"
              infinite-scroll-distance="0"
              v-infinite-scroll="loadMore"
              v-for="item in AllGames"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="售价：" prop="price">
          <el-input v-model="appendForm.price" />
        </el-form-item>
        <el-form-item label="折扣：" prop="discount">
          <el-input v-model="appendForm.discount" />
        </el-form-item>
        <el-form-item label="库存：" prop="discount">
          <el-input v-model="appendForm.availableStock" />
        </el-form-item>

        <el-form-item label="商品图：" prop="sellPictrue">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:20000/v1/s/pic"
            :headers="filereqHeader"
            :show-file-list="false"
            :on-success="addPictureSuccess"
            :before-upload="beforeAvatarUpload"
            :on-error="handleAvatarFail"
            name="file"
          >
            <!-- <img
              :src="
                dialogForm.roughPicture
                  ? 'http://zhousl.australiaeast.cloudapp.azure.com:9000/' +
                    dialogForm.roughPicture
                  : pugai
              "
              class="avatar"
            /> -->
            <img
              v-if="appendForm.sellPictrue"
              :src="ossUrl + appendForm.sellPictrue"
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
        <div class="footer-item">
          <el-button @click="addcancleInformation('formRules2')"
            >取 消</el-button
          >
          <el-button type="primary" @click="addsubmitInformation('formRules2')"
            >确 定</el-button
          >
        </div>
      </el-form>
    </el-dialog>

    <el-dialog
      title="编辑"
      :visible.sync="dialogVisible"
      width="30%"
      class="dialog-form"
    >
      <!-- 游戏信息表 -->
      <el-form
        ref="formRules1"
        :model="dialogForm"
        :rules="formRules1"
        label-width="100px"
      >
        <el-form-item label="售价：" prop="price">
          <el-input v-model="dialogForm.price" />
        </el-form-item>
        <el-form-item label="折扣：" prop="discount">
          <el-input v-model="dialogForm.discount" />
        </el-form-item>

        <el-form-item label="商品图：" prop="sellPictrue">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:20000/v1/s/pic"
            :headers="filereqHeader"
            :show-file-list="false"
            :on-success="roughPictureSuccess"
            :before-upload="beforeAvatarUpload"
            :on-error="handleAvatarFail"
            name="file"
          >
            <!-- <img
              :src="
                dialogForm.roughPicture
                  ? 'http://zhousl.australiaeast.cloudapp.azure.com:9000/' +
                    dialogForm.roughPicture
                  : pugai
              "
              class="avatar"
            /> -->
            <img
              v-if="dialogForm.sellPictrue"
              :src="ossUrl + dialogForm.sellPictrue"
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
        <div class="footer-item">
          <el-button @click="cancleInformation('formRules1')">取 消</el-button>
          <el-button type="primary" @click="submitInformation('formRules1')"
            >确 定</el-button
          >
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import Upload from "@/components/Upload";
import dayjs from "dayjs";
import { getToken } from "../../utils/cookie";

export default {
  name: "UpGameShops",
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
  //自定义指令
  directives: {
    focus: {
      inserted: function (el) {
        el.querySelector("input").focus();
      },
    },
  },
  data() {
    return {
      ossUrl: process.env.VUE_APP_OSS,
      newAvailableStock: "",
      isSelected: {},
      dialogVisible: false,
      // 数据列表加载动画
      listLoading: true,
      // 查询列表参数对象
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
      },
      busy: true,
      addlistQuery: {
        pageIndex: 1,
        pageSize: 10,
      },
      // 编辑商品信息的表单对象
      dialogForm: {
        id: "",
        price: "",
        sellPictrue: "",
        discount: "",
      },
      // 新增的表单对象
      appendForm: {
        gameInfoId: "",
        price: "",
        sellPictrue: "",
        discount: "",
        availableStock: "",
      },
      AllGames: [],
      // 数据总条数
      total: 0,
      // 表格数据数组
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
      // 新增/编辑 弹出框显示/隐藏
      formVisible: false,
      // 表单校验 trigger: ['blur', 'change'] 为多个事件触发
      formRules2: {
        price: [{ required: true, message: "该选项必填", trigger: "blur" }],
        sellPictrue: [
          { required: true, message: "该选项必填", trigger: "change" },
        ],
        discount: [{ required: true, message: "该选项必填", trigger: "blur" }],
        availableStock: [
          { required: true, message: "该选项必填", trigger: "blur" },
        ],
        gameInfoId: [
          { required: true, message: "该选项必填", trigger: "blur" },
        ],
      },
      formRules1: {
        price: [{ required: true, message: "该选项必填", trigger: "blur" }],
        sellPictrue: [
          { required: true, message: "该选项必填", trigger: "change" },
        ],
        discount: [{ required: true, message: "该选项必填", trigger: "blur" }],
      },
      // 防止多次连续提交表单
      isSubmit: false,
    };
  },
  created() {
    this.fetchData();
    this.getAllgames();
  },
  methods: {
    //当选择项发生变化时会触发该事件
    selectChange(e) {
      console.log(e);
    },

    //点击输入框聚焦
    focusEvent(row) {
      console.log(row);
      this.newAvailableStock = row.availableStock;
    },

    //输入框失去焦点触发,调用修改接口
    blurEvent(row) {
      console.log(row);
      console.log(
        typeof this.isSelected[row.id],
        "typeof this.isSelected[row.id]"
      );
      this.$set(this.isSelected, row.id, !this.isSelected[row.id]);
      if (this.newAvailableStock !== row.availableStock) {
        let form = {
          id: row.id,
          availableStock: this.newAvailableStock,
        };
        // 。。。此处代码省略（调用修改名称接口）
        this.$http.put(
          `/v1/g/shop/stock`,
          form,
          (res) => {
            this.$message({
              type: "success",
              message: "修改成功!",
            });
            this.fetchData();
          },
          (err) => {
            console.log(err);
          }
        );
      }
    },

    //点击文本触发
    cellClick(row) {
      if (row.temporaryStopSell == true) {
        if (typeof this.isSelected[row.id] == "boolean") {
          this.$set(this.isSelected, row.id, !this.isSelected[row.id]);
        } else {
          console.log(this.isSelected);
          this.$set(this.isSelected, row.id, "true");
        }
      }
    },

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
    roughPictureSuccess(res, name) {
      this.dialogForm.sellPictrue = res;
    },
    addPictureSuccess(res, name) {
      this.appendForm.sellPictrue = res;
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
    },
    // 编辑数据
    handleEdit(row) {
      this.dialogVisible = true;
      this.dialogForm.id = row.id;
      this.dialogForm.sellPictrue = row.picture;
      this.dialogForm.price = row.price;
      this.dialogForm.discount = row.discount;
    },
    // 删除数据
    handleDelete(id) {
      console.log(id, "ididid");
      this.$confirm("此操作将删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 此处可添加--删除接口
          // 删除成功调用fetchData方法更新列表

          this.$http.delete(
            `/v1/g/shop/${id}`,
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

    handleChange(id, operation) {
      console.log(id, "ididid");
      this.$confirm("此操作将" + operation + "该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 此处可添加--删除接口
          // 删除成功调用fetchData方法更新列表
          this.$http.put(
            `/v1/g/shop/status/${id}`,
            null,
            (res) => {
              this.$message({
                type: "success",
                message: operation + "成功!",
              });
              this.fetchData();
            },
            (err) => {
              console.log(err);
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消" + operation,
          });
        });
    },

    // 获取所有游戏
    getAllgames(flag) {
      this.$http.get(
        `/v1/g/admin/infos?`,
        this.addlistQuery,
        (res) => {
          // console.log(res, "sssssssss");
          if (flag) {
            //flag为true时 拼接数组
            this.AllGames = this.AllGames.concat(res.data);
            //若当前页已经是最后一页，将busy设置为true，不再执行loadMore，否则设置为false
            if (this.addlistQuery.pageIndex + 1 >= res.totalPages) {
              this.busy = true;
            } else {
              _this.busy = false;
            }
          } else {
            this.AllGames = res.data;
            this.busy = false;
            if (res.data.length === 0 || res.totalPages === 1) {
              //若无数据（接口返回list长度为0）或只有一页数据（接口返回字段totalPages为1），将busy设置为true，不再执行loadMore
              this.busy = true;
            }
          }
        },
        (err) => {
          console.log(err);
        }
      );
    },
    loadMore() {
      console.log("aaaa");
      this.busy = true;
      setTimeout(() => {
        this.addlistQuery.pageIndex++;
        this.getAllgames(true);
      }, 500);
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
          this.$http.put(
            `/v1/g/shop`,
            this.dialogForm,
            (res) => {
              this.$message({
                type: "success",
                message: "更新成功!",
              });
              this.dialogForm = {};
              this.dialogVisible = false;
              this.fetchData();
            },
            (err) => {
              console.log(err);
              this.dialogForm = {};
              this.dialogVisible = false;
            }
          );
        }
      });
    },
    // 游戏信息表单取消上传
    cancleInformation(formName) {
      this.dialogForm = {};
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },

    addsubmitInformation(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post(
            `/v1/g/shop`,
            this.appendForm,
            (res) => {
              this.$message({
                type: "success",
                message: "上架成功!",
              });
              this.appendForm = {};
              this.formVisible = false;
              this.fetchData();
            },
            (err) => {
              console.log(err);
              this.appendForm = {};
              this.formVisible = false;
            }
          );
        }
      });
    },
    addcancleInformation(formName) {
      this.appendForm = {};
      this.$refs[formName].resetFields();
      this.formVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.upgame-shops {
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
      text-align: right !important;
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

<template>
  <div class="evaluator-redraw">
    <el-card shadow="always">
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        size="medium"
      >
        <el-table-column label="概要(点击显示ID)" align="center" width="200">
          <template slot-scope="scope">
            <el-popover trigger="focus" placement="top">
              <p>用户Id: {{ scope.row.id }}</p>
              <div slot="reference" class="name-wrapper">
                <el-avatar shape="square" :src="ossUrl + scope.row.avatar" />
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="用户名"
          align="center"
          width="200"
        />
        <el-table-column
          prop="nickName"
          label="昵称"
          align="center"
          width="200"
        />
        <el-table-column
          prop="email"
          label="绑定邮箱"
          align="center"
          width="300"
        />
        <el-table-column
          prop="registerTime"
          label="注册时间"
          align="center"
          width="200"
        />
        <el-table-column
          label="用户身份"
          align="center"
          width="200"
        >测评人员</el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="danger"
              @click="openRedrawDialog(scope.row.id)"
            >撤回资格</el-button>
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
      <el-dialog
        title="撤回资格"
        :visible.sync="redrawDialog.visiable"
        width="30%"
        center
      >
        <span style="text: center">确定撤回该用户的资格吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="redrawDialog.visiable = false">取 消</el-button>
          <el-button type="primary" @click="reject()">撤 回</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import dayjs from 'dayjs'

export default {
  name: 'EvaluatorRedraw',
  components: { Pagination },
  data() {
    return {
      // OSS 地址
      ossUrl: process.env.VUE_APP_OSS,
      // 数据列表加载动画
      listLoading: true,
      // 查询/分页参数
      listQuery: {
        role: 'evaluator',
        currentPage: 1,
        pageSize: 10
      },
      // 数据总条数
      total: 0,
      // 表格数据数组
      tableData: [],
      // 弹出框显示/隐藏
      formVisible: false,
      redrawDialog: {
        visiable: false,
        userId: ''
      }
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
        `/v1/u/role?pageIndex=${this.listQuery.currentPage}&roleSelect=${this.listQuery.role}`,
        null,
        (res) => {
          this.listLoading = false
          this.total = res.totalCount
          this.tableData = res.data
          this.tableData.map((item) => {
            item.registerTime = dayjs(item.registerTime).format(
              'YYYY-MM-DD HH:mm'
            )
            return item
          })
        },
        () => {
          this.listLoading = false
        }
      )
    },
    openRedrawDialog(userId) {
      this.redrawDialog.visiable = true
      this.redrawDialog.userId = userId
    },
    reject() {
      this.$http.put(
        `/v1/b/approve/redraw/${this.redrawDialog.userId}`,
        null,
        (res) => {
          this.$message({
            type: 'success',
            message: '撤回成功'
          })
          this.redrawDialog.visiable = false
          this.fetchData()
        },
        () => {
          this.$message({
            type: 'error',
            message: '撤回失败'
          })
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
.evaluator-redraw {
  .control-btns {
    margin-bottom: 20px;
  }
  .el-table thead {
    font-weight: 600;
    th {
      background-color: #f2f3f7;
    }
  }
}
</style>

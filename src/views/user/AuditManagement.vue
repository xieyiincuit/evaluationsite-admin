<template>
  <div class="audit-management">
    <el-card shadow="always">
      <el-form
        ref="searchForm"
        :inline="true"
        :model="listQuery"
        label-width="90px"
        class="search-form"
      >
        <el-form-item label="审批状态:">
          <el-select v-model="listQuery.status" placeholder="选择审批状态">
            <div v-for="(status, index) in statusList" :key="index">
              <el-option :label="status.name" :value="status.value" />
            </div>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">筛选</el-button>
        </el-form-item>
      </el-form>
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
        prop="id"
        label="ID"
        align="center"
        width="100"
        sortable
      />
      <el-table-column label="概要(点击显示ID)" align="center" width="200">
        <template slot-scope="scope">
          <el-popover trigger="focus" placement="top">
            <p>用户Id: {{ scope.row.userId }}</p>
            <div slot="reference" class="name-wrapper">
              <el-avatar
                shape="square"
                :src="ossUrl + findUserAvatar(scope.row.userId)"
              />
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center" width="200">
        <template slot-scope="scope">
          {{ findUserName(scope.row.userId) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="applyTime"
        label="申请时间"
        align="center"
        width="300"
      />
      <el-table-column label="审批状态" align="center" width="300">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0">待审批</el-tag>
          <el-tag
            v-else-if="scope.row.status === -1"
            type="danger"
          >已拒绝</el-tag>
          <el-tag
            v-else-if="scope.row.status === 1"
            type="success"
          >已通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="see(scope.row.id)">查看正文</el-button>
          <template v-if="scope.row.status === 0">
            <el-button
              type="success"
              @click="openApproveDialog(scope.row.userId)"
            >同意</el-button>
            <el-button
              type="danger"
              @click="openRejectDialog(scope.row.userId)"
            >拒绝</el-button>
          </template>
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
      title="申请正文"
      :visible.sync="formVisible"
      width="30%"
      class="dialog-form"
    >
      <Editor v-model="approveBody" />
    </el-dialog>
    <el-dialog
      title="同意申请"
      :visible.sync="approveDialog.visiable"
      width="30%"
      center
    >
      <span style="text: center">确定同意该用户的申请吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="approveDialog.visiable = false">取 消</el-button>
        <el-button type="primary" @click="approve()">同 意</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="拒绝申请"
      :visible.sync="rejectDialog.visiable"
      width="30%"
      center
    >
      <span style="text: center">确定拒绝该用户的申请吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rejectDialog.visiable = false">取 消</el-button>
        <el-button type="primary" @click="reject()">拒 绝</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import Editor from '@/components/Editor'
import dayjs from 'dayjs'
export default {
  name: 'AuditManagement',
  components: { Pagination, Editor },
  data() {
    return {
      // OSS 地址
      ossUrl: process.env.VUE_APP_OSS,
      // 状态Select框
      statusList: [
        {
          name: '审批中',
          value: 0
        },
        {
          name: '已拒绝',
          value: -1
        },
        {
          name: '已通过',
          value: 1
        }
      ],
      // 数据列表加载动画
      listLoading: true,
      // 数据总条数
      total: 0,
      // 查询/分页参数
      listQuery: {
        status: 0,
        currentPage: 1,
        pageSize: 10
      },
      // 表格数据数组
      tableData: [],
      // 额外的用户信息
      userInfos: [],
      // 弹出框显示/隐藏
      formVisible: false,
      approveBody: '',
      approveDialog: {
        visiable: false,
        userId: ''
      },
      rejectDialog: {
        visiable: false,
        userId: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 映射用户名
    findUserName: function(userId) {
      var user = this.userInfos.find((o) => o.id === userId)
      if (user == null) {
        user = this.userInfos.find((x) => x.id === userId)
      }
      return user.nickName == null ? '匿名用户' : user.nickName
    },
    // 映射用户头像
    findUserAvatar: function(userId) {
      var user = this.userInfos.find((o) => o.id === userId)
      if (user == null) {
        user = this.userInfos.find((x) => x.id === userId)
      }
      return user.avatar == null ? '' : user.avatar
    },
    // 映射审批状态
    findApproveStatus: function(code) {
      var status = this.statusList.find((o) => o.value === code)
      return status.name
    },
    // 获取数据列表
    fetchData() {
      this.listLoading = true
      let getUrl = ''
      if (this.listQuery.status === null) {
        getUrl = `/v1/b/approve/list?pageIndex=${this.listQuery.currentPage}`
      } else {
        getUrl = `/v1/b/approve/list?pageIndex=${this.listQuery.currentPage}&status=${this.listQuery.status}`
      }
      // 获取数据列表接口
      this.$http.get(
        getUrl,
        null,
        (res) => {
          this.listLoading = false
          this.total = res.totalCount
          this.tableData = res.data
          this.userInfos = res.userInfo
          this.tableData.map((item) => {
            item.applyTime = dayjs(item.applyTime).format('YYYY-MM-DD HH:mm')
            return item
          })
        },
        () => {
          this.listLoading = false
        }
      )
    },

    // 查看正文
    see(id) {
      this.$http.get(
        `/v1/b/approve/${id}`,
        null,
        (res) => {
          this.approveBody = res.body
          this.formVisible = true
        },
        () => {
          this.$message({
            type: 'error',
            message: '申请正文获取失败'
          })
        }
      )
    },

    openApproveDialog(userId) {
      this.approveDialog.visiable = true
      this.approveDialog.userId = userId
    },
    // 同意申请
    approve() {
      this.$http.put(
        `/v1/b/approve/check/${this.approveDialog.userId}`,
        null,
        (res) => {
          this.$message({
            type: 'success',
            message: '审批通过'
          })
          this.approveDialog.visiable = false
          this.fetchData()
        },
        () => {
          this.$message({
            type: 'error',
            message: '审批通过失败'
          })
        }
      )
    },
    openRejectDialog(userId) {
      this.rejectDialog.visiable = true
      this.rejectDialog.userId = userId
    },
    reject() {
      this.$http.put(
        `/v1/b/approve/reject/${this.rejectDialog.userId}`,
        null,
        (res) => {
          this.$message({
            type: 'success',
            message: '审批拒绝'
          })
          this.rejectDialog.visiable = false
          this.fetchData()
        },
        () => {
          this.$message({
            type: 'error',
            message: '审批拒绝失败'
          })
        }
      )
    },
    // 执行筛选
    onSubmit() {
      this.fetchData()
    }
  }
}
</script>

<style lang="less" scoped>
.audit-management {
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
}
</style>

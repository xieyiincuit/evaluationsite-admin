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
        <el-form-item label="封禁状态:">
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
        prop="reportCount"
        label="被举报次数"
        align="center"
        width="150"
      />
      <el-table-column label="用户状态" align="center" width="300">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0">正常</el-tag>
          <el-tag
            v-else-if="scope.row.status === 1"
            type="danger"
          >已封禁</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="bannedTime"
        label="封禁时间"
        align="center"
        width="300"
      />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status === 0"
            type="danger"
            @click="openApproveDialog(scope.row.userId)"
          >封 禁</el-button>
          <el-button
            v-else-if="scope.row.status === 1"
            type="success"
            @click="openRejectDialog(scope.row.userId)"
          >解 禁</el-button>
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
      title="封禁用户"
      :visible.sync="approveDialog.visiable"
      width="30%"
      center
    >
      <span style="text: center">确定封禁该用户吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="approveDialog.visiable = false">取 消</el-button>
        <el-button type="primary" @click="approve()">封 禁</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="拒绝申请"
      :visible.sync="rejectDialog.visiable"
      width="30%"
      center
    >
      <span style="text: center">确定解除封禁该用户吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rejectDialog.visiable = false">取 消</el-button>
        <el-button type="primary" @click="reject()">解 除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import dayjs from 'dayjs'
export default {
  name: 'BannedManagement',
  components: { Pagination },
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
          name: '已封禁',
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
        getUrl = `/v1/b/banned/list?pageIndex=${this.listQuery.currentPage}`
      } else {
        getUrl = `/v1/b/banned/list?pageIndex=${this.listQuery.currentPage}&status=${this.listQuery.status}`
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
            item.bannedTime = dayjs(item.bannedTime).format('YYYY-MM-DD HH:mm')
            return item
          })
        },
        () => {
          this.listLoading = false
          this.tableData = []
        }
      )
    },

    openApproveDialog(userId) {
      this.approveDialog.visiable = true
      this.approveDialog.userId = userId
    },
    // 同意申请
    approve() {
      this.$http.post(
        `/v1/b/banned/ban/${this.approveDialog.userId}`,
        null,
        (res) => {
          this.$message({
            type: 'success',
            message: '封禁成功'
          })
          this.approveDialog.visiable = false
          this.fetchData()
        },
        () => {
          this.$message({
            type: 'error',
            message: '封禁失败'
          })
        }
      )
    },
    openRejectDialog(userId) {
      this.rejectDialog.visiable = true
      this.rejectDialog.userId = userId
    },
    reject() {
      this.$http.delete(
        `/v1/b/banned/${this.rejectDialog.userId}`,
        null,
        (res) => {
          this.$message({
            type: 'success',
            message: '解除成功'
          })
          this.rejectDialog.visiable = false
          this.fetchData()
        },
        () => {
          this.$message({
            type: 'error',
            message: '解除失败'
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

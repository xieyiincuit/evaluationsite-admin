<template>
  <div class="user-management">
    <el-card shadow="always">
      <el-form
        ref="searchForm"
        :inline="true"
        :model="listQuery"
        label-width="90px"
        class="search-form"
      >
        <el-form-item label="用户角色:">
          <el-select v-model="listQuery.role" placeholder="选择用户角色">
            <div v-for="(role, index) in roleList" :key="index">
              <el-option :label="role.name" :value="role.value" />
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
      <el-table-column label="概要(点击显示ID)" align="center" width="200">
        <template slot-scope="scope">
          <el-popover trigger="focus" placement="top">
            <p>用户Id: {{ scope.row.id }}</p>
            <div slot="reference" class="name-wrapper">
              <el-avatar
                shape="square"
                :src="ossUrl + scope.row.avatar"
              />
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
        prop="phoneNumber"
        label="绑定手机"
        align="center"
        width="300"
      />
      <el-table-column
        prop="registerTime"
        label="注册时间"
        align="center"
        width="300"
      />
    </el-table>
    <!-- 分页栏 -->
    <Pagination
      :total="total"
      :page.sync="listQuery.currentPage"
      :limit.sync="listQuery.pageSize"
      @pagination="fetchData"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import dayjs from 'dayjs'
export default {
  name: 'UserManagement',
  components: { Pagination },
  data() {
    return {
      // OSS 地址
      ossUrl: process.env.VUE_APP_OSS,
      // 角色Select框
      roleList: [
        {
          name: '全部用户',
          value: null
        },
        {
          name: '普通用户',
          value: 'normaluser'
        },
        {
          name: '测评人员',
          value: 'evaluator'
        },
        {
          name: '封禁用户',
          value: 'forbiddenuser'
        }
      ],
      // 数据列表加载动画
      listLoading: true,
      // 数据总条数
      total: 0,
      // 查询/分页参数
      listQuery: {
        role: null,
        currentPage: 1,
        pageSize: 10
      },
      // 表格数据数组
      tableData: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取数据列表
    fetchData() {
      this.listLoading = true
      let getUrl = ''
      if (this.listQuery.role === null) {
        getUrl = `/v1/u/list?pageIndex=${this.listQuery.currentPage}`
      } else {
        getUrl = `/v1/u/role?pageIndex=${this.listQuery.currentPage}&roleSelect=${this.listQuery.role}`
      }
      // 获取数据列表接口
      this.$http.get(
        getUrl,
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
          this.$message({
            type: 'error',
            message: '用户列表获取失败'
          })
        }
      )
    },
    onSubmit() {
      this.fetchData()
    }
  }
}
</script>

<style lang="less" scoped>
.user-management {
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

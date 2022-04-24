<template>
  <div class="article-management">
    <el-card shadow="always">
      <el-form
        ref="searchForm"
        :inline="true"
        :model="listQuery"
        label-width="90px"
        class="search-form"
      >
        <el-form-item label="测评类别:">
          <el-select v-model="listQuery.categoryId" placeholder="选择测评类别">
            <div v-for="type in typeList" :key="type.categoryId">
              <el-option :label="type.categoryType" :value="type.categoryId" />
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
        label="文章Id"
        align="center"
        width="100"
        sortable
      />
      <el-table-column prop="title" label="标题" align="center" width="600" />
      <el-table-column
        prop="categoryName"
        label="测评类别"
        align="center"
        width="150"
      />
      <el-table-column
        prop="createTime"
        label="发布时间"
        align="center"
        width="200"
      />
      <el-table-column
        prop="viewCounts"
        label="浏览量"
        align="center"
        width="150"
      />
      <el-table-column
        prop="commentCounts"
        label="评论数量"
        align="center"
        width="150"
      /><el-table-column
        prop="likeCounts"
        label="点赞量"
        align="center"
        width="150"
      />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            :disabled="scope.row.forbid"
            @click="seeArticle(scope.row.id)"
          >查看</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)"
          >删除</el-button>
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
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import dayjs from 'dayjs'

export default {
  name: 'ArticleManagement',
  components: { Pagination },
  data() {
    return {
      // 数据列表加载动画
      listLoading: true,
      // 数据总条数
      total: 0,
      // 查询/分页参数
      listQuery: {
        categoryId: null,
        currentPage: 1,
        pageSize: 15
      },
      // 表格数据数组
      tableData: [],
      typeList: []
    }
  },
  created() {
    this.fetchData()
    this.fetchTypeList()
  },
  methods: {
    // 获取类别选择列表
    fetchTypeList() {
      this.$http.get('v1/e/category/list', null, (res) => {
        this.typeList = res
      })
    },
    // 获取数据列表
    fetchData() {
      this.listLoading = true
      let getUrl = ''
      if (this.listQuery.categoryId === null) {
        getUrl = `/v1/e/admin/articles?pageIndex=${this.listQuery.currentPage}`
      } else {
        getUrl = `/v1/e/admin/articles?pageIndex=${this.listQuery.currentPage}&categoryId=${this.listQuery.categoryId}`
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
            item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm')
            return item
          })
        },
        () => {
          this.$message({
            type: 'error',
            message: '测评文章列表获取失败'
          })
        }
      )
    },
    // 查看文档
    seeArticle(id) {
      var url = 'http://localhost:3000/article/' + id
      window.open(url, '_blank')
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
            `/v1/e/article/${id}`,
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
                message: '该测评文章删除失败。'
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
    onSubmit() {
      this.fetchData()
    }
  }
}
</script>

<style lang="less" scoped>
.article-management {
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

<template>
  <div class="home-wrapper">
    <div class="date-row">
      <div v-for="(item, index) in cardInfoData" :key="index" class="data-col">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
          <div class="date-block">
            <i
              :class="[item.icon]"
              :style="{ background: item.color }"
              class="icon-box"
            />
            <div class="date-cont">
              <CountTo
                class="count"
                :start-val="0"
                :end-val="item.count"
                :duration="3000"
              />
              <p class="title">{{ item.title }}</p>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <el-row class="date-box" :gutter="20">
      <el-col :span="8">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
          <ChartsPie
            title="测评文章统计信息"
            type="pie"
            :data="articlePieData"
            class="data-desc"
          />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
          <div class="data-desc data-lang-box">
            <div class="data-lang-title">系统语言构成</div>
            <div
              v-for="(item, index) in langsData"
              :key="index"
              class="data-lang-item"
            >
              <label>{{ item.name }}</label>
              <el-progress
                :percentage="item.value"
                :stroke-width="16"
                :color="item.color"
              />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
          <ChartsPie
            title="游戏录入统计信息"
            type="ring"
            :data="gameinfoPieData"
            class="data-desc"
          />
        </el-card>
      </el-col>
    </el-row>
    <el-row class="date-box" :gutter="20">
      <el-col :span="12">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
          <ChartsBar
            :title="title"
            :data="commonChartsData"
            class="data-chart"
          />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
          <ChartsLine
            :title="title"
            :data="commonChartsData"
            class="data-chart"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import ChartsPie from '@/components/Charts/ChartsPie'
import ChartsBar from '@/components/Charts/ChartsBar'
import ChartsLine from '@/components/Charts/ChartsLine'
export default {
  name: 'Home',
  components: { CountTo, ChartsPie, ChartsBar, ChartsLine },
  data() {
    return {
      title: '近七天用户访问量条形图',
      langsData: [
        { name: 'C#', value: 52, color: '#2d8cf0' },
        { name: 'Vue', value: 23, color: '#19be6b' },
        { name: 'JavaScript', value: 10, color: '#ff9900' },
        { name: 'CSS', value: 7, color: '#e46cbb' },
        { name: 'HTML', value: 8, color: '#9a66e4' }
      ],
      cardInfoData: [
        {
          title: '文章总数',
          icon: 'vue-dsn-icon-dianji',
          count: 0,
          color: '#2d8cf0'
        },
        {
          title: '用户总数',
          icon: 'vue-dsn-icon-xinzeng',
          count: 0,
          color: '#19be6b'
        },
        {
          title: '评论总数',
          icon: 'vue-dsn-icon-xinfeng',
          count: 0,
          color: '#ff9900'
        },
        {
          title: '游戏总数',
          icon: 'vue-dsn-icon-dianzan',
          count: 0,
          color: '#e46cbb'
        },
        {
          title: '商品总数',
          icon: 'vue-dsn-icon-heart',
          count: 0,
          color: '#9a66e4'
        }
      ],
      articlePieData: [
        { value: 2, name: '单机测评' },
        { value: 3, name: '网游测评' },
        { value: 1, name: '独立游戏' },
        { value: 2, name: '手游测评' },
        { value: 1, name: '电玩测评' }
      ],
      gameinfoPieData: [
        { value: 2, name: '动作游戏' },
        { value: 2, name: '网络游戏' },
        { value: 1, name: '冒险游戏' },
        { value: 3, name: '角色扮演' },
        { value: 1, name: '竞速游戏' }
      ],
      commonChartsData: {
        Mon: 25,
        Tue: 45,
        Wed: 23,
        Thu: 75,
        Fri: 87,
        Sat: 113,
        Sun: 198
      }
    }
  },
  mounted() {
    this.showArticle()
    this.showGame()
    this.showUser()
  },
  methods: {
    showArticle() {
      this.$http.get('v1/b/statistics/articles', null, (res) => {
        this.cardInfoData[0].count = res.articleCount
        this.cardInfoData[2].count = res.commentCount
        let index = 0
        for (var key in res.categoryMap) {
          this.articlePieData[index].name = key
          this.articlePieData[index].value = res.categoryMap[key]

          if (index === 5) {
            break
          }
          index++
        }
      })
    },
    showGame() {
      this.$http.get('v1/b/statistics/games', null, (res) => {
        this.cardInfoData[3].count = res.gameCount
        this.cardInfoData[4].count = res.shopCount
        let index = 0
        for (var key in res.categoryMap) {
          this.articlePieData[index].name = key
          this.articlePieData[index].value = res.categoryMap[key]
          if (index === 5) {
            break
          }
          index++
        }
      })
    },
    showUser() {
      this.$http.get('v1/b/statistics/users', null, (res) => {
        this.cardInfoData[1].count = res.userCount
      })
    }
  }
}
</script>

<style lang="less">
@import "../assets/less/home";
</style>

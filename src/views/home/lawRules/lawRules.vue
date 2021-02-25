<template>
  <div>
    <div class="title">
      <span>
        首页
      </span>/
      <span style="color: #1B85CF;">法律法规</span>
    </div>
    <!-- <p v-if="loading" style="text-align: center;">数据加载中。。。。。</p> -->
    <p v-if="noData && !loading" style="text-align: center;">暂无数据</p>
    <ul v-loading="loading" class="news-box">
      <newsItem
        v-for="item in newsList"
        :key="item.id"
        :news-detail="item"
      />
    </ul>
    <div class="page-box">
      <el-pagination
        hide-on-single-page
        layout="prev, pager, next"
        :current-page.sync="currentPage"
        :page-size="10"
        @current-change="handleChage"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { searchLaw } from '@/api/case'

import newsItem from '../components/newsItem'
export default {
  components: {
    newsItem
  },
  props: {

  },
  data() {
    return {
      loading: false,
      newsList: [],
      total: 0,
      currentPage: 1,
      keyword: ''
    }
  },
  computed: {
    noData() {
      return this.newsList.length < 1
    }
  },
  created() {
    const { word } = this.$route.params
    this.getList(word) // 从详情页跳转过来的则查询详情页输入的关键词，否则查询默认词
  },
  methods: {
    getList(word) {
      this.keyword = word
      this.loading = true
      const params = {
        type:'法律法规',
        keyword:word,
        pageSize:10,
        pageNum:this.currentPage
      }
      searchLaw(params).then(res => {
        this.newsList = []
        if (res.state === '100') {
          this.newsList = res.content
          this.total = res.total
        } else {
          this.$message.warning(res.data.description)
        }
      })
        .finally(() => {
          this.$emit('update:isLoaing', false)
          this.loading = false
        })
    },
    searchList(word) {
      this.currentPage = 1
      this.getList(word)
    },
    handleChage(e) {
      this.getList(this.keyword)
    }
  }
}
</script>

<style scoped lang="scss">
.title {
  height: 60px;
  line-height: 60px;
  margin: 0 auto;
  width: 880px;
  font-family: Source Han Sans CN;
  font-weight: 700;
  color: rgba(136,136,136,1);
}
.news-box {
  width: 880px;
  height: auto;
  background-color: #fff;
  margin: 0 auto;
  margin-bottom: 30px;
  li {
    padding: 20px;
    border-bottom: 1px solid #F1F4F7;
    height: auto;
  }
}
  .page-box {
    width: 880px;
    height: auto;
    margin: 0 auto;
    text-align: right;
    margin-bottom: 30px;
  }
</style>

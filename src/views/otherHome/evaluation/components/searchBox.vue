<template>
  <div class="search-form">
    <el-select v-model="searchParams.order" class="search-item1" size="mini" placeholder="考评年份" clearable>
      <el-option
        v-for="item in orderData"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-date-picker
      v-model="searchParams.time"
      class="search-item1"
      size="mini"
      type="daterange"
      range-separator="/"
      start-placeholder="自评时间"
      end-placeholder="自评时间"
      format="yyyy-MM-dd"
    />
    <el-date-picker
      v-model="searchParams.time"
      class="search-item1"
      size="mini"
      type="daterange"
      range-separator="/"
      start-placeholder="复评时间"
      end-placeholder="复评时间"
      format="yyyy-MM-dd"
    />
    <el-select v-model="searchParams.order" class="search-item1" size="mini" placeholder="完成状态" clearable>
      <el-option
        v-for="item in orderData"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select v-model="searchParams.order" class="search-item1" size="mini" placeholder="考评单位" clearable>
      <el-option
        v-for="item in orderData"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-button type="primary" size="mini" @click="search">搜索</el-button>
    <el-button size="mini" class="search-item1" @click="reset">清空</el-button>
  </div>
</template>

<script>
export default {
  components: {

  },
  props: {

  },
  data() {
    return {
      searchParams: {},
      orderData: []
    }
  },
  created() {
  },
  mounted() {

  },
  methods: {
    search() {

    },
    reset() {

    }
  }
}
</script>

<style scoped lang="scss">
.search-form {
  padding-top: 10px;
  border-bottom: 5px solid #f2f5fa;
}
.search-item1 {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>

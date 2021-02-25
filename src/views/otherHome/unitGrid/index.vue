<template>
  <el-table v-if="tableData && tableData.length > 0" style="width: 100%" height="600" border :data="tableData">
    <template v-for="(itemhead,index) in tableHead">
      <af-table-column :key="index" :fixed="index == 0" :prop="`court${index}`" :label="itemhead.NAME">
        <template slot-scope="scope">
          <div v-if="index>0">
            <div v-for="(item1,index1) in scope.row['court'+index]" :key="index1" :class="{'border-bottom': scope.row['court'+index].length > 1 && index1 != scope.row['court'+index].length-1}">
              <chequer ref="chequer" :child="item1" />
            </div>
          </div>
          <div v-else>
            <div v-for="(item1,index1) in scope.row['court'+index]" :key="index1">
              {{ scope.row['court'+index].NAME }}
            </div>
          </div>
        </template>
      </af-table-column>
    </template>
  </el-table>
</template>

<script>
import chequer from './chequer'
import { unitGrid } from '@/api/otherHome/otherHome.js'
export default {
  name: 'UnitGridIndex',
  components: {
    chequer
  },
  data() {
    return {
    // 表格数据
      tableData: null,
      data: [],
      tableHead: null
    }
  },
  computed: {

  },
  created() {
    this.getunitGrid()
  },
  mounted() {

  },
  methods: {
    getunitGrid() {
      unitGrid().then(({ state, infoList }) => {
        if (state === 100) {
          this.data = infoList
          this.tableHead = [...[{ NAME: infoList[0].centCourt }], ...infoList[0].flowCourt1]
          const tableContent = infoList.filter((item, index) => {
            return index > 0
          })
          const tableContent1 = tableContent.map((item, index) => {
            return [...[...[{ NAME: item.centCourt }]], ...item.flowCourt2]
          })
          const tableContent2 = tableContent1.map((item, index) => {
            const obj = {}
            item.forEach((item1, index1) => {
              const key = `court${index1}`
              obj[key] = item1
            })
            return obj
          })
          this.tableData = tableContent2
        }
      })
    }
  }
}
</script>

  <style scoped lang="scss">
    .border-bottom {
    border-bottom: 1px solid #EBEEF5;
    }
    ::v-deep tbody td{
      padding: 0;
    }
    ::v-deep tbody .cell {
    padding: 0px;
    text-align: center;
    }
    ::v-deep th .cell{
      text-align: center;
    }
  </style>


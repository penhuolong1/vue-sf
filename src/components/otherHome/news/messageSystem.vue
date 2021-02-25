<template>
  <div>
    <el-table
      :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%"
      height="500"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        :selectable="selectable"
      />
      <el-table-column
        label="内容"
        prop="content"
        width="300"
      />
      <el-table-column
        label="发布时间"
        prop="date"
        align="center"
      />
      <el-table-column
        label="状态"
        prop="has_read"
        align="center"
      />
    </el-table>
    <el-row>
      <el-col :span="12">
        <el-button type="text" style="display: inline-block;" @click="isRead">标为已读</el-button>
      </el-col>
      <el-col :span="12" class="page-box">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="10"
          :total="total"
          :current-page="pageNum"
          @current-change="handleChange"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { listAffiche, readAffiche } from '@/api/otherHome/otherHome'
import { formatDate } from '@/utils/format.js'
import { mapGetters } from 'vuex'
export default {
  name: 'MessageBox',
  data() {
    return {
      tableData: [],
      search: '',
      total: 10,
      // readType: 2,
      pageNum: 1,
      afficheType: 2,
      SelectIdArr: []
    }
  },
  computed: {
    ...mapGetters(['readType'])
  },
  mounted() {

  },
  created() {
    this.getList(this.pageNum, this.readType, this.afficheType)
  },
  methods: {
    selectable(row, index) {
      if (row.has_read == '已读') {
        return false
      } else {
        return true
      }
    },
    handleShow(index, row) {
      // 置为已读
      if (row.has_read == '未读') {
        readAffiche({ afficheIds: [row.unique_id] })
      }
      this.$emit('show', true, row)
    },
    handleSelectionChange(val) {
      this.SelectIdArr = val
    },
    handleChange(e) {
      this.getList(e, this.readType, this.afficheType)
    },
    getList(pageNum = 1, readType = 2, afficheType = 2) {
      this.pageNum = pageNum
      this.$store.commit('SET_READTYPE', readType)
      this.afficheType = afficheType
      const params = {
        pageSize: 10,
        pageNum: pageNum,
        readType: readType, // 0：全部 1：已读 2：未读
        afficheType: afficheType // 1:公告 2：系统消息

      }
      listAffiche(params).then(res => {
        if (res.state === 100) {
          const data = res.data.map(item => {
            return {
              unique_id: item.unique_id,
              content: item.content,
              file: item.file,
              title: item.title,
              sendName: item.send_name,
              date: formatDate(item.send_date, 'YYYY-MM-DD H:m:s'),
              has_read: item.has_read ? '已读' : '未读'
            }
          })
          this.total = res.total
          const count = {
            hasRead: res.hasRead,
            notRead: res.notRead
          }
          this.$emit('update:count', count)
          this.tableData = data
          console.log('0000000', data)
        }
      })
    },
    isRead() {
      const arr = this.SelectIdArr.map(item => item.unique_id)
      if (arr && arr.length == 0) {
        this.$message.error('请先勾选系统消息')
        return
      }
      const data = {
        afficheIds: arr
      }
      readAffiche(data).then(res => {
        if (res.state === 100) {
          this.getList(this.pageNum, this.readType, this.afficheType)
          this.$message.success(res.message)
        }
      })
    }
  }
}
</script>

<style scoped lang = "scss">
  .page-box {
    text-align: right;
    margin-top: 20px;
  }
</style>

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
        label="标题"
        prop="title"
        width="300"
      />
      <el-table-column
        label="发布者"
        prop="sendName"
        align="center"
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
      <el-table-column
        label="操作"
        align="right"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleShow(scope.row.unique_id,scope.row.has_read )"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="12">
        <el-button type="text" style="display: inline-block;" @click="isRead">标为已读</el-button>
      </el-col>
      <el-col :span="12" class="page-box">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageSize"
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
export default {
  name: 'MessageBox',
  props: {
    getType: {
      type: Object,
      default: function() {
        return {
          readType: 0, // 0：全部 1：已读 2：未读
          afficheType: 1// 1:公告 2：系统消息
        }
      }

    }
  },
  data() {
    return {
      tableData: [],
      search: '',
      total: 10,
      pageNum: 1,
      pageSize: 10,
      SelectIdArr: []
    }
  },
  computed: {

  },
  watch: {
    getType(newVal, oldVal) {
      this.getType = newVal
      this.getList()
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    selectable(row, index) {
      if (row.has_read == '已读') {
        return false
      } else {
        return true
      }
    },
    handleShow(unique_id, has_read) {
      // 置为已读
      if (has_read == '未读') {
        readAffiche({ afficheIds: [unique_id] })
      }
      this.$store.commit('SET_UNIQUEID', unique_id)
      this.$emit('show', 'messageDetail')
    },
    handleSelectionChange(val) {
      this.SelectIdArr = val
    },
    handleChange(e) {
      this.pageNum = e
      this.getList()
    },
    getList() {
      const params = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        readType: this.getType.readType, // 0：全部 1：已读 2：未读
        afficheType: this.getType.afficheType // 1:公告 2：系统消息
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
          this.pageNum = res.pageNumber
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
        this.$message.error('请先勾选系统公告')
        return
      }
      const data = {
        afficheIds: arr
      }
      readAffiche(data).then(res => {
        if (res.state === 100) {
          this.getList()
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

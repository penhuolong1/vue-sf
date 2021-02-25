import store from '@/store'
import {
  getCourt
} from '@/api/team/team.js'

export function getCourtList() {
  const userInfo = store.getters.getUserInfo
  let params = {}
  if (userInfo.courtId === 1) { // 假如登陆的角色是厦门市诉非联动中心
    params = {
      courtType: '0,1',
      courtId: `${userInfo.courtId}`,
      courtLevel: 1,
      pageSize: 1000,
      type: 2
    }
  } else {
    params = {
      courtType: '1',
      courtId: `${userInfo.courtId}`,
      courtLevel: userInfo.courtLevel + 1,
      pageSize: 1000,
      type: 2
    }
  }
  return new Promise((resolve, reject) => {
    //  获取数据
    getCourt(params).then(res => {
      console.log(res)
      if (res.state === 100) {
        resolve(res.content)
      }
    })
  })
}

import areaAllList from '@/assets/area'

export default {
  data() {
    return {
      // 携带出口区划
      areaExportList: [{ id: 999999, label: '国外出口', children: [] }],
      // 用户信息
      userInfo: {}
    }
  },
  created() {
    this.areaExportList = [...areaAllList.children, ...this.areaExportList]
    try {
      this.userInfo = this.getSessionItem('getUserMsg').datas
    } catch (error) {
    }
  },
  methods: {
    /**
     * @param num 区划ID值
     * @param list 区划数据
     * @return [110000, 110100, 110101]
     */
    interpretArea(num, list = this.areaExportList, china = false) {
      let label = ''
      const intAreaList = []
      debugger
      if (num && num.constructor !== Number) {
        num = String(num)
        if (!num || num.length !== 6) return num
      } else {
        return num
      }
      ;(function rcMap(num, list, level = 0) {
        const key = num.substring(level * 2, level * 2 + 2)
        if (!key) return null
        const listMap = list.filter(
          item => `${item.id}`.substring(level * 2, level * 2 + 2) === key
        )
        if (listMap.length === 1) {
          level++
          intAreaList.push(listMap[0].id)
          label += listMap[0].label
          return rcMap(num, listMap[0].children, level)
        }
      })(num, list)
      if (!china) {
        return intAreaList
      } else {
        return label
      }
    },
    /**
     * @param text 区划名称
     * @param list 查找的目标数组
     * @return 110000
     */
    chinaTextToNumber(text, list = this.areaExportList) {
      if (!text && text.constructor !== String) return text
      const obj = list.find(item => item.label === text)
      if (!obj) return ''
      return obj.id
    },
    /**
     * @param str 缓存名称
     * @param json 默认序列化
     * @return string
     */
    getSessionItem(str = '', json = true) {
      if (typeof str !== 'string') return
      const result = localStorage.getItem(str)
      if (result) {
        if (json) {
          return JSON.parse(result)
        } else {
          return result
        }
      } else {
        return ''
      }
    }
  }
}

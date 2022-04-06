/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * @param {number} num
 * @default 36
 *  */
export function getRandom(num) {
  const len = num || 36
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678' // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
  const maxPos = $chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

// 回显数据字典
export function selectDictLabel(datas, value) {
  var actions = []
  Object.keys(datas).some(key => {
    if (datas[key].value == '' + value) {
      actions.push(datas[key].label)
      return true
    }
  })
  return actions.join('')
}

// 日期格式转换：yyyy-MM-dd => yyyy年MM月dd日
export function dateTransformType(date) {
  let newDate = ''
  if (date) {
    let dateStringList = date.split('-')
    newDate = `${dateStringList[0]}年${dateStringList[1]}月${
      dateStringList[2]
    }日`
  }
  return newDate
}

export function debounce(fn, delay) {
  var timer = null
  return function() {
    var context = this
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.call(context, ...arguments)
    }, delay || 500)
  }
}

// 导出功能
export function exportToBlobXLSX(url, params = {}, fileName = '') {
  if (!url) return
  // 序列化
  const formatParam = data => {
    if (data == null) return ''
    const params = []
    for (const key in data) {
      params.push(key + '=' + (data[key] || ''))
    }
    return params.join('&')
  }
  // 开启 xhr
  const xhr = new XMLHttpRequest()
  xhr.open('GET', `${url}?${formatParam(params)}`, true)
  xhr.setRequestHeader(
    'Authorization',
    'Bearer ' + sessionStorage.getItem('usertoken')
  )
  xhr.responseType = 'blob'
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const blob = this.response
      const a = document.createElement('a')
      const url = URL.createObjectURL(blob)
      a.href = url
      a.download = fileName
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }
  xhr.send()
}

// 区划翻译
export function areaTranslate(num, list = [], china = false, length = 6) {
  if (!num || typeof num !== 'string') {
    num = String(num)
  }
  let label = ''
  const intAreaList = []
  // IIFE 递归翻译区划 按照每2位对比规则
  ;(function rcMap(num, list, level = 0) {
    const key = num.substring(level * 2, level * 2 + 2)
    if (!key || !list) return null
    const listMap = list.filter(
      item => String(item.id).substring(level * 2, level * 2 + 2) === key
    )
    level++
    // 处理直辖市
    if (listMap.length > 1) {
      return rcMap(num, listMap, level)
    } else if (!listMap.length) return
    intAreaList.push(listMap[0]?.id)
    label += listMap[0]?.label
    return rcMap(num, listMap[0]?.children, level)
  })(num, list)
  // 如果是中文翻译 返回字符串翻译中文
  return china ? label : intAreaList
}

import defaultSettings from '@/settings'

const title = defaultSettings.title || '非药品类易制毒化学品综合管理信息系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}

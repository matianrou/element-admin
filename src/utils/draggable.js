const draggable = {
  inserted: function(el) {
    el.style.cursor = 'move'
    el.onmousedown = function(e) {
      const disx = e.pageX - el.offsetLeft
      const disy = e.pageY - el.offsetTop
      el.offsetParent.onmousemove = function(e) {
        let x = e.pageX - disx
        let y = e.pageY - disy
        const maxX =
          el.offsetParent.clientWidth -
          parseInt(window.getComputedStyle(el).width)
        const maxY =
          el.offsetParent.clientHeight -
          parseInt(window.getComputedStyle(el).height)
        if (x < 0) {
          x = 0
        } else if (x > maxX) {
          x = maxX
        }

        if (y < 0) {
          y = 0
        } else if (y > maxY) {
          y = maxY
        }

        el.style.left = x + 'px'
        el.style.top = y + 'px'
      }
      el.offsetParent.onmouseup = function() {
        el.offsetParent.onmousemove = el.offsetParent.onmouseup = null
      }
      e.preventDefault()
    }
  }
}
export default draggable
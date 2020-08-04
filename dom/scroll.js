function isWindow(val) {
  return val === window;
}

const overflowScrollReg = /scroll|auto/i;
export function getScroller(el, root = window) {
  let node = el;
  // 非html标签 非Element 非顶层或指定元素
  while (node && node.tagName !== 'HTML' && node.nodeType === 1 && node !== root) {
    const { overflowY } = window.getComputedStyle(node);
    // 可滑动元素
    if (overflowScrollReg.test(overflowY)) {
      if (node.tagName !== 'BODY') return node;
      const { overflowY: htmlOverflowY } = window.getComputedStyle(node.parentNode);
      if (overflowScrollReg.test(htmlOverflowY)) return node;
    }
    node = node.parentNode;
  }
  return node;
}

// 返回文档在窗口垂直方向滚动的像素(后者不兼容IE9及更早版本)
export function getScrollTop(el) {
  return 'scrollTop' in el ? el.scrollTop : el.pageYOffset;
}

export function setScrollTop(el, value) {
  if ('scrollTop' in el) {
    el.scrollTop = value;
  } else {
    el.scrollTo(el.scrollX, value);
  }
}

export function getRootScrollTop() {
  return (
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

export function setRootScrollTop(value) {
  setScrollTop(window, value);
  setScrollTop(document.body, value);
}

// get distance from element top to page top or scroller top
export function getElementTop(el, scroller) {
  if (isWindow(el)) {
    return 0;
  }

  const scrollTop = scroller ? getScrollTop(scroller) : getRootScrollTop();
  return el.getBoundingClientRect().top + scrollTop;
}

export function removeNode(el) {
  const parent = el.parentNode;
  parent && parent.removeNode(el);
}

import { createBEM } from './bem';
import { createComponent } from './component';

export function createNamespace(name) {
  name = 'ox-' + name;
  // 组件函数,类名函数
  return [createComponent(name), createBEM(name)];
}

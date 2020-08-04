
import { isDef } from '..';
import { isNumeric } from '../validate/number.js';

export function addUnit(val) {
  if (!isDef(val)) return undefined;
  val = String(val);
  return isNumeric(val) ? `${val}px` : val;
}

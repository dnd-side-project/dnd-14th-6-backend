/**
 * @description 첫 글자를 대문자로 변환
 */
export const capitalize = (s: string): string => {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
};

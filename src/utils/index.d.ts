export function toUnocssClass(
  css: string,
  isRem?: boolean,
  debug?: boolean,
  isRemoveRpx?: boolean,
  isRemovePx?: boolean
): [string, string[]];

export function transformStyleToUnocss(
  styles: string,
  isRem?: boolean,
  debug?: boolean
): [string, string[]];

export function toUnocss(css: string, isRem?: boolean): string | undefined;

export function transformImportant(
  v: string,
  trimSpace?: boolean
): [string, string];

export function getFirstName(s: string): string;
export function getLastName(s: string): string;
export function getVal(
  val: string,
  transform?: ((v: string) => string) | undefined,
  inClass?: boolean,
  prefix?: string,
  dynamicFlag?: boolean
): string;
export function getHundred(n: string | number): number;
export function joinWithLine(s: string): string;
export function joinWithUnderLine(s: string): string;
export function trim(s: string, type?: 'all' | 'pre' | 'around' | 'post'): string;
export function isVar(s: string): boolean;
export function isCalc(s: string): boolean;
export function isUrl(s: string): boolean;
export function isPercent(s: string): boolean;
export function isHex(hex: string): boolean;
export function isRgb(s: string): boolean;
export function isHsl(s: string): boolean;
export function isCubicBezier(s: string): boolean;
export function isColor(s: string): boolean;
export function isSize(s: string): boolean;

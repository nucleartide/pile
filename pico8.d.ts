/**
 * Graphics.
 */

declare enum col {
  black,
  dark_blue,
  dark_purple,
  dark_green,
  brown,
  dark_gray,
  light_gray,
  white,
  red,
  orange,
  yellow,
  green,
  blue,
  indigo,
  pink,
  peach,
}

declare function print<T>(str: T): void
declare function print<T>(str: T, x: number, y: number, col?: col): void

/**
 * Tables.
 */

/**
 * Input.
 */

declare enum button {
  left,
  right,
  up,
  down,
  z,
  x,
}

/**
 * Audio.
 */

/**
 * Map.
 */

/**
 * Memory.
 */

/**
 * Math.
 */

/**
 * Custom menu items.
 */

/**
 * Strings.
 */

/**
 * Types.
 */

/**
 * Cartridge data.
 */

// ===

/**
 * Math.
 */

// declare function print(str, x, y, col)
//declare function cls(col?: col): void
//declare function flr(x: number): number
//declare function ceil(x: number): number

//declare function print(
//  v: string | number,
//  x?: number,
//  y?: number,
//  col?: col
//): void
//declare function max(a: number, b: number): number
//declare function min(a: number, b: number): number
//declare function ceil(n: number): number
//declare function sqrt(n: number): number
//declare function stop(): void
//declare function assert(b: boolean): void
//declare function sin(n: number): number
//declare function cos(n: number): number
//declare function peek4(n: number): number
//declare function add<T>(arr: Array<T>, thing: T): Array<T>
//declare function line(
//  x0: number,
//  y0: number,
//  x1: number,
//  y1: number,
//  col?: col
//): void
//declare function rectfill(
//  x0: number,
//  y0: number,
//  x1: number,
//  y1: number,
//  col?: col
//): void
//declare function btn(b: button, index?: number): boolean
//declare function memcpy(destaddr: number, sourceaddr: number, len: number): void
//declare function palt(col?: col, t?: boolean): void
//declare function sspr(
//  sx: number,
//  sy: number,
//  sw: number,
//  sh: number,
//  dx: number,
//  dy: number,
//  dw?: number,
//  dh?: number,
//  flip_x?: boolean,
//  flip_y?: boolean
//): void
//declare function pal(c0?: col, c1?: col, p?: 0 | 1): void

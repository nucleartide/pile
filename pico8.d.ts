/**
 * System.
 */

declare function assert<T>(cond: boolean, message?: T): void
declare function stop<T>(message?: T): void

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
declare function cls(col?: col): void

/**
 * Tables.
 */

declare function add<T>(t: Array<T>, v: T): Array<T>

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

declare function peek4(addr: number): number
declare function poke4(addr: number, val: number): void

/**
 * Math.
 */

declare function max<X extends number, Y extends number>(x: X, y: Y): X | Y
declare function min<X extends number, Y extends number>(x: X, y: Y): X | Y
declare function mid<X extends number, Y extends number, Z extends number>(
  x: X,
  y: Y,
  z: Z
): X | Y | Z
declare function flr(x: number): number
declare function ceil(x: number): number
declare function sqrt(x: number): number
declare function cos(x: number): number
declare function sin(x: number): number

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

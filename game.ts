declare function cls(c: col): void
declare function flr(n: number): number

/**
 * game loop.
 */

function _update() {}

function _draw() {
  cls(col.indigo)
}

/**
 * utils.
 */

enum col {
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

/**
 * math.
 */

function round(n: number) {
  return flr(n + 0.5)
}

function lerp(a: number, b: number, t: number): number {
  return (1 - t) * a + t * b
}

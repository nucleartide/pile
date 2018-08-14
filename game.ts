declare function cls(c: col): void
declare function flr(n: number): number
declare function print(s: string): void

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

interface vec3 {
  x: number
  y: number
  z: number
}

function vec3(x?: number, y?: number, z?: number): vec3 {
  return {
    x: x || 0,
    y: y || 0,
    z: z || 0,
  }
}

/*
function vec3_add(out: vec3, a: vec3, b: vec3): void {
  out.x = a.x + b.x
  out.y = a.y + b.y
  out.z = a.z + b.z
}
*/

function vec3_sub(out: vec3, a: vec3, b: vec3): void {
  out.x = a.x - b.x
  out.y = a.y - b.y
  out.z = a.z - b.z
}

/*
function vec3_mul(out: vec3, a: vec3, b: vec3): void {
  out.x = a.x * b.x
  out.y = a.y * b.y
  out.z = a.z * b.z
}
*/

function vec3_print(v: vec3): void {
  print(v.x + ", " + v.y + ", " + v.z)
}

function vec3_dot(a: vec3, b: vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z
}

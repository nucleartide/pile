declare function cls(c: col): void
declare function flr(n: number): number
declare function print(v: string | number): void
declare function max(a: number, b: number): number
declare function sqrt(n: number): number
declare function stop(): void

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

function vec3_scale(v: vec3, c: number): void {
  v.x *= c
  v.y *= c
  v.z *= c
}

function vec3_magnitude(v: vec3): number {
  if (v.x > 104 || v.y > 104 || v.z > 104) {
    const m = max(max(v.x, v.y), v.z)
    const x = v.x / m
    const y = v.y / m
    const z = v.z / m
    return sqrt(x ** 2 + y ** 2 + z ** 2) * m
  }

  return sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2)
}

{
  print(vec3_magnitude(vec3(1, 1, 1)))
  print(vec3_magnitude(vec3(2, 2, 2)))
  print(vec3_magnitude(vec3(3, 3, 3)))
  print(vec3_magnitude(vec3(200, 200, 200)))
  stop()
}

function vec3_normalize(v: vec3): void {
  const m = vec3_magnitude(v)
  if (m === 0) return
  v.x /= m
  v.y /= m
  v.z /= m
}

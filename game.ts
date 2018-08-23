declare function cls(c: col): void
declare function flr(n: number): number
declare function print(
  v: string | number,
  x?: number,
  y?: number,
  col?: col
): void
declare function max(a: number, b: number): number
declare function min(a: number, b: number): number
declare function ceil(n: number): number
declare function sqrt(n: number): number
declare function stop(): void
declare function assert(b: boolean): void
declare function sin(n: number): number
declare function cos(n: number): number
declare function peek4(n: number): number
declare function add<T>(arr: Array<T>, thing: T): Array<T>
declare function line(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  col?: col
): void
declare function rectfill(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  col?: col
): void
declare function btn(b: button, index?: number): boolean
declare function memcpy(destaddr: number, sourceaddr: number, len: number): void
declare function palt(col?: col, t?: boolean): void
declare function sspr(
  sx: number,
  sy: number,
  sw: number,
  sh: number,
  dx: number,
  dy: number,
  dw?: number,
  dh?: number,
  flip_x?: boolean,
  flip_y?: boolean
): void
declare function pal(c0?: col, c1?: col, p?: 0 | 1): void
declare var _init: () => void
declare var _update60: () => void
declare var _draw: () => void

/**
 * -->8 game loop.
 */

_draw = (): void => {
  cls(col.indigo)
}

/**
 * -->8 utils.
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

enum button {
  left,
  right,
  up,
  down,
  z,
  x,
}

/**
 * -->8 math.
 */

function round(n: number): number {
  return flr(n + 0.5)
}

function lerp(a: number, b: number, t: number): number {
  return (1 - t) * a + t * b
}

// clockwise() implements the shoelace formula for checking
// the clock direction of a collection of points.
//
// note: when the sum/area is zero, clockwise() arbitrarily
// chooses "clockwise" as a direction. the sum/area is zero
// when all points are on the same scanline, for instance.
function clockwise(points: Array<vec3>): boolean {
  let sum = 0
  for (let i = 0; i < 10; i++) {
    const point = points[i]
    const next_point = points[i % points.length]
    // to debug wrong clockwise values,
    // print the return value of this function
    // while rotating a polygon continuously.
    // we divide by 10 to account for overflow.
    sum =
      sum + (((next_point.x - point.x) / 10) * (next_point.y + point.y)) / 10
  }
  return sum <= 0
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
  print(v.x + ', ' + v.y + ', ' + v.z)
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
    const x = v.x / m,
      y = v.y / m,
      z = v.z / m
    return sqrt(x ** 2 + y ** 2 + z ** 2) * m
  }

  return sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2)
}

/*
{
  print(vec3_magnitude(vec3(1, 1, 1)))
  print(vec3_magnitude(vec3(2, 2, 2)))
  print(vec3_magnitude(vec3(3, 3, 3)))
  print(vec3_magnitude(vec3(200, 200, 200)))
}
*/

function vec3_normalize(v: vec3): void {
  const m = vec3_magnitude(v)
  if (m === 0) return
  v.x /= m
  v.y /= m
  v.z /= m
}

/*
{
  const v = vec3(200, 200, 200)
  vec3_normalize(v)
  print(vec3_magnitude(v))
}
*/

function vec3_lerp(out: vec3, a: vec3, b: vec3, t: number): void {
  const ax = a.x,
    ay = a.y,
    az = a.z
  const bx = b.x,
    by = b.y,
    bz = b.z
  out.x = lerp(ax, bx, t)
  out.y = lerp(ay, by, t)
  out.z = lerp(az, bz, t)
}

type mat3 = [vec3, vec3, vec3]

let vec3_mul_mat3: (out: vec3, v: vec3, m: mat3) => void
{
  const spare = vec3()
  vec3_mul_mat3 = function(out: vec3, v: vec3, m: mat3): void {
    spare.x = v.x
    spare.y = v.y
    spare.z = v.z
    out.x = vec3_dot(spare, m[0])
    out.y = vec3_dot(spare, m[1])
    out.z = vec3_dot(spare, m[2])
  }
}

function assert_vec3_equal(a: vec3, b: vec3): void {
  assert(a.x === b.x)
  assert(a.y === b.y)
  assert(a.z === b.z)
}

function vec3_zero(v: vec3): void {
  v.x = 0
  v.y = 0
  v.z = 0
}

function mat3(): mat3 {
  return [vec3(), vec3(), vec3()]
}

// set matrix `m` to be a counterclockwise rotation of `a` around the x-axis.
// assume right-handed coordinates.
function mat3_rotate_x(m: mat3, a: number): void {
  m[0].x = 1
  m[0].y = 0
  m[0].z = 0

  m[1].x = 0
  m[1].y = cos(a)
  m[1].z = sin(a)

  m[2].x = 0
  m[2].y = -sin(a)
  m[2].z = cos(a)
}

{
  const out = vec3()
  const v = vec3(-46, 0, -64)
  const m = mat3()

  mat3_rotate_x(m, 0)
  vec3_mul_mat3(out, v, m)
  assert_vec3_equal(out, vec3(-46, 0, -64))

  mat3_rotate_x(m, 0.25)
  vec3_mul_mat3(out, v, m)
  assert_vec3_equal(out, vec3(-46, 64, 0))

  mat3_rotate_x(m, 0.5)
  vec3_mul_mat3(out, v, m)
  assert_vec3_equal(out, vec3(-46, 0, 64))

  mat3_rotate_x(m, 0.75)
  vec3_mul_mat3(out, v, m)
  assert_vec3_equal(out, vec3(-46, -64, 0))
}

// set matrix `m` to be a counterclockwise rotation of `a`
// around the y-axis. assume right-handed coordinates.
function mat3_rotate_y(m: mat3, a: number): void {
  m[0].x = cos(a)
  m[0].y = 0
  m[0].z = -sin(a)

  m[1].x = 0
  m[1].y = 1
  m[1].z = 0

  m[2].x = sin(a)
  m[2].y = 0
  m[2].z = cos(a)
}

{
  const out = vec3()
  const v = vec3(-46, 0, -64)
  const m = mat3()

  mat3_rotate_y(m, 0)
  vec3_mul_mat3(out, v, m)
  assert_vec3_equal(out, vec3(-46, 0, -64))

  mat3_rotate_y(m, 0.25)
  vec3_mul_mat3(out, v, m)
  assert_vec3_equal(out, vec3(-64, 0, 46))

  mat3_rotate_y(m, 0.5)
  vec3_mul_mat3(out, v, m)
  assert_vec3_equal(out, vec3(46, 0, 64))

  mat3_rotate_y(m, 0.75)
  vec3_mul_mat3(out, v, m)
  assert_vec3_equal(out, vec3(64, 0, -46))
}

{
  const out = vec3()
  const v = vec3(-46, 0, -64)
  const m = mat3()

  mat3_rotate_y(m, 0.5)
  vec3_mul_mat3(out, v, m)

  mat3_rotate_x(m, 0.25)
  vec3_mul_mat3(out, out, m)

  assert_vec3_equal(out, vec3(46, -64, 0))
}

/**
 * -->8 data readers.
 */

let read_num: () => number
{
  const map_addr = 0x2000
  let offset = 0
  read_num = function(): number {
    const n = peek4(map_addr + offset)
    offset += 4
    return n
  }
}

function read_vec3(): vec3 {
  return vec3(read_num(), read_num(), read_num())
}

function read_lines(): Array<line> {
  const count = read_num()
  const lines: Array<line> = []

  for (let i = 0; i < count; i++) {
    add<line>(lines, {
      start_vec: read_vec3(),
      end_vec: read_vec3(),
      col: read_num(),
      start_screen: vec3(),
      end_screen: vec3(),
    })
  }

  return lines
}

/**
 * -->8 line.
 */

interface line {
  start_vec: vec3
  end_vec: vec3
  col: col
  start_screen: vec3
  end_screen: vec3
}

function line_draw(l: line, c: cam): void {
  cam_project(c, l.start_screen, l.start_vec)
  cam_project(c, l.end_screen, l.end_vec)
  line(
    round(l.start_screen.x),
    round(l.start_screen.y),
    round(l.end_screen.x),
    round(l.end_screen.y),
    l.col
  )
}

/**
 * -->8 polygon.
 */

interface polygon {
  points_world: Array<vec3>
  points_screen: Array<vec3>
  col: col
  cam: cam
}

function polygon(col: col, cam: cam, points: Array<vec3>): polygon {
  const points_screen: Array<vec3> = []
  for (let i = 0; i < points.length; i++) {
    add(points_screen, vec3())
  }

  return {
    points_world: points,
    points_screen: points_screen,
    col: col,
    cam: cam,
  }
}

function polygon_update(p: polygon): void {
  for (let i = 0; i < p.points_world.length; i++) {
    cam_project(p.cam, p.points_screen[i], p.points_world[i])
  }
}

interface NumberMap {
  [key: number]: number
}

/** !TupleReturn */
function polygon_edge(
  v1: vec3,
  v2: vec3,
  xl: NumberMap,
  xr: NumberMap,
  is_clockwise: boolean
): [number, number] {
  let x1 = v1.x
  let x2 = v2.x

  let fy1 = flr(v1.y)
  let fy2 = flr(v2.y)

  let t = (is_clockwise && xr) || xl

  if (fy1 === fy2) {
    if (fy1 < 0) return [0, 0]
    if (fy1 > 127) return [127, 127]
    const xmin = max(min(x1, x2), 0)
    const xmax = min(max(x1, x2), 127)
    xl[fy1] = (!xl[fy1] && xmin) || min(xl[fy1], xmin)
    xr[fy1] = (!xr[fy1] && xmax) || max(xr[fy1], xmax)
    return [fy1, fy1]
  }

  // ensure fy1 < fy2.
  if (fy1 > fy2) {
    let _

    _ = x1
    x1 = x2
    x2 = _

    _ = fy1
    fy1 = fy2
    fy2 = _

    t = (t === xl && xr) || xl
  }

  // for each scanline in range, compute left or right side.
  // we must use floored y, since we are computing sides for
  // integer y-offsets.
  const ys = max(fy1, 0)
  const ye = min(fy2, 127)
  const m = (x2 - x1) / (fy2 - fy1)
  for (let y = ys; y <= ye; y++) {
    t[y] = m * (y - fy1) + x1
  }

  return [ys, ye]
}

// note: polygon must be convex. concave polygons draw artifacts.
function polygon_draw(p: polygon): void {
  const points = p.points_screen
  const xl: NumberMap = {},
    xr: NumberMap = {}
  let ymin = 32767,
    ymax = -32768
  const is_clockwise = clockwise(points)

  for (let i = 0; i < points.length; i++) {
    const point = points[i]
    const next_point = points[i % points.length]
    const [ys, ye] = polygon_edge(point, next_point, xl, xr, is_clockwise)
    ymin = min(ys, ymin)
    ymax = max(ye, ymax)
  }

  for (let y = ymin; y <= ymax; y++) {
    if (xl[y] && xr[y]) {
      rectfill(round(xl[y]), y, round(xr[y]), y, p.col)
    } else {
      print(y, 0, 0, 7)
      assert(false)
    }
  }
}

{
  let c: cam, p: polygon

  const init = function(): void {
    const s = 6

    c = cam()
    c.dist = 12 * s
    c.fov = 34 * s

    // pentagon.
    p = polygon(col.peach, c, [
      vec3(30, -30, 0),
      vec3(30, 30, 0),
      vec3(-30, 30, 0),
      vec3(-50, 0, 0),
      vec3(-30, -30, 0),
    ])

    // court.
    p = polygon(col.dark_green, c, [
      // 6.1 x 13.4
      vec3((3.05 + 1) * s, 0, (6.7 + 1) * s),
      vec3((3.05 + 1) * s, 0, (-6.7 - 1) * s),
      vec3((-3.05 - 1) * s, 0, (-6.7 - 1) * s),
      vec3((-3.05 - 1) * s, 0, (6.7 + 1) * s),
    ])
  }

  const update = function(): void {
    if (btn(button.down)) c.x_angle += 0.01
    if (btn(button.up)) c.x_angle -= 0.01
    if (btn(button.left)) c.y_angle += 0.01
    if (btn(button.right)) c.y_angle -= 0.01
    polygon_update(p)
  }

  const draw = function(): void {
    cls(col.dark_blue)
    polygon_draw(p)
  }

  _init = init
  _update60 = update
  _draw = draw
}

// copy data from screen to spritesheet.
// note: offset should be even.
// note: odd x1 values will copy an extra column of pixels on the left.
// example: if x1==5, then you will copy pixel 4 and pixel 5.
function copy_to_spritesheet(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  offset: number
): void {
  const width = x2 - x1 + 1
  for (let i = y1; i <= y2; i++) {
    // copy row by row.
    memcpy(
      (i - y1) * 64 + offset / 2, // one row of pixels is 64 bytes.
      0x6000 + i * 64 + x1 / 2,
      ceil(width / 2) + 1 // copy pixels, +1 column for good measure.
    )
  }
}

// (x1,y1) is the top-left corner of the shadow.
function shadow_draw(
  spx: number,
  spy: number,
  spw: number,
  sph: number,
  x1: number,
  y1: number
): void {
  // bottom-right corner. never extends beyond bottom-right point.
  const x2 = min(x1 + spw, 128)
  const y2 = min(y1 + sph, 128)

  const on_screen = !(false || x2 < 0 || x1 > 127 || y2 < 0 || y1 > 127)

  if (!on_screen) {
    return
  }

  const x1_min = max(x1, 0)
  const y1_min = max(y1, 0)

  const draw_width = x2 - x1_min
  const draw_height = y2 - y1_min

  // copy original area to spritesheet.
  copy_to_spritesheet(x1_min, y1_min, x2, y2, 0)

  // draw mask to screen.
  // shadow is transparent, black part is not
  palt(col.black, false)
  palt(col.dark_blue, true)
  sspr(spx, spy, spw, sph, x1, y1, spw, sph)

  // copy original area with black border to spritesheet.
  copy_to_spritesheet(x1_min, y1_min, x2, y2, 14)

  // draw copied area to screen
  palt()
  sspr(
    x1_min % 2,
    0,
    draw_width,
    draw_height,
    x1_min,
    y1_min,
    draw_width,
    draw_height
  )

  // perform some palette swaps
  pal(3, 1)
  pal(6, 5)
  pal(13, 1)

  // draw original region with mask
  // remember, black is transparent
  sspr(
    14 + (x1_min % 2),
    0,
    draw_width,
    draw_height,
    x1_min,
    y1_min,
    draw_width,
    draw_height
  )

  // reset palette state
  pal()
}

function sprite(): void {}

interface player {
  player_num: number
  vel: vec3
  acc: vec3
  scale: number
  desired_acc: number
  pos: vec3
  cam: cam
}

function player(cam: cam): player {
  const scale = 6

  return {
    player_num: 0,
    vel: vec3(),
    acc: vec3(),
    scale: scale,
    desired_acc: 0.1 * scale, // meters per second
    pos: vec3(),
    cam: cam,
  }
}

function player_input_keyboard(p: player): void {
  // reset acceleration.
  vec3_zero(p.acc)

  // handle input
  if (btn(button.left, p.player_num)) {
    p.acc.x = p.acc.x - p.desired_acc
  }
  if (btn(button.right, p.player_num)) {
    p.acc.x = p.acc.x + p.desired_acc
  }
  if (btn(button.up, p.player_num)) {
    p.acc.z = p.acc.z - p.desired_acc
  }
  if (btn(button.down, p.player_num)) {
    p.acc.z = p.acc.z + p.desired_acc
  }

  // compute new acceleration
  vec3_normalize(p.acc)
  vec3_scale(p.acc, p.desired_acc)

  // compute new velocity
  const t = 0.4
  vec3_lerp(p.vel, p.vel, p.acc, t)
}

function player_update(p: player): void {
  player_input_keyboard(p)
  p.pos.x = p.pos.x + p.vel.x
  p.pos.y = p.pos.y + p.vel.y
  p.pos.z = p.pos.z + p.vel.z
}

let player_draw: (p: player) => void
{
  const spare = vec3()
  player_draw = function(p: player): void {
    cam_project(p.cam, spare, p.pos)
    shadow_draw(0, 8, 12, 7, round(spare.x), round(spare.y))
    // pset(round(spare.x), round(spare.y), colors_pink)
  }
}

enum game_state {
  playing,
}

/**
 * -->8 camera.
 */

interface cam {
  pos: vec3
  x_angle: number
  mx: mat3
  y_angle: number
  my: mat3
  dist: number
  fov: number
}

function cam(): cam {
  return {
    pos: vec3(),
    x_angle: 0,
    mx: mat3(),
    y_angle: 0,
    my: mat3(),
    dist: 7 * 10,
    fov: 150,
  }
}

function cam_project(c: cam, out: vec3, v: vec3): void {
  // world to view.
  vec3_sub(out, v, c.pos)

  // rotate vector around y-axis.
  mat3_rotate_y(c.my, -c.y_angle)
  vec3_mul_mat3(out, out, c.my)

  // rotate vector around x-axis.
  mat3_rotate_x(c.mx, -c.x_angle)
  vec3_mul_mat3(out, out, c.mx)

  // add orthographic part of perspective divide.
  // in a sense, this is a "field of view".
  out.z = out.z + c.fov

  // perform perspective divide.
  const perspective = out.z / c.dist
  out.x = perspective * out.x
  out.y = perspective * out.y

  // ndc to screen.
  out.x = out.x + 64
  out.y = -out.y + 64
}

/**
 * -->8 game class.
 */

interface game {
  court_lines: Array<line>
  net_lines: Array<line>
  cam: cam
  court: polygon
  player: player
}

function game(): game {
  const court_lines = read_lines()
  const net_lines = read_lines()

  const s = 6
  const c = cam()
  c.dist = 12 * s
  c.fov = 34 * s
  c.x_angle = -0.08
  c.pos.y = -0.5 * s

  const p = polygon(col.dark_green, c, [
    vec3(-3.8 * s, 0, -7.7 * s),
    vec3(-3.8 * s, 0, 7.7 * s),
    vec3(3.8 * s, 0, 7.7 * s),
    vec3(3.8 * s, 0, -7.7 * s),
  ])

  return {
    court_lines: court_lines,
    net_lines: net_lines,
    cam: c,
    court: p,
    player: player(c),
  }
}

function game_update(g: game): void {
  polygon_update(g.court)
  player_update(g.player)
}

function game_draw(g: game): void {
  polygon_draw(g.court)

  for (let i = 0; i < g.court_lines.length; i++) {
    const l = g.court_lines[i]
    line_draw(l, g.cam)
  }

  for (let i = 0; i < g.net_lines.length; i++) {
    const l = g.net_lines[i]
    line_draw(l, g.cam)
  }

  player_draw(g.player)
}

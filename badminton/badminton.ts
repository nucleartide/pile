/// <reference path="../@types/pico8.d.ts">

/**
 * Configuration.
 */

// 1 meter === 6 world space units.
const meter: number = 6

// 1 second === 60 frames, since we're using `_update60`.
const second: number = 60

// Required score to reach a win state.
// TODO: Remove upon fleshing out scoring.
const win_score = 1

// Zero vector. Use it for z-sorting!
const zero_vec = { x: 0, y: 0, z: 0 }

/**
 * Color.
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
 * Palette.
 */

enum palette {
  draw,
  screen,
}

/**
 * Button.
 */

enum button {
  left,
  right,
  up,
  down,
  z,
  x,
}

/**
 * Actor.
 */

interface Actor {
  update: (o: any) => void
  draw: (o: any) => void
}

/**
 * State.
 */

enum state {
  serve,
  rally,
  post_rally,
}

/**
 * Game loop.
 *
 * States:
 * - Menu (todo)
 * - Game
 */

let actors: Array<Actor>
let actors_obj: { [key: string]: Actor }

function _init(): void {
  /**
   * Read map data.
   */

  const court_lines = read_lines()
  const net_lines = read_lines()

  /**
   * Construct camera.
   */

  const c = cam()
  c.dist = 12 * meter
  c.fov = 34 * meter
  c.x_angle = -0.05
  c.pos.y = -0.5 * meter

  /**
   * Construct net.
   */

  const n = net(net_lines, c)

  /**
   * Construct court.
   */

  const crt = court(court_lines, c)

  /**
   * Construct ball.
   */

  const b = ball(c, n)

  /**
   * Construct game.
   */

  const g = game(crt, b)

  /**
   * Construct player.
   */

  const player_user = player(
    c,
    b,
    -0.5 * meter,
    0,
    5 * meter,
    player_keyboard_input,
    vec3(-2.59 * meter, 0, 0.5 * meter),
    vec3(2.59 * meter, 0, 6.7 * meter),
    -1,
    function(p: Player): boolean {
      /**
       * Compute `player_to_ball` vector.
       *
       * Note: player's chest is 1m above the ground.
       */

      vec3_sub(p.player_to_ball, p.ball.pos, p.pos)
      p.player_to_ball.y += 1 * meter

      /**
       * Compute swing pre-condition.
       *
       * Condition: ball is in-range.
       * Condition: ball is still in air.
       * Condition: not currently swinging.
       */

      return (
        vec3_magnitude(p.player_to_ball) < 2.5 * meter &&
        p.ball.pos.y > 0 &&
        p.swing_time < 0.1 &&
        btn(button.z)
      )
    },
    g,
    true
  )

  /**
   * Construct opponent.
   */

  const opponent = player(
    c,
    b,
    -0.5 * meter,
    0,
    -5 * meter,
    player_ai,
    vec3(-2.59 * meter, 0, -6.7 * meter),
    vec3(2.59 * meter, 0, -0.5 * meter),
    1,
    function(p: Player): boolean {
      /**
       * Compute `player_to_ball` vector.
       *
       * Note: player's chest is 1m above the ground.
       */

      vec3_sub(p.player_to_ball, p.ball.pos, p.pos)
      p.player_to_ball.y += 1 * meter

      /**
       * Compute swing pre-condition.
       *
       * Condition: ball is in-range.
       * Condition: ball is still in air.
       * Condition: not currently swinging.
       */

      return (
        vec3_magnitude(p.player_to_ball) < 2.5 * meter &&
        p.ball.pos.y > 0 &&
        p.swing_time < 0.1
      )
    },
    g,
    false
  )

  /**
   * Initialize actors.
   */

  actors = [c, n, crt, b, g, player_user, opponent]
  actors_obj = {
    camera: c,
    net: n,
    court: crt,
    ball: b,
    game: g,
    player: player_user,
    opponent: opponent,
  }
}

function _update60(): void {
  for (let i = 0; i < actors.length; i++) {
    const a = actors[i]
    a.update(a)
  }
}

function _draw(): void {
  /**
   * Clear screen.
   */

  cls(col.dark_purple)

  /**
   * Do z-sorting.
   */

  const order: OrderArray = []
  insert_into(order, zero_vec, actors_obj.net)
  insert_into(order, (actors_obj.player as Player).pos, actors_obj.player)
  insert_into(order, (actors_obj.opponent as Player).pos, actors_obj.opponent)
  insert_into(order, (actors_obj.ball as Ball).pos, actors_obj.ball)

  /**
   * Draw.
   */

  // Draw court first.
  const court = actors_obj.court
  court.draw(court)

  // Draw z-sorted actors.
  for (let i = 0; i < order.length; i++) {
    const a = order[i][1]
    a.draw(a)
  }

  // Draw game last.
  const game = actors_obj.game
  game.draw(game)
}

/*
// This is a camera & polygon test.
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
*/

/**
 * Vec3.
 */

interface Vec3 {
  x: number
  y: number
  z: number
}

function vec3(x?: number, y?: number, z?: number): Vec3 {
  return {
    x: x || 0,
    y: y || 0,
    z: z || 0,
  }
}

function vec3_add(out: Vec3, a: Vec3, b: Vec3): void {
  out.x = a.x + b.x
  out.y = a.y + b.y
  out.z = a.z + b.z
}

function vec3_sub(out: Vec3, a: Vec3, b: Vec3): void {
  out.x = a.x - b.x
  out.y = a.y - b.y
  out.z = a.z - b.z
}

function vec3_mul(out: Vec3, a: Vec3, b: Vec3): void {
  out.x = a.x * b.x
  out.y = a.y * b.y
  out.z = a.z * b.z
}

function vec3_print(v: Vec3): void {
  print(v.x + ', ' + v.y + ', ' + v.z)
}

function vec3_printh(v: Vec3): void {
  printh(v.x + ', ' + v.y + ', ' + v.z, 'test.log')
}

function vec3_dot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z
}

function vec3_cross(out: Vec3, a: Vec3, b: Vec3): void {
  const ax = a.x
  const ay = a.y
  const az = a.z

  const bx = b.x
  const by = b.y
  const bz = b.z

  out.x = ay * bz - az * by
  out.y = az * bx - ax * bz
  out.z = ax * by - ay * bx
}

function vec3_scale(v: Vec3, c: number): void {
  v.x *= c
  v.y *= c
  v.z *= c
}

function vec3_magnitude(v: Vec3): number {
  if (v.x > 104 || v.y > 104 || v.z > 104) {
    const m = max(max(v.x, v.y), v.z)
    const x = v.x / m,
      y = v.y / m,
      z = v.z / m
    return sqrt(x ** 2 + y ** 2 + z ** 2) * m
  }

  return sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2)
}

declare var vec3_dist: (a: Vec3, b: Vec3) => number
{
  const spare = vec3()
  vec3_dist = (a: Vec3, b: Vec3): number => {
    vec3_sub(spare, a, b)
    return vec3_magnitude(spare)
  }
}

function vec3_normalize(v: Vec3): void {
  const m = vec3_magnitude(v)
  if (m === 0) return
  v.x /= m
  v.y /= m
  v.z /= m
}

function vec3_lerp(out: Vec3, a: Vec3, b: Vec3, t: number): void {
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

let vec3_mul_mat3: (out: Vec3, v: Vec3, m: Mat3) => void
{
  const spare = vec3()
  vec3_mul_mat3 = function(out: Vec3, v: Vec3, m: Mat3): void {
    spare.x = v.x
    spare.y = v.y
    spare.z = v.z
    out.x = vec3_dot(spare, m[0])
    out.y = vec3_dot(spare, m[1])
    out.z = vec3_dot(spare, m[2])
  }
}

function assert_vec3_equal(a: Vec3, b: Vec3): void {
  assert(a.x === b.x)
  assert(a.y === b.y)
  assert(a.z === b.z)
}

function vec3_zero(v: Vec3): void {
  v.x = 0
  v.y = 0
  v.z = 0
}

function vec3_assign(a: Vec3, b: Vec3): void {
  a.x = b.x
  a.y = b.y
  a.z = b.z
}

/**
 * Mat3.
 */

type Mat3 = [Vec3, Vec3, Vec3]

function mat3(): Mat3 {
  return [vec3(), vec3(), vec3()]
}

// set matrix `m` to be a counterclockwise rotation of `a` around the x-axis.
// assume right-handed coordinates.
function mat3_rotate_x(m: Mat3, a: number): void {
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

// set matrix `m` to be a counterclockwise rotation of `a`
// around the y-axis. assume right-handed coordinates.
function mat3_rotate_y(m: Mat3, a: number): void {
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

/**
 * Math utils.
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
//
// also note: y points down.
function clockwise(points: Array<Vec3>): boolean {
  let sum = 0
  for (let i = 0; i < points.length; i++) {
    const point = points[i]
    const next_point = points[(i + 1) % points.length]
    // to debug wrong clockwise values,
    // print the return value of this function
    // while rotating a polygon continuously.
    // we divide by 10 to account for overflow.
    sum += (((next_point.x - point.x) / 10) * (next_point.y + point.y)) / 10
  }
  return sum <= 0
}

/*
{
  const points = [
    {x:-50,y:50,z:0},
    {x: 50,y:50,z:0},
    {x: 50,y:-50,z:0},
    {x:-50,y:-50,z:0},
  ]

  const points2 = [
    {x:-50,y:-50,z:0},
    {x: 50,y:-50,z:0},
    {x: 50,y:50,z:0},
    {x:-50,y:50,z:0},
  ]

  assert(!clockwise(points))
  assert(clockwise(points2))
  stop()
}
*/

/*
{
  print(vec3_magnitude(vec3(1, 1, 1)))
  print(vec3_magnitude(vec3(2, 2, 2)))
  print(vec3_magnitude(vec3(3, 3, 3)))
  print(vec3_magnitude(vec3(200, 200, 200)))
  stop()
}
*/

/*
{
  const v = vec3(200, 200, 200)
  vec3_normalize(v)
  print(vec3_magnitude(v))
  stop()
}
*/

/*
{
  const a = vec3(1, 0, 0)
  const b = vec3(0, 1, 0)
  const out = vec3()
  vec3_cross(out, a, b)
  assert_vec3_equal(out, vec3(0, 0, 1))
  stop()
}
*/

/*
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
  stop()
}
*/

/*
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
*/

/*
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
*/

/**
 * Readers.
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

function read_vec3(): Vec3 {
  return vec3(read_num(), read_num(), read_num())
}

/**
 * Line.
 */

interface line {
  start_vec: Vec3
  end_vec: Vec3
  col: col
  start_screen: Vec3
  end_screen: Vec3
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

function line_draw(l: line, c: Camera): void {
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
 * Polygon.
 */

interface polygon {
  points_world: Array<Vec3>
  points_screen: Array<Vec3>
  col: col
  cam: Camera
}

function polygon(col: col, cam: Camera, points: Array<Vec3>): polygon {
  const points_screen: Array<Vec3> = []
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
  v1: Vec3,
  v2: Vec3,
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

  // For each scanline in range, compute left or right side.
  // We must use floored y, since we are computing sides for
  // integer y-offsets.
  const ys = max(fy1, 0)
  const ye = min(fy2, 127)
  const m = (x2 - x1) / (fy2 - fy1)
  for (let y = ys; y <= ye; y++) {
    t[y] = m * (y - fy1) + x1
  }

  return [ys, ye]
}

// Note: polygon must be convex. Concave polygons draw artifacts.
function polygon_draw(p: polygon): void {
  const points = p.points_screen
  const xl: NumberMap = {},
    xr: NumberMap = {}
  let ymin = 32767,
    ymax = -32768
  const is_clockwise = clockwise(points)

  for (let i = 0; i < points.length; i++) {
    const point = points[i]
    const next_point = points[(i + 1) % points.length]
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

/**
 * Camera.
 */

interface Camera extends Actor {
  pos: Vec3
  x_angle: number
  mx: Mat3
  y_angle: number
  my: Mat3
  dist: number
  fov: number
}

function cam(): Camera {
  return {
    pos: vec3(),
    x_angle: 0,
    mx: mat3(),
    y_angle: 0,
    my: mat3(),
    dist: 7 * 10,
    fov: 150,
    update: cam_update,
    draw: cam_draw,
  }
}

function cam_update(c: Camera): void {}

function cam_draw(c: Camera): void {}

function cam_project(c: Camera, out: Vec3, v: Vec3): void {
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
 * Game.
 */

interface Game extends Actor {
  court: Court
  ball: Ball
  post_rally_timer: number
  player_score: number
  opponent_score: number
  state: state
  next_state: state
  server?: Player
}

function game(c: Court, b: Ball): Game {
  return {
    update: game_update,
    draw: game_draw,
    court: c,
    ball: b,
    post_rally_timer: 0,
    player_score: 0,
    opponent_score: 0,
    state: state.serve,
    next_state: state.serve,
  }
}

/**
 * TODO: Handle state transitions in `game_update`.
 */

function game_update(g: Game): void {
  /*
  if (g.player_score === win_score) {
    g.next_state = state.player_one_win
    return
  }

  if (g.opponent_score === win_score) {
    g.next_state = state.player_two_win
    return
  }

  // update post rally timer
  if (g.post_rally_timer > 0) {
    g.post_rally_timer -= 1
    if (g.post_rally_timer === 0) {
      next_game_state = state.serve
    }
  }

  // set timer
  if (
    current_game_state === state.playing &&
    next_game_state === state.post_rally
  ) {
    g.post_rally_timer = 3 * 60
  }

  if (
    // about to transition to post rally state
    current_game_state === state.playing &&
    next_game_state === state.post_rally
  ) {
    // TODO: check if ball is in valid hit region.
    if (
      g.ball.pos.x > -3.05 * 6 &&
      g.ball.pos.x < 3.05 * 6 &&
      g.ball.pos.z < 0 * 6 &&
      g.ball.pos.z > -6.7 * 6
    ) {
      // then we're in a valid hit region.
      // add to player score
      g.player_score += 1
    } else {
      g.opponent_score += 1
    }
  }
  */
}

function game_draw(g: Game): void {
  /**
   * Draw score.
   */

  const str = g.player_score + ' - ' + g.opponent_score
  print(str, 64 - str.length * 2, 3, col.white)
}

/**
 * Z-sorting.
 */

type OrderArray = Array<[Vec3, Actor]>

function insert_into(order: OrderArray, pos: Vec3, a: Actor): void {
  for (let i = 0; i < order.length; i++) {
    const current = order[i]
    if (pos.z < current[0].z) {
      // Move everything 1 over.
      for (let j = order.length - 1; j >= i; j--) {
        order[j + 1] = order[j]
      }

      // Insert.
      order[i] = [pos, a]
      return
    }
  }

  add(order, [pos, a])
}

/**
 * Player.
 */

interface Player extends Actor {
  // Dependencies.
  cam: Camera
  ball: Ball // Deprecated.
  game: Game

  // Position.
  pos: Vec3
  screen_pos: Vec3

  // Velocity.
  vel: Vec3
  vel60: Vec3

  // Acceleration.
  acc: Vec3
  desired_speed: number

  // TODO.
  spare: Vec3
  up: Vec3
  player_to_ball: Vec3
  swing_time: number
  input_method: (p: Player) => void
  upper_left_bound: Vec3
  lower_right_bound: Vec3
  player_dir: -1 | 1
  swing_condition: (p: Player) => boolean
}

function player(
  c: Camera,
  b: Ball,
  x: number,
  y: number,
  z: number,
  input_method: (p: Player) => void,
  upper_left_bound: Vec3,
  lower_right_bound: Vec3,
  player_dir: -1 | 1,
  swing_condition: (p: Player) => boolean,
  game: Game,
  is_initial_server: boolean
): Player {
  const p = {
    pos: vec3(x, y, z),
    vel: vec3(),
    vel60: vec3(),
    acc: vec3(),
    desired_speed: 10 * meter,
    screen_pos: vec3(),
    cam: c,
    ball: b,
    spare: vec3(),
    up: vec3(0, 1, 0),
    player_to_ball: vec3(),
    swing_time: 0,
    input_method: input_method,
    upper_left_bound: upper_left_bound,
    lower_right_bound: lower_right_bound,
    player_dir: player_dir,
    swing_condition: swing_condition,
    game: game,
    update: player_update,
    draw: player_draw,
  }

  if (is_initial_server) {
    game.server = p
  }

  return p
}

function player_keyboard_input(p: Player): void {
  if (btn(button.left)) p.acc.x -= p.desired_speed
  if (btn(button.right)) p.acc.x += p.desired_speed
  if (btn(button.up)) p.acc.z -= p.desired_speed
  if (btn(button.down)) p.acc.z += p.desired_speed
}

function player_ai(p: Player): void {
  /**
   * Move in direction of ball.
   */

  vec3_zero(p.acc)
  vec3_sub(p.acc, p.ball.pos, p.pos)
  p.acc.y = 0

  /**
   * Compute `player_to_ball` vector.
   */

  vec3_sub(p.player_to_ball, p.ball.pos, p.pos)
  p.player_to_ball.y += 1 * meter

  /**
   * If ball is in range, swing.
   */

  const in_range = vec3_magnitude(p.player_to_ball) < 2.5 * meter
  if (in_range) {
    printh('opponent swing', 'test.log')
    player_swing(p)
  }
}

function player_swing(p: Player): void {
  /**
   * Enter a swing state.
   */

  p.swing_time = 1 * second

  /**
   * Right-side lob.
   *
   * Condition: ball is below 1m.
   * Condition: ball is on right side.
   * Condition: ball is in front of player.
   */

  if (
    p.ball.pos.y < 1 * meter &&
    p.player_to_ball.x > 0 &&
    p.player_to_ball.z <= 1
  ) {
    // Slap `up` vector into `player_to_ball` vector.
    vec3_cross(p.spare, p.up, p.player_to_ball)

    // Add some forward velocity.
    p.spare.z += 6 * meter * p.player_dir

    // Add some upward velocity.
    // The lower the ball, the greater the upward velocity.
    p.spare.y += 50 + (1 * meter - p.ball.pos.y) * 5

    // Add velocity to ball velocity.
    vec3_add(p.ball.vel, p.ball.vel, p.spare)
  }

  // TODO: handle left side lob
  if (
    p.ball.pos.y < 1 * meter &&
    p.player_to_ball.x < 0 * meter &&
    p.player_to_ball.z <= 1
  ) {
    //printh('left side lob', 'test.log')
    // execute right side lob:
    // slap up vector into player_to_ball vector
    vec3_cross(p.spare, p.player_to_ball, p.up)
    // depending on ball's dist from 1m, add to vertical velocity
    p.spare.z += 6 * meter * p.player_dir
    p.spare.y += (1 * meter - p.ball.pos.y) * 5 + 50
    // add velocity to ball velocity
    vec3_add(p.ball.vel, p.ball.vel, p.spare)
    //vec3_printh(p.spare)
  }

  // TODO: handle left overhead hit
  if (
    p.ball.pos.y >= 1 * meter &&
    p.player_to_ball.z <= 1 &&
    p.player_to_ball.x < 0 * meter
  ) {
    //printh('left overhead hit', 'test.log')
    vec3_cross(p.spare, p.player_to_ball, p.up)
    p.spare.z += 50 * 3 * p.player_dir
    p.spare.y += 10
    //p.spare.y -= 10
    vec3_add(p.ball.vel, p.ball.vel, p.spare)
  }

  // TODO: handle right overhead hit
  if (
    p.ball.pos.y >= 1 * meter &&
    p.player_to_ball.z <= 1 &&
    p.player_to_ball.x > 0 * meter
  ) {
    //printh('right overhead hit', 'test.log')
    vec3_cross(p.spare, p.up, p.player_to_ball)
    p.spare.z += 50 * 3 * p.player_dir
    p.spare.y += 10
    vec3_add(p.ball.vel, p.ball.vel, p.spare)
  }
}

function player_move(p: Player): void {
  /**
   * Compute acceleration.
   *
   * Acceleration here is like "desired velocity".
   */

  vec3_zero(p.acc)
  p.input_method(p)

  /**
   * Normalize & scale acceleration.
   */

  vec3_normalize(p.acc)
  vec3_scale(p.acc, p.desired_speed)

  /**
   * Update velocity.
   */

  const t = 0.5
  vec3_lerp(p.vel, p.vel, p.acc, t)

  /**
   * Update position.
   */

  vec3_assign(p.vel60, p.vel)
  vec3_scale(p.vel60, 1 / 60)
  vec3_add(p.pos, p.pos, p.vel60)

  /**
   * Bounds checking.
   */

  if (p.pos.x < p.upper_left_bound.x) p.pos.x = p.upper_left_bound.x
  if (p.pos.x > p.lower_right_bound.x) p.pos.x = p.lower_right_bound.x

  if (p.pos.z < p.upper_left_bound.z) p.pos.z = p.upper_left_bound.z
  if (p.pos.z > p.lower_right_bound.z) p.pos.z = p.lower_right_bound.z

  /**
   * Update screen position.
   */

  cam_project(p.cam, p.screen_pos, p.pos)
}

function player_update(p: Player): void {
  /**
   * Player is serving.
   */

  if (p.game.state === state.serve && p.game.server === p) {
    // Move player within serve bounds.

    // TODO.
    // player_move(p)
    return
  }

  /**
   * Someone else is serving.
   */

  if (p.game.state === state.serve && p.game.server !== p) {
    return
  }

  /**
   * Rally.
   */

  if (p.game.state === state.rally) {
    return
  }

  /**
   * Post-rally.
   */

  if (p.game.state === state.post_rally) {
    return
  }

  return

  /**
   * TODO: handle ball serve
   */

  /*
  p.ball.is_kinematic = current_game_state === state.serve
  if (current_game_state === state.serve && server === p) {
    p.ball.pos.x = p.pos.x + 0.4 * meter
    p.ball.pos.y = p.pos.y + 1.0 * meter
    p.ball.pos.z = p.pos.z

    if (btn(button.z)) {
      // release ball
      p.ball.is_kinematic = false

      // give ball upward velocity
      p.ball.vel.x = 0
      p.ball.vel.y = 5 * meter
      p.ball.vel.z = 0

      // change state to playing
      next_game_state = state.playing

      // set swing time
      p.swing_time = 1 * 60
    }

    return
  }
  */

  /**
   * Update swing state.
   */

  p.swing_time = max(p.swing_time - 1, 0)

  /**
   * Swing at ball if condition is met.
   */

  if (p.swing_condition(p)) {
    player_swing(p)
  }
}

function player_draw(p: Player): void {
  const width = 10
  const height = 25

  // Draw shadow.
  circfill(round(p.screen_pos.x), round(p.screen_pos.y), 3, col.dark_blue)

  // Draw player.
  rectfill(
    round(p.screen_pos.x - width / 2),
    round(p.screen_pos.y - height),
    round(p.screen_pos.x + width / 2),
    round(p.screen_pos.y),
    col.orange
  )
}

/**
 * Ball.
 */

interface Ball extends Actor {
  pos: Vec3
  shadow_pos: Vec3
  vel: Vec3
  vel60: Vec3
  acc: Vec3
  acc60: Vec3
  screen_pos: Vec3
  screen_shadow_pos: Vec3
  cam: Camera
  is_kinematic: boolean
  net: Net
  intersects: boolean
}

function ball(c: Camera, n: Net): Ball {
  const meter = 6

  return {
    pos: vec3(0, 3 * meter, 5 * meter),
    shadow_pos: vec3(),
    vel: vec3(0, 1 * meter, 0),
    vel60: vec3(),
    acc: vec3(0, -10 * meter, 0),
    acc60: vec3(),
    screen_pos: vec3(),
    screen_shadow_pos: vec3(),
    cam: c,
    is_kinematic: false,
    net: n,
    intersects: false,
    update: ball_update,
    draw: ball_draw,
  }
}

declare var ball_update: (b: Ball) => void
{
  const spare = vec3()
  const next_pos = vec3()
  ball_update = (b: Ball): void => {
    if (!b.is_kinematic && b.pos.y > 0) {
      // compute change in velocity for this frame.
      vec3_assign(spare, b.acc)
      vec3_scale(spare, 1 / 60)

      // apply change in velocity.
      vec3_add(b.vel, b.vel, spare)

      // compute change in position for this frame.
      vec3_assign(spare, b.vel)
      vec3_scale(spare, 1 / 60)

      // TODO
      // check if there is an intersection
      vec3_zero(next_pos)
      vec3_add(next_pos, b.pos, spare)
      const [intersects, intersection] = net_collides_with(
        b.net,
        b.pos,
        next_pos
      )
      b.intersects = intersects
      if (intersects && intersection) {
        // if in front of net
        b.pos.x = intersection.x
        b.pos.y = intersection.y
        if (b.pos.z > 0) {
          // set position to slightly in front of net
          b.pos.z = 1
        } else if (b.pos.z < 0) {
          // set position to slightly behind net
          b.pos.z = -1
        } else {
          assert(false)
        }
        // reverse z-component of velocity
        b.vel.z = -b.vel.z
        vec3_scale(b.vel, 0.1)
      } else {
        vec3_assign(spare, b.vel)
        vec3_scale(spare, 1 / 60)

        // apply change in position.
        vec3_add(b.pos, b.pos, spare)
      }
    }

    // bounds check.
    if (b.pos.y < 0) {
      b.pos.y = 0
    }

    // compute new screen position.
    cam_project(b.cam, b.screen_pos, b.pos)

    // compute new screen position for shadow
    vec3_assign(b.shadow_pos, b.pos)
    b.shadow_pos.y = 0
    cam_project(b.cam, b.screen_shadow_pos, b.shadow_pos)
  }
}

function ball_draw(b: Ball): void {
  // draw ball shadow
  circfill(
    round(b.screen_shadow_pos.x),
    round(b.screen_shadow_pos.y),
    1,
    col.dark_blue
  )

  // draw ball
  circfill(round(b.screen_pos.x), round(b.screen_pos.y), 1, col.yellow)
}

/**
 * Net.
 */

interface Net extends Actor {
  lines: Array<line>
  net_top: number
  net_bottom: number
  left_pole: number
  right_pole: number
  cam: Camera
}

function net(lines: Array<line>, cam: Camera): Net {
  return {
    lines: lines,
    net_top: 1.5 * meter,
    net_bottom: 0.9 * meter,
    left_pole: -2.95 * meter,
    right_pole: 2.95 * meter,
    cam: cam,
    update: net_update,
    draw: net_draw,
  }
}

function net_update(n: Net): void {}

function net_draw(n: Net): void {
  for (let i = 0; i < n.lines.length; i++) {
    const l = n.lines[i]
    line_draw(l, n.cam)
  }
}

/** !TupleReturn */
function net_collides_with(
  n: Net,
  prev_pos: Vec3,
  next_pos: Vec3
): [true, Vec3] | [false, null] {
  if (
    !((prev_pos.z > 0 && next_pos.z < 0) || (prev_pos.z < 0 && next_pos.z > 0))
  ) {
    return [false, null]
  }

  // z = mx + z0, set z to 0 and solve for x
  const z0 = prev_pos.z
  let x_at_net: number
  if (next_pos.x - prev_pos.x < 0.1) {
    x_at_net = prev_pos.x
  } else {
    const m = (next_pos.z - prev_pos.z) / (next_pos.x - prev_pos.x)
    const diff = -z0 / m
    x_at_net = prev_pos.x + diff
  }
  const x_in_range = n.left_pole <= x_at_net && x_at_net <= n.right_pole
  if (!x_in_range) {
    return [false, null]
  }

  // z = m2*y + z0, set z to 0 and solve for y
  const m2 = (next_pos.z - prev_pos.z) / (next_pos.y - prev_pos.y)
  const y = -z0 / m2
  const y_at_net = prev_pos.y + y
  const y_in_range = n.net_bottom <= y_at_net && y_at_net < n.net_top
  if (!y_in_range) {
    return [false, null]
  }

  return [true, vec3(x_at_net, y_at_net, 0)]
}

/*
var [collides, intersection] = net_collides_with(
  n,
  vec3(0, 1.6 * meter_unit, -1 * meter_unit),
  vec3(0, 1.6 * meter_unit, -2 * meter_unit)
)
assert(!collides, 'does not collide')
var [collides, intersection] = net_collides_with(
  n,
  vec3(-5 * meter_unit, 1.2 * meter_unit, -1 * meter_unit),
  vec3(-7 * meter_unit, 1.2 * meter_unit, 1 * meter_unit)
)
assert(!collides, 'does not collide')
var [collides, intersection] = net_collides_with(
  n,
  vec3(-3 * meter_unit, 1.2 * meter_unit, -1 * meter_unit),
  vec3(3 * meter_unit, 1.2 * meter_unit, 1 * meter_unit)
)
assert(collides, 'collides')
if (intersection) vec3_print(intersection)
stop()
*/

/**
 * Win state.
 */

function win_draw(): void {
  cls()
  print('win')
}

/**
 * Lose state.
 */

function lose_draw(): void {
  cls()
  print('lose')
}

/**
 * Court.
 */

interface Court extends Actor {
  cam: Camera
  court_lines: Array<line>
  poly: polygon
}

function court(court_lines: Array<line>, cam: Camera): Court {
  const p = polygon(col.dark_green, cam, [
    vec3(-3.8 * meter, 0, -7.7 * meter),
    vec3(-3.8 * meter, 0, 7.7 * meter),
    vec3(3.8 * meter, 0, 7.7 * meter),
    vec3(3.8 * meter, 0, -7.7 * meter),
  ])

  return {
    court_lines: court_lines,
    cam: cam,
    update: court_update,
    draw: court_draw,
    poly: p,
  }
}

function court_update(c: Court): void {
  polygon_update(c.poly)
}

function court_draw(c: Court): void {
  polygon_draw(c.poly)

  for (let i = 0; i < c.court_lines.length; i++) {
    const l = c.court_lines[i]
    line_draw(l, c.cam)
  }
}

pico-8 cartridge // http://www.pico-8.com
version 16
__lua__
export("game.html")
function _draw()
    cls(col.indigo)
end
col={}
col.black=0
col.dark_blue=1
col.dark_purple=2
col.dark_green=3
col.brown=4
col.dark_gray=5
col.light_gray=6
col.white=7
col.red=8
col.orange=9
col.yellow=10
col.green=11
col.blue=12
col.indigo=13
col.pink=14
col.peach=15
function round(n)
    return flr(n+0.5)
end
function lerp(a,b,t)
    return ((1-t)*a)+(t*b)
end
function vec3(x,y,z)
    return {x = x or 0,y = y or 0,z = z or 0}
end
function vec3_sub(out,a,b)
    out.x = (a.x-b.x)
    out.y = (a.y-b.y)
    out.z = (a.z-b.z)
end
function vec3_print(v)
    print(v.x .. ", " .. v.y .. ", " .. v.z)
end
function vec3_dot(a,b)
    return ((a.x*b.x)+(a.y*b.y))+(a.z*b.z)
end
function vec3_scale(v,c)
    v.x = (v.x*c)
    v.y = (v.y*c)
    v.z = (v.z*c)
end
function vec3_magnitude(v)
    if ((v.x>104) or (v.y>104)) or (v.z>104) then
        local m = max(max(v.x,v.y),v.z)

        local x = v.x/m
local y = v.y/m
local z = v.z/m

        return sqrt(((x^2)+(y^2))+(z^2))*m
    end
    return sqrt(((v.x^2)+(v.y^2))+(v.z^2))
end
do
print(vec3_magnitude(vec3(1,1,1)))
print(vec3_magnitude(vec3(2,2,2)))
print(vec3_magnitude(vec3(3,3,3)))
print(vec3_magnitude(vec3(200,200,200)))
end
function vec3_normalize(v)
    local m = vec3_magnitude(v)

    if m==0 then
        return
    end
    v.x = (v.x/m)
    v.y = (v.y/m)
    v.z = (v.z/m)
end
do
local v = vec3(200,200,200)

vec3_normalize(v)
print(vec3_magnitude(v))
stop()
end
function vec3_lerp(out,a,b,t)
    local ax = a.x
local ay = a.y
local az = a.z

    local bx = b.x
local by = b.y
local bz = b.z

    out.x = lerp(ax,bx,t)
    out.y = lerp(ay,by,t)
    out.z = lerp(az,bz,t)
end
local vec3_mul_mat3 = nil

do
local spare = vec3()

vec3_mul_mat3 = function(out,v,m)
    spare.x = v.x
    spare.y = v.y
    spare.z = v.z
    out.x = vec3_dot(spare,m[0+1])
    out.y = vec3_dot(spare,m[1+1])
    out.z = vec3_dot(spare,m[2+1])
end

end

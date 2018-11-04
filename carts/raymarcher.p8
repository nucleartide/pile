pico-8 cartridge // http://www.pico-8.com
version 16
__lua__
-- a hat for a typescript witch
-- by @nucleartide
cls(2)
::_::
h=5/sqrt(26)
r=1/sqrt(26)
x,y,z=0,0.5,-1.5
i,j=rnd(128),rnd(128)
u=i/128-.5
v=-(j/128-.5)
v=-(j/128)
w=sqrt(1-u*u-v*v)
for k=1,20 do
  if z>4 or y<-1 then break end

  -- sphere
  s=sqrt(x*x+y*y+z*z)-1

  -- torus
  q=sqrt(x*x+z*z)-1
  s=sqrt(q*q+y*y)-0.5

  -- cone
  q=sqrt(x*x+z*z)
  s=h*q+r*y

  if abs(s) < 0.08 then
    pset(i,j,7)
    break
  end
  x+=u*s
  y+=v*s
  z+=w*s
end
goto _

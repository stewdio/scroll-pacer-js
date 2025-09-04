

# ScrollPacer


Scrolling you from A to B since 2025.



<!--
3 different sizes, 
x 16 different methods.



SIZES (3):

1. element.height  <  viewport.height
2. element.height === viewport.height
3. element.height  >  viewport.height


THRESHOLDS (4):

   VE = Viewport, Element
1. 00 = V bottom, E bottom
2. 01 = V bottom, E top
3. 10 = V top, E bottom
4. 11 = V top, E top


METHODS (16):

AB,XY
if AB==XY then duration is 0 and we can skip all updates.
if duration > 0, all good.
if duration < 0 ... we need to recalculate!


 1. 00,00  duration === 0
 2. 00,01  INVERSION!! is backward!!! (but animation happens within viewport if rendered backward)
 3. 00,10  a normal method
 4. 00,11 “CONTAIN MIN” +++++++ e.height < v.height, is ok. if e==v, duration 0! if e>h INVERSION!!!!

 5. 01,00  a normal method.
 6. 01,01  duration === 0
 7. 01,10  a normal method. longest one! “COVER” (animation occurs when any bit of the element is visible at all.)
 8. 01,11  a normal method. 

 9. 10,00  INVERSION!! 
10. 10,01  INVERSION!!
11. 10,10  duration === 0
12. 10,11  INVERSION!!

13. 11,00 “CONTAIN MAX” +++++++ if e.height > v.height, is ok. if e==v duration 0! if e<h INVERSION!!
14. 11,01  INVERSION!!
15. 11,10  a normal method.
16. 11,11  duration === 0




1. if AB === XY, duration === 0 so skip calculating anything.

2. To handle any inversion: swap AB with XY.

3. For 00,11 and 11,00 need to know e.height vs v.height.
		depending on method, might need to invert (swap AB with XY)

-->
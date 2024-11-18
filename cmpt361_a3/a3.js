import { Framebuffer } from './framebuffer.js';
import { Rasterizer } from './rasterizer.js';
// DO NOT CHANGE ANYTHING ABOVE HERE

////////////////////////////////////////////////////////////////////////////////
// TODO: Implement functions drawLine(v1, v2) and drawTriangle(v1, v2, v3) below.
////////////////////////////////////////////////////////////////////////////////

// take two vertices defining line and rasterize to framebuffer
Rasterizer.prototype.drawLine = function(v1, v2) { // drawLine func for step 1, line rasterization. DDA algo
  const [x1, y1, [r1, g1, b1]] = v1;
  const [x2, y2, [r2, g2, b2]] = v2;

  // m = delta y / delta x
  const m = (y2 - y1) / (x2 - x1);

  // if 0 <= m <= 1
  if (Math.abs(m) <= 1) {
    let start_x, end_x, y, start_r, start_g, start_b, end_r, end_g, end_b;
    
    if (x1 < x2) {
      start_x = x1;
      end_x = x2;
      y = y1;
      [start_r, start_g, start_b] = [r1, g1, b1];
      [end_r, end_g, end_b] = [r2, g2, b2];
    } else {
      start_x = x2;
      end_x = x1;
      y = y2;
      [start_r, start_g, start_b] = [r2, g2, b2];
      [end_r, end_g, end_b] = [r1, g1, b1];
    }

    for (let x = start_x; x <= end_x; ++x) {
      // step 2, colour interpolation
      const distance = (x - start_x) / (end_x - start_x);
      const r = start_r + (end_r - start_r) * distance;
      const g = start_g + (end_g - start_g) * distance;
      const b = start_b + (end_b - start_b) * distance;
      
      this.setPixel(x, Math.round(y), [r, g, b]);
      y += m;
    }
  } else { // if m is not between 0 and 1
    let start_x, end_x, start_y, end_y, start_r, start_g, start_b, end_r, end_g, end_b;
    
    if (y1 < y2) {
      start_x = x1;
      end_x = x2;
      start_y = y1;
      end_y = y2;
      [start_r, start_g, start_b] = [r1, g1, b1];
      [end_r, end_g, end_b] = [r2, g2, b2];
    } else {
      start_x = x2;
      end_x = x1;
      start_y = y2;
      end_y = y1;
      [start_r, start_g, start_b] = [r2, g2, b2];
      [end_r, end_g, end_b] = [r1, g1, b1];
    }
  
    const m_inverse = (end_x - start_x) / (end_y - start_y); // slope inverse
    let x = start_x;
    
    for (let y = start_y; y <= end_y; y++) {
      const distance = (y - start_y) / (end_y - start_y);
      const r = start_r + (end_r - start_r) * distance;
      const g = start_g + (end_g - start_g) * distance;
      const b = start_b + (end_b - start_b) * distance;
  
      this.setPixel(Math.round(x), y, [r, g, b]);
      x += m_inverse;
    }
  }
  
  console.log("graphics is very cool :D" + m);
}

  // TODO/HINT: use this.setPixel(x, y, color) in this function to draw line
  //this.setPixel(Math.floor(x1), Math.floor(y1), [r1, g1, b1]);
  //this.setPixel(Math.floor(x2), Math.floor(y2), [r2, g2, b2]);


// take 3 vertices defining a solid triangle and rasterize to framebuffer
Rasterizer.prototype.drawTriangle = function(v1, v2, v3) {
  const [x1, y1, [r1, g1, b1]] = v1;
  const [x2, y2, [r2, g2, b2]] = v2;
  const [x3, y3, [r3, g3, b3]] = v3;
  // TODO/HINT: use this.setPixel(x, y, color) in this function to draw triangle
  this.setPixel(Math.floor(x1), Math.floor(y1), [r1, g1, b1]);
  this.setPixel(Math.floor(x2), Math.floor(y2), [r2, g2, b2]);
  this.setPixel(Math.floor(x3), Math.floor(y3), [r3, g3, b3]);
}


////////////////////////////////////////////////////////////////////////////////
// EXTRA CREDIT: change DEF_INPUT to create something interesting!
////////////////////////////////////////////////////////////////////////////////
const DEF_INPUT = [
  "v,10,10,1.0,0.0,0.0;",
  "v,52,52,0.0,1.0,0.0;",
  "v,52,10,0.0,0.0,1.0;",
  "v,10,52,1.0,1.0,1.0;",
  "t,0,1,2;",
  "t,0,3,1;",
  "v,10,10,1.0,1.0,1.0;",
  "v,10,52,0.0,0.0,0.0;",
  "v,52,52,1.0,1.0,1.0;",
  "v,52,10,0.0,0.0,0.0;",
  "l,4,5;",
  "l,5,6;",
  "l,6,7;",
  "l,7,4;"
].join("\n");


// DO NOT CHANGE ANYTHING BELOW HERE
export { Rasterizer, Framebuffer, DEF_INPUT };

import { Mat4 } from './math.js';
import { Parser } from './parser.js';
import { Scene } from './scene.js';
import { Renderer } from './renderer.js';
import { TriangleMesh } from './trianglemesh.js';
// DO NOT CHANGE ANYTHING ABOVE HERE

////////////////////////////////////////////////////////////////////////////////
// TODO: Implement createCube, createSphere, computeTransformation, and shaders
////////////////////////////////////////////////////////////////////////////////





// Example two triangle quad
const quad = {
  positions: [-1, -1, -1, 1, -1, -1, 1, 1, -1, -1, -1, -1, 1,  1, -1, -1,  1, -1],
  normals: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
  uvCoords: [0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]
}

TriangleMesh.prototype.createCube = function() {
    // TODO: populate unit cube vertex positions, normals, and uv coordinates
    // this.positions = quad.positions;
    // this.normals = quad.normals;
    // this.uvCoords = quad.uvCoords;
  
  const positions = []; 
  const normals = [];
  const uvCoords = [];

    // top
    positions.push(
      1,  1, -1,  -1,  1, -1,  -1,  1,  1,
      1,  1, -1,  -1,  1,  1,   1,  1,  1
    );
    
    // bottom
    positions.push(
      -1, -1,  1,   1, -1,  1,   1, -1, -1,
      -1, -1,  1,   1, -1, -1,  -1, -1, -1
    );
  


  // right
  positions.push(
    1, -1, -1,   1, -1,  1,   1,  1,  1,
    1, -1, -1,   1,  1,  1,   1,  1, -1
 );
  
  // left
positions.push(
  -1,  1,  1,  -1,  1, -1,  -1, -1, -1,
  -1,  1,  1,  -1, -1, -1,  -1, -1,  1
);


    // front face
    positions.push(
      1,  1,  1,  -1,  1,  1,  -1, -1,  1,
      1,  1,  1,  -1, -1,  1,   1, -1,  1
   );
    
    // back
    positions.push(
      -1, -1, -1,   1, -1, -1,   1,  1, -1,
      -1, -1, -1,   1,  1, -1,  -1,  1, -1
    );
  
    // normals
  // top face 
  normals.push(0, 1, 0, 0, 1, 0, 0, 1, 0,
               0, 1, 0, 0, 1, 0, 0, 1, 0);

  // bottom face  
  normals.push(0, -1, 0, 0, -1, 0, 0, -1, 0,
               0, -1, 0, 0, -1, 0, 0, -1, 0);

  // right 
  normals.push(1, 0, 0, 1, 0, 0, 1, 0, 0,
               1, 0, 0, 1, 0, 0, 1, 0, 0);

  // left 
  normals.push(-1, 0, 0, -1, 0, 0, -1, 0, 0,
               -1, 0, 0, -1, 0, 0, -1, 0, 0);

  // front 
  normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1,
               0, 0, 1, 0, 0, 1, 0, 0, 1);

  // back 
  normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1,
               0, 0, -1, 0, 0, -1, 0, 0, -1);
  
  // uv coords
  // top
  uvCoords.push(
    1/2, 1/3, 0, 1/3, 0, 0,     
    1/2, 1/3, 0, 0, 1/2, 0      
  );

  // bottom
  uvCoords.push(
    1/2, 1, 1, 1, 1, 2/3,       
    1/2, 1, 1, 2/3, 1/2, 2/3    
  );

  // right
  uvCoords.push(
    1/2, 1/3, 0, 1/3, 0, 2/3,   
    1/2, 1/3, 0, 2/3, 1/2, 2/3  
  );

  // left
  uvCoords.push(
    1, 2/3, 1/2, 2/3, 1/2, 1/3, 
    1, 2/3, 1/2, 1/3, 1, 1/3    
  );

  // front
  uvCoords.push(
    1/2, 1, 0, 1, 0, 2/3,       
    1/2, 1, 0, 2/3, 1/2, 2/3    
  );

  // back
  uvCoords.push(
    1, 1/3, 1/2, 1/3, 1/2, 0,  
    1, 1/3, 1/2, 0, 1, 0       
  );
  
  this.positions = positions;
  this.normals = normals;
  this.uvCoords = uvCoords;
}



TriangleMesh.prototype.createSphere = function(numStacks, numSectors) {
    // TODO: populate unit sphere vertex positions, normals, uv coordinates, and indices
    // this.positions = quad.positions.slice(0, 9).map(p => p * 0.5);
    // this.normals = quad.normals.slice(0, 9);
    // this.uvCoords = quad.uvCoords.slice(0, 6);
    // this.indices = [0, 1, 2];
  
  
  
    const positions = [];
  const normals = [];
  const uvCoords = [];
  const indices = [];
  
  const sectorStep = 2 * Math.PI / numSectors;
  const stackStep = Math.PI / numStacks;

  
  for (let i = 0; i <= numStacks; i++) {

    const stackAngle = Math.PI / 2 - i * stackStep;
    const xy = Math.cos(stackAngle);

    const z = Math.sin(stackAngle);
    
    for (let j = 0; j <= numSectors; j++) {
      const sectorAngle = j * sectorStep;
      
      const x = xy * Math.cos(sectorAngle);
      const y = xy * Math.sin(sectorAngle);




      positions.push(x, y, z);
      normals.push(x, y, z);
      

      let u = 1 - (j / numSectors);
      let v = i / numStacks;
      uvCoords.push(u, v);
    }
  }

  for (let i = 0; i < numStacks; i++) {
    let k1 = i * (numSectors + 1);
    let k2 = k1 + numSectors + 1;
    
    for (let j = 0; j < numSectors; j++, k1++, k2++) {
      if (i == 0 || i == (numStacks - 1)) {
        indices.push(k1, k2, k1 + 1);
      }
      if (i != (numStacks - 1)) {
        indices.push(k1 + 1, k2, k2 + 1);
        indices.push(k1, k2, k1 + 1);
      }
    }
  }

  this.positions = positions;
  this.normals = normals;
  this.uvCoords = uvCoords;
  this.indices = indices;
}



function calculateTransfMat(transform) {
  const mat = Mat4.create();
  const [type, ...param] = transform;
  
  switch (type) {
    case "Rx":
    case "Ry":
    case "Rz": {
      const angle = param[0] * (Math.PI/180);
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      
      switch (type) {
        case "Rx":
          /* since webgl uses column major order, matrices look kinda weird
          putting this here for reference:

           1 0 0 0
           0 cos(theta) -sin(theta) 0
           0 sin(theta) cos(theta) 0
           0 0 0 1
          */
      
          return Mat4.set(mat,
            1, 0,  0, 0,
            0, c,  s, 0,
            0, -s, c, 0,
            0, 0,  0, 1);
        case "Ry":
          /* matrix in slides:
           cos(theta) 0 sin(theta) 0
           0 1 0 0
           -sin(theta) 0 cos(theta) 0
           0 0 0 1
          */
          return Mat4.set(mat,
            c,  0, -s, 0,
            0,  1,  0, 0,
            s,  0,  c, 0,
            0,  0,  0, 1);
        case "Rz":
          /* matrix in slides:
           cos(theta) -sin(theta) 0 0
           sin(theta) cos(theta) 0 0
           0 0 1 0
           0 0 0 1
          */
          return Mat4.set(mat,
            c,  s, 0, 0,
            -s, c, 0, 0,
            0,  0, 1, 0,
            0,  0, 0, 1);
      }
      break;
    }
    
    case "S":
      /**
       * sx 0 0 0
       * 0 sy 0 0
       * 0 0 sz 0
       * 0 0 0 1
       */
      return Mat4.set(mat,
        param[0], 0,        0,        0,
        0,        param[1], 0,        0,
        0,        0,        param[2], 0,
        0,        0,        0,         1);
    
    case "T":
      /* matrix from slides:
      1 0 0 tx
      0 1 0 ty
      0 0 1 tz
      0 0 0 1
      */
      return Mat4.set(mat,
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        param[0], param[1], param[2], 1);
        
    default:
      console.error(`Unknown transform type: ${type}`);
      return mat;
  }
}

Scene.prototype.computeTransformation = function(transformSequence) {
  let overallTransform = Mat4.create();  // identity matrix
  
  for (let i = 0; i < transformSequence.length; i++) {
    const nextTransform = calculateTransfMat(transformSequence[i]);
    overallTransform = Mat4.multiply(overallTransform, nextTransform, overallTransform);
  }
  
  return overallTransform;
}



Renderer.prototype.VERTEX_SHADER = `
precision mediump float;
attribute vec3 position, normal;
attribute vec2 uvCoord;
uniform vec3 lightPosition;
uniform mat4 projectionMatrix, viewMatrix, modelMatrix;
uniform mat3 normalMatrix;
varying vec2 vTexCoord;

varying vec3 f_Position;
varying vec3 f_Normal;
varying vec3 f_lightPosition;

void main() {
  vTexCoord = uvCoord;
  
  vec4 modelSpacePos = vec4(position, 1.0);
  vec4 viewSpacePos = viewMatrix * modelMatrix * modelSpacePos;
  gl_Position = projectionMatrix * viewSpacePos;
  
  f_Position = viewSpacePos.xyz;
  f_Normal = normalize(normalMatrix * normal);
  f_lightPosition = (viewMatrix * vec4(lightPosition, 1.0)).xyz;
}
`;

Renderer.prototype.FRAGMENT_SHADER = `
precision mediump float;
uniform vec3 ka, kd, ks, lightIntensity;
uniform float shininess;
uniform sampler2D uTexture;
uniform bool hasTexture;
varying vec2 vTexCoord;


varying vec3 f_Position;
varying vec3 f_Normal;

varying vec3 f_lightPosition;


void main() {

  vec3 lightDir = normalize(f_lightPosition - f_Position);
  float lightMag = length(f_lightPosition - f_Position);
  
  float normalDotLight = max(0.0, dot(f_Normal, lightDir));
  
  vec3 ca = ka * lightIntensity;
  
  vec3 cd = kd / (lightMag * lightMag) * 
            normalDotLight * 
            lightIntensity;
            
  vec3 lambertian = cd;



  
  vec3 reflectionDirection = reflect(-lightDir, f_Normal);
  float reflectDotView = max(0.0, dot(reflectionDirection, -normalize(f_Position)));
  
  vec3 cs = ks / (lightMag * lightMag) * 
            pow(reflectDotView, shininess) * 
            lightIntensity;

  vec4 color = vec4(lambertian + cd + ca + cs, 1.0);
  
  if (hasTexture) {
    color *= texture2D(uTexture, vTexCoord);
  }
  
  gl_FragColor = color;
}
`;

////////////////////////////////////////////////////////////////////////////////
// EXTRA CREDIT: change DEF_INPUT to create something interesting!
////////////////////////////////////////////////////////////////////////////////
const DEF_INPUT = [
  "c,myCamera,perspective,8,2,-4,0,0,0,0,1,0;",
  "m,infvoidMat,0,0,0,5,0,0,5,5,5,0,inf_void.jpg;",
  "p,bgCube,cube;",
  "o,bg,bgCube,infvoidMat;",
  "X,bg,S,10,5,5;",
  "l,myLight,point,0,5,0,2,2,2;",
  "p,unitCube,cube;",
  "p,unitSphere,sphere,20,20;",
  "m,nahMat,1,1,1,0,0.7,0,1,1,1,15,nah.jpg;",
  "m,nahMat2,1,1,1,0,0,0.7,1,1,1,15,nah.jpg;",
  "m,gojoMat,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5,gojo_nahidwin.jpg;",
  "o,bd,unitCube,nahMat;",
  "o,gl,unitSphere,gojoMat;",
  "o,gd,unitCube,nahMat2;",
  "X,rd,Rz,75;X,rd,Rx,90;X,rd,S,0.5,0.5,0.5;X,rd,T,-1,0,2;",
  "X,gd,Ry,45;X,gd,S,0.5,0.5,0.5;X,gd,T,2,0,2;",
  "X,bd,S,0.5,0.5,0.5;X,bd,Rx,90;X,bd,T,2,0,-1;",
  "X,gl,S,1.5,1.5,1.5;X,gl,Rx,90;X,gl,Ry,-150;",
  "X,gl,T,0,1.5,0;",
  "m,nahMat,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,10,nah.jpg;",
  "p,unitCube,cube;",
  "o,cube3,unitCube,nahMat;",
  "X,cube3,T,0,3,-5;",
  "X,cube3,Rx,-30;",
  "X,cube3,Ry,90;",
  "X,cube3,Rz,-15;",
  "X,cube3,S,0.8,0.8,0.8;",
  "o,cube4,unitCube,nahMat;",
  "X,cube4,T, 0,0,-2;"
].join("\n");

// "c,myCamera,perspective,5,5,5,0,0,0,0,1,0;",
// "l,myLight,point,0,5,0,2,2,2;",
// "p,unitCube,cube;",
// "p,unitSphere,sphere,20,20;",
// "m,redDiceMat,0.3,0,0,0.7,0,0,1,1,1,15,dice.jpg;",
// "m,grnDiceMat,0,0.3,0,0,0.7,0,1,1,1,15,dice.jpg;",
// "m,bluDiceMat,0,0,0.3,0,0,0.7,1,1,1,15,dice.jpg;",
// "m,globeMat,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5,globe.jpg;",
// "o,rd,unitCube,redDiceMat;",
// "o,gd,unitCube,grnDiceMat;",
// "o,bd,unitCube,bluDiceMat;",
// "o,gl,unitSphere,globeMat;",
// "X,rd,Rz,75;X,rd,Rx,90;X,rd,S,0.5,0.5,0.5;X,rd,T,-1,0,2;",
// "X,gd,Ry,45;X,gd,S,0.5,0.5,0.5;X,gd,T,2,0,2;",
// "X,bd,S,0.5,0.5,0.5;X,bd,Rx,90;X,bd,T,2,0,-1;",
// "X,gl,S,1.5,1.5,1.5;X,gl,Rx,90;X,gl,Ry,-150;X,gl,T,0,1.5,0;",

/**
 * og input formatted for webgl ui
 * for my reference
 * 
 * 
c,myCamera,perspective,5,5,5,0,0,0,0,1,0;
l,myLight,point,0,5,0,2,2,2;
p,unitCube,cube;
p,unitSphere,sphere,20,20;
m,redDiceMat,0.3,0,0,0.7,0,0,1,1,1,15,dice.jpg;
m,grnDiceMat,0,0.3,0,0,0.7,0,1,1,1,15,dice.jpg;
m,bluDiceMat,0,0,0.3,0,0,0.7,1,1,1,15,dice.jpg;
m,globeMat,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5,globe.jpg;
o,rd,unitCube,redDiceMat;
o,gd,unitCube,grnDiceMat;
o,bd,unitCube,bluDiceMat;
o,gl,unitSphere,globeMat;
X,rd,Rz,75;X,rd,Rx,90;X,rd,S,0.5,0.5,0.5;X,rd,T,-1,0,2;
X,gd,Ry,45;X,gd,S,0.5,0.5,0.5;X,gd,T,2,0,2;
X,bd,S,0.5,0.5,0.5;X,bd,Rx,90;X,bd,T,2,0,-1;
X,gl,S,1.5,1.5,1.5;X,gl,Rx,90;X,gl,Ry,-150;X,gl,T,0,1.5,0;


 */

// DO NOT CHANGE ANYTHING BELOW HERE
export { Parser, Scene, Renderer, DEF_INPUT };


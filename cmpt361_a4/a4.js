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
      -1,  1, -1,  -1,  1,  1,   1,  1,  1,  // triangle 1
      -1,  1, -1,   1,  1,  1,   1,  1, -1   // triangle 2
    );
    
    // bottom
    positions.push(
      -1, -1, -1,   1, -1, -1,   1, -1,  1,  // tri 1
      -1, -1, -1,   1, -1,  1,  -1, -1,  1   // tri 2
    );
  


  // right
  positions.push(
     1, -1, -1,   1,  1, -1,   1,  1,  1, 
     1, -1, -1,   1,  1,  1,   1, -1,  1   
  );
  
  // left
  positions.push(
    -1, -1, -1,  -1, -1,  1,  -1,  1,  1,  
    -1, -1, -1,  -1,  1,  1,  -1,  1, -1   
  );


    // front face
    positions.push(
      -1, -1,  1,   1, -1,  1,   1,  1,  1,  // triangle 1
      -1, -1,  1,   1,  1,  1,  -1,  1,  1   // triangle 2
    );
    
    // back
    positions.push(
      -1, -1, -1,  -1,  1, -1,   1,  1, -1,  // tri 1
      -1, -1, -1,   1,  1, -1,   1, -1, -1   // tri 2
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
    1/2, 1/3, 0, 1/3, 0, 0,     // triangle 1
    1/2, 1/3, 0, 0, 1/2, 0      // triangle 2
  );

  // bottom
  uvCoords.push(
    1/2, 1, 1, 1, 1, 2/3,       // triangle 1
    1/2, 1, 1, 2/3, 1/2, 2/3    // triangle 2
  );

  // right
  uvCoords.push(
    1/2, 1/3, 0, 1/3, 0, 2/3,   // triangle 1
    1/2, 1/3, 0, 2/3, 1/2, 2/3  // triangle 2
  );

  // left
  uvCoords.push(
    1, 2/3, 1/2, 2/3, 1/2, 1/3, // triangle 1
    1, 2/3, 1/2, 1/3, 1, 1/3    // triangle 2
  );

  // front
  uvCoords.push(
    1/2, 1, 0, 1, 0, 2/3,       // triangle 1
    1/2, 1, 0, 2/3, 1/2, 2/3    // triangle 2
  );

  // back
  uvCoords.push(
    1, 1/3, 1/2, 1/3, 1/2, 0,   // triangle 1
    1, 1/3, 1/2, 0, 1, 0        // triangle 2
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
      uvCoords.push(j / numSectors, i / numStacks);
    }
  }
  

  for (let i = 0; i < numStacks; i++) {
    let k1 = i * (numSectors + 1);
    let k2 = k1 + numSectors + 1;
    
    for (let j = 0; j < numSectors; j++, k1++, k2++) {
      if (i !== 0) {
        indices.push(k1, k2, k1 + 1);
      }
      if (i !== (numStacks - 1)) {
        indices.push(k1 + 1, k2, k2 + 1);
      }
    }
  }


  this.positions = positions;
  this.normals = normals;
  this.uvCoords = uvCoords;
  this.indices = indices;
}



function getTransformMatrix(singleTransform) {
  let mat = Mat4.create();  // identity matrix
  switch (singleTransform[0]) {
    case "Rx":
      {
        const c = Math.cos(singleTransform[1] * (Math.PI/180));
        const s = Math.sin(singleTransform[1] * (Math.PI/180));
        mat = Mat4.set(mat,
           1,  0,  0,  0,
           0,  c,  s,  0,
           0, -s,  c,  0,
           0,  0,  0,  1);
      }
      break;
    case "Ry":
      {
        const c = Math.cos(singleTransform[1] * (Math.PI/180));
        const s = Math.sin(singleTransform[1] * (Math.PI/180));
        mat = Mat4.set(mat,
           c,  0, -s,  0,
           0,  1,  0,  0,
           s,  0,  c,  0,
           0,  0,  0,  1);
      }
      break
    case "Rz":
      {
        const c = Math.cos(singleTransform[1] * (Math.PI/180));
        const s = Math.sin(singleTransform[1] * (Math.PI/180));
        mat = Mat4.set(mat,
           c, s,  0,  0,
           -s,  c,  0,  0,
           0,  0,  1,  0,
           0,  0,  0,  1);
      }
      break;
    case "S":
      {
        const sx = singleTransform[1];
        const sy = singleTransform[2];
        const sz = singleTransform[3];
        mat = Mat4.set(mat,
          sx, 0,  0,  0,
          0,  sy, 0,  0,
          0,  0,  sz, 0,
          0,  0,  0,  1);
      }
      break;
    case "T":
      {
        const tx = singleTransform[1];
        const ty = singleTransform[2];
        const tz = singleTransform[3];
        mat = Mat4.set(mat,
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          tx, ty, tz, 1 );
      }
      break;
    default:
      console.log("could not compute matrix for " + singleTransform);
  }
  return mat;
}

Scene.prototype.computeTransformation = function(transformSequence) {
  let overallTransform = Mat4.create();  // identity matrix
  for (let i = 0; i < transformSequence.length; i++) {
    let nextTransMat = getTransformMatrix(transformSequence[i]);
    overallTransform = Mat4.multiply(overallTransform, nextTransMat, overallTransform);
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

varying vec3 fPosition;
varying vec3 fNormal;
varying vec3 fLightPosition;

void main() {
  vTexCoord = uvCoord;
  vec4 pos = viewMatrix * modelMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * pos;
  fPosition = pos.xyz;
  fNormal = normalize(normalMatrix * normal);
  fLightPosition = (viewMatrix * vec4(lightPosition, 1.0)).xyz;
}
`;

Renderer.prototype.FRAGMENT_SHADER = `
precision mediump float;
uniform vec3 ka, kd, ks, lightIntensity;
uniform float shininess;
uniform sampler2D uTexture;
uniform bool hasTexture;
varying vec2 vTexCoord;

varying vec3 fPosition;
varying vec3 fNormal;
varying vec3 fLightPosition;

void main() {
  vec3 lightDirection = normalize(fLightPosition - fPosition);
  float lightMag = length(fLightPosition - fPosition);
  float lightMagSqrd = lightMag * lightMag;
  
  float normalDotLight = max(0.0, dot(fNormal, lightDirection));
  
  vec3 ca = ka * lightIntensity;
  
  vec3 cd = kd / lightMagSqrd * 
            normalDotLight * 
            lightIntensity;
            
  vec3 lambartianColor = cd;



  
  vec3 reflectionDirection = reflect(-lightDirection, fNormal);
  float reflectDotView = max(0.0, dot(reflectionDirection, -normalize(fPosition)));
  
  vec3 cs = ks / lightMagSqrd * 
            pow(reflectDotView, shininess) * 
            lightIntensity;

  vec4 color = vec4(lambartianColor + cd + ca + cs, 1.0);
  
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
  "c,myCamera,perspective,5,5,5,0,0,0,0,1,0;",
  "l,myLight,point,0,5,0,2,2,2;",
  "p,unitCube,cube;",
  "p,unitSphere,sphere,20,20;",
  "m,redDiceMat,0.3,0,0,0.7,0,0,1,1,1,15,dice.jpg;",
  "m,grnDiceMat,0,0.3,0,0,0.7,0,1,1,1,15,dice.jpg;",
  "m,bluDiceMat,0,0,0.3,0,0,0.7,1,1,1,15,dice.jpg;",
  "m,globeMat,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5,globe.jpg;",
  "o,rd,unitCube,redDiceMat;",
  "o,gd,unitCube,grnDiceMat;",
  "o,bd,unitCube,bluDiceMat;",
  "o,gl,unitSphere,globeMat;",
  "X,rd,Rz,75;X,rd,Rx,90;X,rd,S,0.5,0.5,0.5;X,rd,T,-1,0,2;",
  "X,gd,Ry,45;X,gd,S,0.5,0.5,0.5;X,gd,T,2,0,2;",
  "X,bd,S,0.5,0.5,0.5;X,bd,Rx,90;X,bd,T,2,0,-1;",
  "X,gl,S,1.5,1.5,1.5;X,gl,Rx,90;X,gl,Ry,-150;X,gl,T,0,1.5,0;",
].join("\n");

// DO NOT CHANGE ANYTHING BELOW HERE
export { Parser, Scene, Renderer, DEF_INPUT };


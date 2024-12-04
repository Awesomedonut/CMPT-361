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
  
  // normals for each face
  for (let i = 0; i < 6; i++) {
    const normal = [
      [0, 1, 0],    // top
      [0, -1, 0],   // bottom
      [1, 0, 0],    // right
      [-1, 0, 0],   // left
      [0, 0, 1],    // front
      [0, 0, -1]    // back
    ][i];
    
    for (let j = 0; j < 6; j++) { // 6 vertices per face
      normals.push(...normal);
    }
  }
  
  // uv coords
  for (let i = 0; i < 6; i++) {
    uvCoords.push(
      0, 0,  1, 0,  1, 1,  // triangle 1
      0, 0,  1, 1,  0, 1   // triangle 2
    );
  }
  
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

Scene.prototype.computeTransformation = function(transformSequence) {
   // TODO: go through transform sequence and compose into overallTransform
  let overallTransform = Mat4.create();  // identity matrix
  
  for (const transform of transformSequence) {
    switch (transform.type) {
      case 'T': // transform
        overallTransform = Mat4.multiply(
          Mat4.translate(transform.x, transform.y, transform.z),
          overallTransform
        );
        break;
        
      case 'Rx': // rotation around X
        overallTransform = Mat4.multiply(
          Mat4.rotateX(transform.angle * Math.PI / 180),
          overallTransform
        );
        break;
        
      case 'Ry': // rotation around Y
        overallTransform = Mat4.multiply(
          Mat4.rotateY(transform.angle * Math.PI / 180),
          overallTransform
        );
        break;
        
      case 'Rz': // rotation around Z
        overallTransform = Mat4.multiply(
          Mat4.rotateZ(transform.angle * Math.PI / 180),
          overallTransform
        );
        break;
        
      case 'S': // scale
        overallTransform = Mat4.multiply(
          Mat4.scale(transform.x, transform.y, transform.z),
          overallTransform
        );
        break;
    }
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


// TODO: implement vertex shader logic below

// varying vec3 temp;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  //temp = vec3(position.x, normal.x, uvCoord.x);
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vPosition = worldPosition.xyz;
  vNormal = normalMatrix * normal;
  vTexCoord = uvCoord;
 // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

Renderer.prototype.FRAGMENT_SHADER = `
precision mediump float;
uniform vec3 ka, kd, ks, lightIntensity;
uniform float shininess;
uniform sampler2D uTexture;
uniform bool hasTexture;
uniform vec3 lightPosition;
varying vec2 vTexCoord;



// TODO: implement fragment shader logic below


//varying vec3 temp;




varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  
  //gl_FragColor = vec4(temp, 1.0);  

//vec3 normal = normalize(vNormal);
  
  vec3 normal = normalize(vNormal);
  vec3 lightDir = normalize(lightPosition - vPosition);
  
  // Ambient
  vec3 ambient = ka;
  
  // Diffuse
  float diff = max(dot(normal, lightDir), 0.0);
  vec3 diffuse = kd * diff;
  
  // Specular - using Blinn-Phong instead of Phong
  vec3 viewDir = normalize(-vPosition);
  
  
 // vec3 reflectDir = reflect(-lightDir, normal);
 // float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
  
  vec3 halfwayDir = normalize(lightDir + viewDir);
  float spec = pow(max(dot(normal, halfwayDir), 0.0), shininess);
  vec3 specular = ks * spec;
  
  vec3 result = (ambient + diffuse + specular) * lightIntensity;
  
  if (hasTexture) {
    result *= texture2D(uTexture, vTexCoord).rgb;
  }
  
  gl_FragColor = vec4(result, 1.0);
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


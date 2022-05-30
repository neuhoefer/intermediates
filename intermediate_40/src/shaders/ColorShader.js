const ColorShader = {

  vertexShader: [

    'void main() {',

    '  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

    '}'

  ].join( '\n' ),

  fragmentShader: [

    'uniform vec3 color;',

    'void main() {',

    '  gl_FragColor = vec4( color, 1.0 );',  // RGB ALPHA

    '}'

  ].join( '\n' )

};

export { ColorShader };
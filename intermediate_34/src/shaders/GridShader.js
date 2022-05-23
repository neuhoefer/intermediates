const GridShader = {

      vertexShader: [

        'varying vec2 UV;',

        'void main() {',

        'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

        'UV = uv;',

        '}'

      ].join('\n'),

      fragmentShader: [

        'varying vec2 UV;',

        'uniform vec3 color;',     // Color of slots
        'uniform float slots;',    // Number of slots

        'void main() {',

        '  float height = 1.0 / (2.0 * slots);',    // Calculate the height of each slot
        '  float index = floor(UV.y / height);',    // Calculate index

        '  if (mod(index, 2.0) == 0.0) {',          // If index is even...
        '    gl_FragColor = vec4(color, 1.0);',     // Paint slot
        '  } else {',                               // ...else...
        '    discard;',                             // Do nothing
        '  }',
        '}'

      ].join('\n')
    }
;

export {GridShader};
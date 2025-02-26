var codigoVertexShader = [
    'precision mediump float;',
    'attribute vec3 vertexPosition;',
    'attribute vec3 vertexColor;',
    'varying vec3 fragColor;',
    'void main(){',
    'fragColor = vertexColor;',
    'gl_Position = vec4(vertexPosition, 1.0);',
    '}'
].join('\n');


var codigoFragmentShader = [
    'precision mediump float;',
    'varying vec3 fragColor;',
    'void main(){',
    'gl_FragColor = vec4(fragColor, 1.0);',
    '}'
].join("\n");
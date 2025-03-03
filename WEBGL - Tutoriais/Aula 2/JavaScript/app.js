var canvas = document.createElement('canvas');

canvas.width = window.innerWidth - 15;
canvas.height = window.innerHeight - 15;  //tamanho da janela

var GL = canvas.getContext('webgl');

var vertexShader = GL.createShader(GL.VERTEX_SHADER);

var fragmentShader = GL.createShader(GL.FRAGMENT_SHADER);

var program = GL.createProgram();

var gpuArrayBuffer = GL.createBuffer();

var finalMatrixLocation;

var angulodeRotacao = 0;


function PrepareCanvas() {
    GL.clearColor(0.65,0.65,0.65,1.0);

    GL.clear(GL.DEPTH_BUFFER_BIT | GL.COLOR_BUFFER_BIT);

    document.body.appendChild(canvas);

    canvas.insertAdjacentText('afterend','O canvas encontra-se em cima do texto');
}


function PrepareShaders(){
    GL.shaderSource(vertexShader, codigoVertexShader);

    GL.shaderSource(fragmentShader, codigoFragmentShader);

    GL.compileShader(vertexShader);
    GL.compileShader(fragmentShader);

    if(!GL.getShaderParameter(vertexShader, GL.COMPILE_STATUS)){
        console.error("ERRO: A compliação falhou",GL.getShaderInfoLog(vertexShader));
    }


    if(!GL.getShaderParameter(fragmentShader, GL.COMPILE_STATUS)){
        console.error("ERRO: A compliação falhou",GL.getShaderInfoLog(fragmentShader));
    }

}

function PrepareProgram(){
    GL.attachShader(program,vertexShader);
    GL.attachShader(program,fragmentShader);

    GL.linkProgram(program);

    if(!GL.getProgramParameter(program,GL.LINK_STATUS)){
        console.error('ERRO: A compliação falhou',GL.getProgramInfoLog(program));
    }

    GL.validateProgram(program);

    if(!GL.getProgramParameter(program,GL.VALIDATE_STATUS)){
        console.error('ERRO: A compliação falhou',GL.getProgramInfoLog(program));
    }

    GL.useProgram(program);
}

function PrepareTriangleData(){
    var triangleArray = [
            -0.5, -0.50, 0.0, 1.0, 0.0, 0.0,  //x,y,z,r,g,b
            0.5, -0.50, 0.0, 0.0, 1.0, 0.0,
            0.0, 0.50, 0.0, 0.0, 0.0, 1.0,
    ];

    GL.bindBuffer(GL.ARRAY_BUFFER,gpuArrayBuffer);

    GL.bufferData(
        GL.ARRAY_BUFFER,
        new Float32Array(triangleArray),
        GL.STATIC_DRAW
    );
}


function SendDataToShaders(){
    var vertexPositionAttributeLocation = GL.getAttribLocation(program, "vertexPosition");
    var vertexColorAttributeLocation = GL.getAttribLocation(program,"vertexColor");

    GL.vertexAttribPointer(
        vertexPositionAttributeLocation,
        3,
        GL.FLOAT,
        false,
        6*Float32Array.BYTES_PER_ELEMENT,
        0*Float32Array.BYTES_PER_ELEMENT
    );

    GL.vertexAttribPointer(
        vertexColorAttributeLocation,
        3,
        GL.FLOAT,
        false,
        6*Float32Array.BYTES_PER_ELEMENT,
        3*Float32Array.BYTES_PER_ELEMENT
    );


    GL.enableVertexAttribArray(vertexPositionAttributeLocation);
    GL.enableVertexAttribArray(vertexColorAttributeLocation);

    finalMatrixLocation = GL.getUniformLocation(program,'transformationMatrix');

}



function loop(){
    canvas.width = window.innerWidth - 15;
    canvas.height = window.innerHeight - 100;
    GL.viewport(0,0,canvas.width,canvas.height);
    GL.useProgram(program);

    GL.clearColor(0.65,0.65,0.65,1.0);
    GL.clear(GL.DEPTH_BUFFER_BIT | GL.COLOR_BUFFER_BIT);

    var finalMatrix = [
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [0,0,0,1]
    ];

    finalMatrix = math.multiply(CriarMatrizEscala(0.25,0.25,0.25),finalMatrix);
    finalMatrix = math.multiply(CriarMatrizRotacaoZ(angulodeRotacao), finalMatrix);
    finalMatrix = math.multiply(CriarMatrizTranslação(0.5,0.5,0), finalMatrix);

    var newarray = [];
    for(i = 0; i< finalMatrix.length; i++){
        newarray = newarray.concat(finalMatrix[i]);
    }

    GL.uniformMatrix4fv(finalMatrixLocation,false,newarray);

    GL.drawArrays(
        GL.TRIANGLES,
        0,
        3
    );

    angulodeRotacao += 1;


    requestAnimationFrame(loop);
}

function Start(){
    PrepareCanvas();
    PrepareShaders();
    PrepareProgram();
    PrepareTriangleData();
    SendDataToShaders();

    loop();
}


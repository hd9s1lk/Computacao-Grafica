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

var visualizationMatrixLocation;
var projectionMatrixLocation;
var viewportMatrixLocation;

var vertexPosition;
var vertexIndex;
var gpuIndexBuffer = GL.createBuffer();



function PrepareCanvas() {
    GL.clearColor(0.65,0.65,0.65,1.0);

    GL.clear(GL.DEPTH_BUFFER_BIT || GL.COLOR_BUFFER_BIT);

    GL.enable(GL.DEPTH_TEST);

    GL.enable(GL.CULL_FACE);

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
    var vertexPosition = [
            0,  0,  0,  0,  0,  0,
            0,  1,  0,  0,  1,  0,
            1,  1,  0,  1,  1,  0,
            1,  0,  0,  1,  0,  0,


            //Direita
            1,  0,  0,  1,  0,  0,
            1,  1,  0,  1,  1,  0,
            1,  1,  1,  1,  1,  1,
            1,  0,  1,  1,  0,  1,

            //Trás
            1,  0,  1,  1,  0,  1,
            1,  1,  1,  1,  1,  1,
            0,  1,  1,  0,  1,  1,
            0,  0,  1,  0,  0,  1,

            //Esquerda
            0,  0,  1,  0,  0,  1,
            0,  1,  1,  0,  1,  1,
            0,  1,  0,  0,  1,  0,
            0,  0,  0,  0,  0,  0,


            //Cima
            0,  1,  0,  0,  1,  0,
            0,  1,  1,  0,  1,  1,
            1,  1,  1,  1,  1,  1,
            1,  1,  0,  1,  1,  0,

            //Baixo
            1,  0,  0,  1,  0,  0,
            1,  0,  1,  1,  0,  1,
            0,  0,  1,  0,  0,  1,
            0,  0,  0,  0,  0,  0,
    ];


    vertexIndex = [
        //Frente
        0,2,1,
        0,3,2,

        //Direita
        4,6,5,
        4,7,6,

        //Trás
        8,10,9,
        8,11,10,

        //Esquerda
        12,14,13,
        12,15,14,

        //Cima
        16,18,17,
        16,19,18,

        //Baixo
        20,22,21,
        20,23,22

    ];

    GL.bindBuffer(GL.ARRAY_BUFFER,gpuArrayBuffer);

    GL.bufferData(
        GL.ARRAY_BUFFER,
        new Float32Array(vertexPosition),
        GL.STATIC_DRAW
    );


    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, gpuIndexBuffer);

    GL.bufferData(
        GL.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(vertexIndex),
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

    visualizationMatrixLocation = GL.getUniformLocation(program, 'visualizationMatrix');

    projectionMatrixLocation = GL.getUniformLocation(program, 'projectionMatrix');

    viewportMatrixLocation = GL.getUniformLocation(program, 'viewportMatrix');

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

    finalMatrix = math.multiply(CriarMatrizRotacaoY(angulodeRotacao),finalMatrix);

    finalMatrix = math.multiply(CriarMatrizTranslacao(0,0,4), finalMatrix);


    var newarray = [];
    for(i = 0; i< finalMatrix.length; i++){
        newarray = newarray.concat(finalMatrix[i]);
    }

    var visualizationMatrix = MatrizDeVisualizacao([1,0,0], [0,1,0],[0,0,1], [0,0,0]);

    var newVisualizationMatrix = [];

    for(i = 0; i< visualizationMatrix.length; i++){
        newVisualizationMatrix = newVisualizationMatrix.concat(visualizationMatrix[i]);
    }

    var projectionMatrix = MatrizPerspetiva(1,4,3,0.1, 100);

    //var projectionMatrix = MatrizOrtografica(4,3,0.1,100);

    var newprojectionMatrix = [];

    for(i = 0; i< projectionMatrix.length; i++){
        newprojectionMatrix = newprojectionMatrix.concat(projectionMatrix[i]);
    }

    var viewportMatrix = MatrizViewport(-1,1,-1,1);
    var newViewportMatrix = [];

    for(i=0; i<viewportMatrix.length; i++){
        newViewportMatrix = newViewportMatrix.concat(viewportMatrix[i]);
    }

    GL.uniformMatrix4fv(finalMatrixLocation,false,newarray);
    GL.uniformMatrix4fv(visualizationMatrixLocation,false,newVisualizationMatrix);
    GL.uniformMatrix4fv(projectionMatrixLocation,false,newprojectionMatrix);
    GL.uniformMatrix4fv(viewportMatrixLocation,false,newViewportMatrix);



    GL.drawElements(
        GL.TRIANGLES,
        vertexIndex.length,
        GL.UNSIGNED_SHORT,
        0
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


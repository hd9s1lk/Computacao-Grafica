/**
 * @param {float[3]} rightVector
 * @param {float[3]} upVector
 * @param {float[3]} forwardVector
 * @param {float[3]} centerPoint
 */

function MatrizDeVisualizacao(rightVector,upVector,forwardVector,centerPoint){
    return [
        [rightVector[0], rightVector[1], rightVector[2], -math.multiply(rightVector, centerPoint)],
        [upVector[0], upVector[1], upVector[2], -math.multiply(upVector, centerPoint)],
        [forwardVector[0], forwardVector[1], forwardVector[2], -math.multiply(forwardVector, centerPoint)],
        [0,0,0,1]
    ];
}

/**
 * @param {float[3]} width
 * @param {float[3]} height
 * @param {float[3]} nearPlane
 * @param {float[3]} farPlane
 */

function MatrizOrtografica(width, height, nearPlane, farPlane){
    var matrizOrtografica = [
        [1/width, 0, 0, 0],
        [0, 1/height, 0, 0],
        [0,0, 1/((farPlane/2) - nearPlane), -nearPlane/((farPlane/2) - nearPlane)],
        [0,0,0,1]
    ];

    return math.multiply(matrizOrtografica, CriarMatrizTranslacao(0,0,-(nearPlane+farPlane /2)));
}


/**
 * @param {float[3]} distance
 * @param {float[3]} width
 * @param {float[3]} height
 * @param {float[3]} farPlane
 * @param {float[3]} nearPlane
 */


function MatrizPerspetiva(distance, width, height, nearPlane, farPlane){
    return [
        [distance/width, 0, 0, 0],
        [0, distance/height, 0, 0],
        [0,0, farPlane/(farPlane - nearPlane), -nearPlane*farPlane/(farPlane-nearPlane)],
        [0,0,1,0]
    ];
}


/**
 * @param {float[3]} minX
 * @param {float[3]} maxX
 * @param {float[3]} minY
 * @param {float[3]} maxY
 */

function MatrizViewport(minX,maxX, minY, maxY){
    return [
        [(maxX - minX)/2, 0,0, (maxX+minY)/2],
        [0,(maxY-minY)/2, 0, (maxY + minY)/2],
        [0,0,1,0],
        [0,0,0,1]
    ];
}





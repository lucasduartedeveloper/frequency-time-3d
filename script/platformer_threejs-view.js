var sw = 360; //window.innerWidth;
var sh = 669; //window.innerHeight;

var cameraParams = {
   fov: 75, aspectRatio: (sw/sh), near: 0.1, far: 50
};
var lightParams = {
   color: 0xffffff, intensity: 1, distance: 100, decay: 3
};
var $;
var renderer, scene, light, camera, box, eye;

/*import { StereoscopicEffects } from 'threejs-StereoscopicEffects';*/
//import { Interaction } from 'three.interaction';

var load3D = function() {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
    // default THREE.PCFShadowMap
    renderer.setSize(sw, sh);

    renderer.enable3d = 1;
    renderer.domElement.style.position = "absolute";
    //renderer.domElement.style.display = "none";
    renderer.domElement.style.left = (0)+"px";
    renderer.domElement.style.top = (0)+"px";
    renderer.domElement.style.width = (sw)+"px";
    renderer.domElement.style.height = (sh)+"px";
    //renderer.domElement.style.border = "1px solid #fff";
    //renderer.domElement.style.borderRadius = "50%";
    //renderer.domElement.style.scale = "0.8";
    //renderer.domElement.style.border = "2px solid #ccc";
    renderer.domElement.style.zIndex = "25";
    document.body.appendChild( renderer.domElement ); 

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    renderer.domElement.onclick = function(e) {
        mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

        // update the picking ray with the camera and mouse position
        raycaster.setFromCamera( mouse, virtualCamera );

        // calculate objects intersecting the picking ray
        //console.log(scene.children);

        var intersects = raycaster.intersectObjects( scene.children );
        console.log(intersects.length);

        if (intersects.length > 0) {
            if (intersects[0].object.userData.tag != "row") return;

            advance(intersects[0].object.userData.direction);

            return;
            var timeout;
            switch (intersects[0].object.userData.tag) {
                case "left":
                    timeout = leftTimeout;
                    break;
                case "up":
                    timeout = upTimeout;
                    break;
                case "right":
                    timeout = rightTimeout;
                    break;
                case "down":
                    timeout = downTimeout;
                    break;
            }
            intersects[0].object.position.y = 0;

            clearTimeout(timeout);
            timeout = setTimeout(function() {
                intersects[0].object.position.y = -0.15;
            }, 1000);
        };
    };

    var leftTimeout = 0;
    var upTimeout = 0;
    var rightTimeout = 0;
    var downTimeout = 0;

    scene = new THREE.Scene();
    scene.background = null;
    //scene.background = new THREE.Color("#fff"); 

    light = new THREE.PointLight(
        lightParams.color,
        lightParams.intensity,
        lightParams.distance,
        lightParams.decay
    );

    light.position.set(0, 2.5, 2.5);
    light.castShadow = true;

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default

    lightObj = new THREE.Group();
    //lightObj.add(light);

    virtualCamera = new THREE.PerspectiveCamera( 
        cameraParams.fov, 
        cameraParams.aspectRatio, 
        cameraParams.near, 
        cameraParams.far 
    );
    virtualCamera.add(light);

    scene.add(lightObj);
    scene.add(virtualCamera);

    group = new THREE.Group();
    //group.rotation.x = -(Math.PI/2);
    scene.add(group);

    var geometry = new THREE.SphereGeometry(0.02, 32); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 0.5,
        transparent: true
    } );
    var sphere = new THREE.Mesh(geometry, material );
    group.add(sphere);

    rec = new CanvasRecorder(renderer.domElement);

    cameraTargetGroup = new THREE.Group();
    cameraTargetGroup.position.y = 1.5;
    cameraTargetGroup.position.z = 2.9;

    var geometry = new THREE.SphereGeometry(0.02, 32); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 0.5,
        transparent: true
    } );
    cameraTarget = new THREE.Mesh(geometry, material);
    cameraTarget.position.y = 0;
    cameraTarget.position.z = 0;
    cameraTargetGroup.add(cameraTarget);

    virtualCamera.position.set(
        0, 2.7, 3.4
    );

    var worldPos = new THREE.Vector3();
    cameraTarget.getWorldPosition(worldPos);
    virtualCamera.lookAt(
        0, //worldPos.x,
        0, //worldPos.y,
        0 //worldPos.z,
    );

    /*
    controls = new THREE.OrbitControls(virtualCamera,
    renderer.domElement);
    controls.target = worldPos;*/
    //controls.update();

    変数 = sw/1.2;

    const defaultEffect = 0; // Single view left
    //const defaultEffect = 21; // Anaglyph RC half-colors

    stereofx = new StereoscopicEffects(renderer, defaultEffect);
    stereofx.setSize(sw, sh);

    renderer.domElement.style.width = (sw)+"px";
    renderer.domElement.style.height = (sh)+"px";

    modes = StereoscopicEffects.effectsListForm();
    modes.value = defaultEffect;
    modes.style.position = 'absolute';
    //modes.style.display = "none";
    modes.style.fontFamily = "Khand";
    modes.style.textAlign = "center";
    modes.style.background = "#fff";
    modes.style.left = (((sw-変数)/2)+(sw/2)-(sw/2))+"px";+"px";
    modes.style.top = (10)+"px";
    modes.style.width = (変数)+"px";
    modes.style.height = (sw/9)+"px";
    modes.style.zIndex = "25";
    modes.addEventListener('change', () => {
        stereofx.setEffect(modes.value);
    });
    //document.body.appendChild(modes);

    eyeSep = document.createElement("input");
    eyeSep.type = "range";
    //eyeSep.style.display = "none";
    eyeSep.min = -0.05;
    eyeSep.step = 0.05;
    eyeSep.max = 1;
    eyeSep.value = 0;
    eyeSep.style.position = 'absolute';
    eyeSep.style.background = "#fff";
    eyeSep.style.left = (((sw-変数)/2)+(sw/2)-(sw/2))+"px";
    eyeSep.style.top = (20+(sw/9))+"px";
    eyeSep.style.width = (変数)+"px";
    eyeSep.style.height = (sw/9)+"px"
    eyeSep.style.zIndex = "25";
    eyeSep.addEventListener('change', () => {
        stereofx.setEyeSeparation(eyeSep.value);
    });
    stereofx.setEyeSeparation(eyeSep.value);
    //document.body.appendChild(eyeSep);

    var canTexture = false;

    var updateTime = 0;
    var resetTime = 2500;

    perfectMargin = 0.01;

    pause = true;

    poorCount = 0;
    goodCount = 0;
    greatCount = 0;
    perfectCount = 0;

    buttonMap = [ 0, 1, 2, 3 ];

    lastHit = 0;
    doubleHit = false;
    tripleHit = false;
    quadraHit = false;

    predictedHit = 0;

    sfxPool.playbackRate = 1;

    render = true;
    iterations = 9999999999;
    animateThreejs = function() {
        iterations -= 1;
        if (iterations > 0 && render)
        req = requestAnimationFrame( animateThreejs );
        if (pause) { 
            renderer.render( scene, virtualCamera );
            return;
        }

        var currentTime = new Date().getTime();
        if (currentTime - updateTime > resetTime) {
            //console.log("add button");
            createButton();

            resetTime = 500 + Math.floor(Math.random()*1000);
            updateTime = currentTime;
        }

        for (var n = 0; n < positionArr.length; n++) {
            var obj = positionArr[n];

            var distanceY = obj.y;
            if (!pause && distanceY > 2) {
                failed(obj)
                break;
            }

            obj.y += 0.02;
            obj.mesh.position.z = obj.y;
        }

        //controls.update();
        if (renderer.enable3d == 0) {
            renderer.render( scene, virtualCamera );
        }
        else if (renderer.enable3d == 1) {
            if (eyeSep.value < 0) 
            renderer.render( scene, virtualCamera );
            else stereofx.render( scene, virtualCamera );
        }
    };

    createMap();
    animateThreejs();
}

var advance = function(direction) {
    for (var n = 0; n < positionArr.length; n++) {
        var obj = positionArr[n];
        if (obj.direction != direction)
        continue;

        obj.remove = true;
        scene.remove(obj.mesh);

        var hit = (1/5)*Math.abs(1-obj.y);

        if (hit >= 0 && hit <= (0 + perfectMargin)) text = "PERFECT";
        else if (hit < 0.25) text = "GREAT";
        else if (hit < 0.75) text = "BOM";
        else text = "POOR";

        if (doubleHit && lastHit == 0) poorCount -= 1;
        if (doubleHit && lastHit == 1) goodCount -= 1;
        if (doubleHit && lastHit == 2) greatCount -= 1;
        if (doubleHit && lastHit == 3) perfectCount -= 1;

        switch (text) {
            case "POOR":
                if (predictedHit == 0) lastHit = 0;
                if (n == 0 && predictedHit > 0)
                poorCount += (predictedHit+1);
                else if (n == 0 && predictedHit == 0)
                poorCount += 1;
                break;
            case "BOM":
                if (predictedHit == 0) lastHit = 1;
                if (n == 0 && predictedHit > 0)
                goodCount += (predictedHit+1);
                else if (n == 0 && predictedHit == 0)
                goodCount += 1;
                break;
            case "GREAT":
                if (predictedHit == 0) lastHit = 2;
                if (n == 0 && predictedHit > 0)
                greatCount += (predictedHit+1);
                else if (n == 0 && predictedHit == 0)
                greatCount += 1;
                break;
            case "PERFECT":
                if (predictedHit == 0) lastHit = 3;
                if (n == 0 && predictedHit > 0)
                perfectCount += (predictedHit+1);
                else if (n == 0 && predictedHit == 0)
                perfectCount += 1;
                break;
        }

        var suffix = "";
        if (n == 0 && predictedHit == 1) suffix = "DOUBLE ";
        if (n == 0 && predictedHit == 2) suffix = "TRIPLE ";
        if (n == 0 && predictedHit == 3) suffix = "QUADRA ";
        if (n == 0 && predictedHit == 4) suffix = "PENTA ";
        if (n == 0 && predictedHit == 5) suffix = "HEXA ";
        if (n == 0 && predictedHit == 6) suffix = "HEPTA ";
        if (n == 0 && predictedHit == 7) suffix = "OCTA ";
        if (n == 0 && predictedHit == 8) suffix = "NONA ";
        if (n == 0 && predictedHit == 9) suffix = "DECA ";

        if (n == 0 && predictedHit > 0) {
            sfxPool.play(
            "audio/sfx-"+(suffix.toLowerCase().trimEnd())+".wav", 
            function() {
                sfxPool.play("audio/sfx-"+(text.toLowerCase())+".wav");
            });
        }
        else sfxPool.play("audio/sfx-"+(text.toLowerCase())+".wav");
        //oscillator.frequency.value = (1-hit)*250;

        showText(suffix + text);
        doubleHit = false;
        tripleHit = false;
        quadraHit = false;

        //pause = true;
        startX = lineArr[obj.direction];
        startY = ((sh/2)+(sh/4));
        objX = lineArr[obj.direction];
        objY = obj.y;

        positionArr = positionArr.filter((o) => { return !o.remove; });

        if (predictedHit == 0) predictedHit = n;
        else if (n == 0 && predictedHit > 0) predictedHit = 0;
        else if (n > 0 && n >= predictedHit) predictedHit = n+1;

        scoreView.innerText = (poorCount+(goodCount*2)+
        (greatCount*3)+(perfectCount*4)).toString().padStart(3, "0");
        break;
    }
};

window.addEventListener("keydown", (e) => {
    switch(e.keyCode) {
        case 37:
            advance(0);
            break;
        case 38:
            advance(1);
            break;
        case 39:
            advance(2);
            break;
        case 40:
            advance(3);
            break;
    }
});

var startAnimation = function() {
    render = true;
    animateThreejs();
};

var pauseAnimation = function() {
    render = false;
};

THREE.Object3D.prototype.loadTexture = 
function(url, callback, type="D") {
var rnd = Math.random();
new THREE.TextureLoader().load(url, 
    texture => {
        //Update Texture
        if (this.material) {
        if (type == "D") {
            //console.log("loaded texture");
            this.material.transparent = true;
            this.material.map = texture;
            this.material.needsUpdate = true;
        }
        else if (type == "N") {
            this.material.transparent = true;
            this.material.normalMap = texture;
            this.material.needsUpdate = true;
        }
        else if (type == "O") {
            this.material.transparent = true;
            this.material.alphaMap = texture;
            this.material.needsUpdate = true;
        }
        }
        else {
        if (type == "D") {
            //console.log("loaded texture obj");
            this.children[0].material.transparent = true;
            this.children[0].material.map = texture;
            this.children[0].material.needsUpdate = true;
        }
        else if (type == "N") {
            this.children[0].material.transparent = true;
            this.children[0].material.normalMap = texture;
            this.children[0].material.needsUpdate = true;
        }
        else if (type == "O") {
            this.children[0].material.transparent = true;
            this.children[0].material.alphaMap = texture;
            this.children[0].material.needsUpdate = true;
        }
        }

        if (callback)
        callback();
    },
    xhr => {
       //Download Progress
       console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    error => {
       //Error CallBack
        console.log("An error happened", error);
    });
};

var loadOBJ = function(path, callback) {
    var loader = new THREE.OBJLoader();
    // load a resource
    // resource URL
    // called when resource is loaded
    loader.load(path, callback,
    // called when loading is in progresses
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
    // called when loading has errors
        function ( error ) {
            console.log( 'An error happened' );
        }
    );
};

var cannonStarted = false;

var createTexture = function(direction, color, mirror=false) {
    var canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;

    var ctx = canvas.getContext("2d");

    var x = (canvas.width/2);
    var y = (canvas.height/2);
    var size = canvas.width*0.9;

    var color = "#fff";

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 5;
    ctx.strokeStyle =color;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(directionArr[direction]*(Math.PI/180));

    ctx.beginPath();
    ctx.moveTo(0, -(size/3));
    ctx.lineTo(0, (size/3));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-(size/4), -(size/10));
    ctx.lineTo(0, -(size/3));
    ctx.lineTo((size/4), -(size/10));
    ctx.stroke();

    if (mirror) {
       ctx.beginPath();
       ctx.lineTo(-(size/4), (size/10));
       ctx.lineTo(0, (size/3));
       ctx.lineTo((size/4), (size/10));
       ctx.stroke();
    }

    return canvas.toDataURL();
}

var positionArr = [];
var createButton = function() {
    var directionArr = [ 0, 1, 2, 3 ];

    if (positionArr.length > 0)
    for (var n = (positionArr.length-1); n >= 0; n--) {
        var obj = positionArr[n];
        if (obj.y < (-5+0.3))
        directionArr = directionArr.filter((n) => {
            return n != obj.direction;
        });
    }

    if (directionArr.length == 0) return;

    var obj = {
        y: -5,
        direction: 
        directionArr[Math.floor(Math.random()*directionArr.length)]
    };
    obj.mesh = drawButton(lineArr[obj.direction], obj.y, obj.direction);
    obj.mesh.userData.tag = "position";
    positionArr.push(obj);
};

var drawButton = function(x, y, direction) {
    var cubeGeometry = 
    //new THREE.CylinderGeometry(0.225, 0.225, 0.1, 32);
    new THREE.BoxGeometry(0.45, 0.1, 0.45);
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 1,
        wireframe: false
    } );

    var materialArr = [
        material.clone(),
        material.clone(),
        material.clone(),
        material.clone(),
        material.clone(),
        material.clone()
    ];

    new THREE.TextureLoader().load(createTexture(direction), 
    texture => {
        materialArr[2].map = texture;
        materialArr[2].needsUpdate = true;
    });

    cube = 
    new THREE.Mesh(cubeGeometry, materialArr);

    cube.position.x = x;
    cube.position.z = y;

    scene.add(cube);
    return cube;
};

var drawLine = function(x) {
    var planeGeometry = 
    new THREE.PlaneGeometry(0.45, 10); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 1,
        wireframe: false
    } );

    plane = 
    new THREE.Mesh(planeGeometry, material);

    plane.position.x = x;
    plane.position.y = -0.15;
    plane.rotation.x = -(Math.PI/2);

    scene.add(plane);
    return plane;
};

var directionArr = [  -90, 0, -270, -180 ];
var lineArr = [
    -1+(0.45/2),
    -1+(0.5)+(0.45/2),
    -1+(0.5*2)+(0.45/2),
    -1+(0.5*3)+(0.45/2)
];

var padArr = [];
var createMap = function() {
    var leftLine = drawLine(-1+(0.45/2));
    var upLine = drawLine(-1+(0.5)+(0.45/2));
    var rightLine = drawLine(-1+(0.5*2)+(0.45/2));
    var downLine = drawLine(-1+(0.5*3)+(0.45/2));

    /*
    leftLine.loadTexture(createStripeTexture("orange"));
    upLine.loadTexture(createStripeTexture("lightblue"));
    rightLine.loadTexture(createStripeTexture("purple"));
    downLine.loadTexture(createStripeTexture("darkred"));*/

    leftLine.userData.tag = "row";
    upLine.userData.tag = "row";
    rightLine.userData.tag = "row";
    downLine.userData.tag = "row";

    leftLine.userData.direction = 0;
    upLine.userData.direction = 1;
    rightLine.userData.direction = 2;
    downLine.userData.direction = 3;

    var leftMesh = drawButton(-1+(0.45/2), 1, 0);
    var upMesh = drawButton(-1+(0.5)+(0.45/2), 1, 1);
    var rightMesh = drawButton(-1+(0.5*2)+(0.45/2), 1, 2);
    var downMesh = drawButton(-1+(0.5*3)+(0.45/2), 1, 3);

    leftMesh.userData.tag = "left";
    upMesh.userData.tag = "up";
    rightMesh.userData.tag = "right";
    downMesh.userData.tag = "down";

    padArr = [ leftMesh, upMesh, rightMesh, downMesh ];

    leftMesh.position.y = -0.15;
    upMesh.position.y = -0.15;
    rightMesh.position.y = -0.15;
    downMesh.position.y = -0.15;

    var material = new THREE.LineBasicMaterial({
        color: 0x000000
    });
};

var createStripeTexture = function(color) {
    var canvas = document.createElement("canvas");
    canvas.width = 0.45*100;
    canvas.height = 10*100;

    var ctx = canvas.getContext("2d");

    ctx.globalAlpha = 0.5;
    drawStripes(ctx, color, ((0.45*100)/2), ((10*100)/2));

    for (var n = 0; n < 10; n++) {
        var x = Math.random()*(0.45*100);
        var y = Math.random()*(10*100);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.random()*(Math.PI*2));
        ctx.translate(-x, -y);

        drawStripes(ctx, color, x, y);

        ctx.restore();
    };

    return canvas.toDataURL();
};

var drawStripes = function(ctx, color, x, y) {
    var width = (0.45*100)/10;

    ctx.fillStyle = color;
    ctx.fillRect(x-((0.45*100)/2), y-(10*100),
    0.45*100, (10*100)*2);

    ctx.fillStyle = "#000";
    for (var n = 0; n < 10; n+=2) {
        ctx.fillRect(x-((0.45*100)/2)+(n*((0.45*100)/10)), y-((10*100)/2),
        (0.45*100)/10, 10*100);
    }
};
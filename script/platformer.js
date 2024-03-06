var uploadAlert = new Audio("audio/ui-audio/upload-alert.wav");
var warningBeep = new Audio("audio/warning_beep.wav");

var sw = window.innerWidth;
var sh = window.innerHeight;

var audioBot = true;
var playerId = new Date().getTime();

var canvasBackgroundColor = "rgba(255,255,255,1)";
var backgroundColor = "rgba(50,50,65,1)";
var buttonColor = "rgba(75,75,90,1)";

// Botão de gravação
$(document).ready(function() {
    $("html, body").css("overscroll-behavior", "none");
    $("html, body").css("overflow", "hidden");
    $("html, body").css("background", "#000");

    $("#title").css("font-size", "15px");
    $("#title").css("color", "#fff");
    $("#title").css("top", "10px");
    $("#title").css("z-index", "25");

    // O outro nome não era [  ]
    // Teleprompter
    $("#title")[0].innerText = ""; //"PICTURE DATABASE"; 
    $("#title")[0].onclick = function() {
        var text = prompt();
        sendText(text);
    };

    tileSize = (sw/7);

    backgroundView = document.createElement("img");
    backgroundView.style.position = "absolute";
    //pictureView.style.background = "#fff";
    backgroundView.style.objectFit = "cover";
    backgroundView.width = (sw);
    backgroundView.height = (sh); 
    backgroundView.style.left = (0)+"px";
    backgroundView.style.top = (0)+"px";
    backgroundView.style.width = (sw)+"px";
    backgroundView.style.height = (sh)+"px";
    backgroundView.style.zIndex = "15";
    //backgroundView.src = "img/background-0.png";
    //document.body.appendChild(backgroundView);

    pictureView = document.createElement("canvas");
    pictureView.style.position = "absolute";
    pictureView.style.background = "#fff";
    pictureView.width = (sw);
    pictureView.height = (sh); 
    pictureView.style.left = (0)+"px";
    pictureView.style.top = (0)+"px";
    pictureView.style.width = (sw)+"px";
    pictureView.style.height = (sh)+"px";
    pictureView.style.zIndex = "15";
    document.body.appendChild(pictureView);

    analogView = document.createElement("button");
    analogView.style.position = "absolute";
    analogView.style.color = "#000";
    analogView.style.fontFamily = "Khand";
    analogView.style.fontSize = "15px";
    analogView.style.left = (sw-110)+"px";
    analogView.style.top = (sh-110)+"px";
    analogView.style.width = (100)+"px";
    analogView.style.height = (100)+"px";
    analogView.style.border = "1px solid white";
    analogView.style.borderRadius = "50%";
    analogView.style.zIndex = "35";
    //document.body.appendChild(analogView);

    analogPosition = {
        x: 0,
        y: 0
    };

    base_angle = 0;
    joint0_angle = 0;
    joint1_angle = 0;

    startX = 0;
    startY = 0;
    moveX = 0;
    moveY = 0;

    analogView.ontouchstart = function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    };

    analogView.ontouchmove = function(e) {
        moveX = e.touches[0].clientX;
        moveY = e.touches[0].clientY;

        var v = {
            x: moveX-startX,
            y: moveY-startY
        };

        v.x = (1/sw)*v.x;
        v.y = (1/sw)*v.y;

        analogPosition = v;
        //console.log(analogPosition);
    };

    analogView.ontouchend = function() {
        var v = {
            x: 0,
            y: 0
        };
        analogPosition = v;
    };

    jumpView = document.createElement("button");
    jumpView.style.position = "absolute";
    jumpView.style.background = "rgba(255, 255, 255, 0)";
    jumpView.style.color = "#000";
    jumpView.style.fontFamily = "Khand";
    jumpView.style.fontSize = "15px";
    jumpView.style.left = (10)+"px";
    jumpView.style.top = (sh-110)+"px";
    jumpView.style.width = (100)+"px";
    jumpView.style.height = (100)+"px";
    jumpView.style.border = "1px solid white";
    jumpView.style.borderRadius = "50%";
    jumpView.style.zIndex = "35";
    //document.body.appendChild(jumpView);

    jumpView.ontouchstart = function(e) {
        var vect = new CANNON.Vec3(0, 150, 0);
        cube.userData.physicsBody.applyForce(
            vect, cube.userData.physicsBody.position
        );
    };

    shootView = document.createElement("button");
    shootView.style.position = "absolute";
    shootView.style.color = "#000";
    shootView.style.fontFamily = "Khand";
    shootView.style.fontSize = "15px";
    shootView.style.left = (sw-60)+"px";
    shootView.style.top = (sh-170)+"px";
    shootView.style.width = (50)+"px";
    shootView.style.height = (50)+"px";
    shootView.style.border = "1px solid white";
    shootView.style.borderRadius = "50%";
    shootView.style.zIndex = "35";
    //document.body.appendChild(shootView);

    isAttacking = false;
    attackInterval = 0;
    shootView.onclick = function() {
        csg0.userData.physicsBody.angularVelocity.y += 5;
    };

    oscillator = createOscillator();
    oscillator.volume.gain.value = 1;

    oscillator.frequency.value = 50;
    oscillator.start();

    //drawImage();
    animate();

    motion = false;
    gyroUpdated = function(e) {
        var accX = (1/9.8)*-e.accX;
        var accY = (1/9.8)*-(e.accY-9.8);
        var accZ = (1/9.8)*-e.accZ;

        cameraTargetGroup.position.x += accX;
        cameraTargetGroup.position.y += accY;
        cameraTargetGroup.position.z += accZ;

        virtualCamera.position.set(
            cameraTargetGroup.position.x, 
            cameraTargetGroup.position.y, 
            cameraTargetGroup.position.z
        );
    };

    scoreView = document.createElement("span");
    scoreView.style.position = "absolute";
    scoreView.style.userSelect = "none";
    scoreView.style.objectFit = "cover";
    scoreView.innerText = "000";
    scoreView.style.animationDuration = "1s";
    scoreView.style.color = "#000";
    scoreView.style.fontWeight = "900";
    scoreView.style.fontSize = "25px";
    scoreView.style.lineHeight = "25px";
    scoreView.style.textAlign = "center";
    scoreView.style.left = (10)+"px";
    scoreView.style.top = ((sh/4)-75)+"px";
    scoreView.style.width = (50)+"px";
    scoreView.style.height = (50)+"px";
    scoreView.style.zIndex = "35";
    document.body.appendChild(scoreView);

    textView = document.createElement("span");
    textView.style.position = "absolute";
    textView.style.userSelect = "none";
    textView.style.objectFit = "cover";
    textView.style.display = "none";
    textView.style.animationDuration = "1s";
    textView.style.color = "#000";
    textView.style.fontWeight = "900";
    textView.style.fontSize = "25px";
    textView.style.lineHeight = "25px";
    textView.style.textAlign = "center";
    textView.style.left = ((sw/2)-125)+"px";
    textView.style.top = ((sh/4)-75)+"px";
    textView.style.width = (250)+"px";
    textView.style.height = (50)+"px";
    textView.style.zIndex = "35";
    document.body.appendChild(textView);

    textView.onanimationend = function() {
        textView.className = "";
        textView.innerText = "";
    };

    clearTextTimeout = 0;

    showText = function(text) {
        textView.innerText = text;
        //textView.src = "img/fx-"+(text.toLowerCase())+".png";

        textView.className = "";
        textView.style.display = "initial";
        textView.className = 
        "animate__animated animate__rubberBand";

        /*
        spriteView.className = 
        "animate__animated animate__rubberBand";*/

        clearTimeout(clearTextTimeout);
        clearTextTimeout = setTimeout(function() {
            textView.style.display = "none";
        }, 2500);
    };

    restartView = document.createElement("span");
    restartView.style.position = "absolute";
    restartView.style.userSelect = "none";
    restartView.style.objectFit = "cover";
    //restartView.style.display = "none";
    restartView.style.animationDuration = "1s";
    restartView.innerText = "PLAY";
    restartView.style.color = "#000";
    restartView.style.fontWeight = "900";
    restartView.style.fontSize = "25px";
    restartView.style.lineHeight = "25px";
    restartView.style.textAlign = "center";
    restartView.style.left = ((sw/2)-125)+"px";
    restartView.style.top = ((sh/4)-25)+"px";
    restartView.style.width = (250)+"px";
    restartView.style.height = (50)+"px";
    restartView.style.zIndex = "35";
    document.body.appendChild(restartView);

    restartView.onclick = function() {
        textView.style.display = "none";
        restartView.style.display = "none";

        for (var n = 0; n < positionArr.length; n++) {
            scene.remove(positionArr[n].mesh);
        }

        positionArr = [];
        pause = false;

        poorCount = 0;
        goodCount = 0;
        greatCount = 0;
        perfectCount = 0;

        predictedHit = 0;
        scrollSpeed = 1;
    };

    load3D();
    eruda.destroy();
});

var failed = function(obj=false) {
    text = "FAILED";
    restartView.innerText = "RESTART";

    textView.innerText = text;
    textView.style.display = "initial";

    obj.highlight = true;

    pause = true;

    if (obj) {
        startX = lineArr[obj.direction];
        startY = ((sh/2)+(sh/4));
        objX = lineArr[obj.direction];
        objY = obj.y; 
    }
    else {
        startX = lineArr[direction];
        startY = ((sh/2)+(sh/4));
        objX = lineArr[direction];
        objY = 0;
    }
    //drawImage();

    setTimeout(function() {
        restartView.style.display = "initial";
    }, 1000);
};

var gridSize = 10;

var drawImage = 
    function(angle=0, color="#000", gridColor="#333") {
    var ctx = pictureView.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, sw, sh);

    ctx.save();
    ctx.translate((sw/2), (sh/2));
    ctx.rotate(angle);
    ctx.translate(-(sw/2), -(sh/2));

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, sw, sh);

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    for (var y = 0; y < Math.floor((sh/(sw/gridSize))); y++) {
        ctx.beginPath();
        ctx.moveTo(0, y*(sw/gridSize));
        ctx.lineTo(sw, y*(sw/gridSize));
        ctx.stroke();
    }

    for (var x = 0; x <= gridSize; x++) {
        ctx.beginPath();
        ctx.moveTo(x*(sw/gridSize), 0);
        ctx.lineTo(x*(sw/gridSize), sh);
        ctx.stroke();
    }

    ctx.restore();
};

var updateImage = true;

var updateTime = 0;
var renderTime = 0;
var elapsedTime = 0;
var animationSpeed = 0;

var previousRotation = 0;

var animate = function() {
    elapsedTime = new Date().getTime()-renderTime;
    if (!backgroundMode) {
        if ((new Date().getTime() - updateTime) > 1000) {
            updateTime = new Date().getTime();
        }
        //drawImage();

        if (cannonStarted) {
            
        }
    }
    renderTime = new Date().getTime();
    requestAnimationFrame(animate);
};

var visibilityChange;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  visibilityChange = "msvisivbilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  visibilityChange = "webkitvisibilitychange";
}
//^different browsers^

var backgroundMode = false;
document.addEventListener(visibilityChange, function(){
    backgroundMode = !backgroundMode;
    if (backgroundMode) {
        clock.running = false;
        console.log("backgroundMode: "+backgroundMode);
    }
    else {
        clock.start();
        console.log("backgroundMode: "+backgroundMode);
    }
}, false);
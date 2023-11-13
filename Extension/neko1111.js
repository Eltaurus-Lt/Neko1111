const neko = document.createElement("div");
neko.id = "neko";
document.children[0].appendChild(neko);

const step = 12;
const blnStep = 4;
const balloonFreq = 0.01;
const spf = 100;
const mouseRange = 6000;
let posX, posY;
let targetX, targetY, target, mouseX, mouseY;
let state, boredom, fatigue;


function nekoInit() {
  posX = 100 + window.pageXOffset;
  posY = 100 + window.pageYOffset;
  boredom = 0;
  fatigue = 0;
  state = "still";
  target = "mouse";
  
  neko.style.transform = "translate(" + posX + "px," + posY  + "px)";
  neko.setAttribute('data-state', state);
};
nekoInit();

function switchState(newState) {
  state = newState;
  // void neko.offsetHeight;
  neko.setAttribute('data-state', state);
  boredom = 0;
}

function popBalloon(balloon) {
  balloon.classList.add('pop');
  setTimeout(() => {
    balloon.parentNode.removeChild(balloon);
  }, "500");
}

function moveTowardsTarget() {
  
  if (target === "mouse") {
    targetX = mouseX;
    targetY = mouseY;
  } else if (target && typeof(target) != "string" && document.contains(target)) {
    let xy = getBalloonXY(target);
    targetX = xy[0];
    targetY = xy[1];
  } else {
    targetX = 100;
    targetY = 100;
    switchState("still");
  }
  
  let targetVec = [targetX - posX, targetY - posY];
  let alpha = Math.atan2(targetVec[1], targetVec[0]);
  
  switch(Math.round(4 * alpha/Math.PI)) {
  case -3:
    neko.setAttribute('data-dir', "nw");
    break;
  case -2:
    neko.setAttribute('data-dir', "n");
    break;
  case -1:
    neko.setAttribute('data-dir', "ne");
    break;
  case 0:
    neko.setAttribute('data-dir', "e");
    break;
  case 1:
    neko.setAttribute('data-dir', "se");
    break;
  case 2:
    neko.setAttribute('data-dir', "s");
    break;
  case 3:
    neko.setAttribute('data-dir', "sw");
    break;
  default:
    neko.setAttribute('data-dir', "w"); 
  }
  
  let range = 17 * step * step;
  if (target === "mouse") {
    range = mouseRange;
  }
  
  if (targetVec[0] * targetVec[0] + targetVec[1] * targetVec[1] > range) {
    posX += step * Math.cos(alpha);
    posY += step * Math.sin(alpha);
    neko.style.transform = "translate(calc(" + posX + "px - 50%) , calc(" + posY  + "px - 50%))";
    
  } else {
    if (target != "mouse" && document.contains(target)) {
      popBalloon(target);
    }
    switchState("still");
  }
  
  
}

function getBalloonXY(bln) {
  var matches = bln.style.transform.match(/\d+/g);
  let xy = matches.map(function(match) {
    return parseInt(match, 10); 
  });
  return xy;
}

document.addEventListener('mousemove', (e) => {
  mouseX = e.pageX;
  mouseY = e.pageY;
  if (state === "yawn" || state === "itch" || state === "still") {
    target = "mouse";
    switchState("alert");
  }
});

function nekoLoop() {
  let balloons = document.getElementsByClassName("balloon");
//  console.log(target);
  
  boredom += spf;
  
  switch (state) {
   case "run":
      moveTowardsTarget();
      fatigue += spf;
      break;
   case "still":
      if (fatigue > 15000 && boredom > 5000) {
        switchState("yawn");
      };
      if (boredom > 5000) {
        if (balloons && Math.random() < .8) {
          target = "";
          switchState("alert");
        } else {
          switchState("itch");
        }
      };
      break;
   case "itch": 
      if (boredom > 3000) {
        switchState("still");
      }
      break;
  case "yawn":
      if (boredom > 4000) {
        if (fatigue < 0) {
          switchState("still");
        } else {
          switchState("sleep");
        }
      }
      break;
  case "sleep":
      fatigue -= spf;
      if (fatigue < -10000 && boredom > 10000) {
        switchState("yawn");
      }
     break;
  case "alert":    
      if (boredom > 1500) {
        if (target != "mouse" || ((posX - mouseX) * (posX - mouseX) + (posY - mouseY) * (posY - mouseY) < 2 * mouseRange)) {
          if (Math.random() < 0.1 && ((posX - mouseX) * (posX - mouseX) + (posY - mouseY) * (posY - mouseY) > 2 * mouseRange)) {
          target = "mouse";
        } else if (balloons && balloons.length > 0) {
          target = Array.from(balloons)[Math.floor(Math.random() * balloons.length)];
          Array.from(balloons).forEach( bl => bl.classList.remove('target'));
          target.classList.add('target');
        } else {
          target = "";
        }
      }
        if (target !== "") {
          switchState("run");
        } else {
          switchState("still");
        }
      }
      break;
  default:
      
  }
 
  
  //balloonLoop
  if (Math.random() < balloonFreq) {
    //console.log('~O');
    let newBln = document.createElement("div");
    newBln.classList.add('balloon');
    let prob = Math.random();
    if (prob < .3) {
      newBln.classList.add('yellow');
    } else if (prob > .6) {
      newBln.classList.add('white');
    } else {
      newBln.classList.add('purple');
    }
    newBln.style.transform = "translate(" + Math.round(window.pageXOffset + Math.random() * window.innerWidth) + "px, " + (window.pageYOffset + window.innerHeight + 16) + "px )";
    newBln.style.left = "-16px";
    newBln.style.top = "-16px";
    document.children[0].appendChild(newBln);
    newBln.onclick = function () {popBalloon(this)};
    
  }

  //console.log(balloons.length);
  Array.from(balloons).forEach( bln => {
    let xy = getBalloonXY(bln);
    if (xy[1] <= blnStep) {
      bln.parentNode.removeChild(bln);
    } else if (!bln.classList.contains('pop')) { 
      bln.style.transform = "translate(" + xy[0] + "px, " + (xy[1] - blnStep) + "px )";
    }
  });
  
}

neko.onclick = function () {target = "mouse"; switchState("alert");};
setInterval(nekoLoop, spf);


//preloaders
let assets = [
  '--neko-still',
  '--neko-alert', 
  '--neko-yawn',
  '--neko-run-north-1',
  '--neko-run-north-2',
  '--neko-run-northeast-1',
  '--neko-run-northeast-2',
  ' --neko-run-east-1',
  '--neko-run-east-2',
  '--neko-run-southeast-1',
  '--neko-run-southeast-2',
  '--neko-run-south-1',
  '--neko-run-south-2',
  '--neko-run-southwest-1',
  '--neko-run-southwest-2',
  '--neko-run-west-1',
  '--neko-run-west-2',
  '--neko-run-northwest-1',
  '--neko-run-northwest-2',
  '--neko-scratch-north-1',
  '--neko-scratch-north-2',
  '--neko-scratch-east-1',
  '--neko-scratch-east-2',
  '--neko-scratch-south-1',
  '--neko-scratch-south-2',
  '--neko-scratch-west-1',
  '--neko-scratch-west-2',
  '--neko-itch-1',
  '--neko-itch-2',
  '--neko-sleep-1',
  '--neko-sleep-2',
  '--balloon-purple-1',
  '--balloon-purple-2',
  '--balloon-purple-3',
  '--balloon-yellow-1',
  '--balloon-yellow-2',
  '--balloon-yellow-3',
  '--balloon-white-1',
  '--balloon-white-2',
  '--balloon-white-3',
  '--balloon-pop'
];
// document.addEventListener('DOMContentLoaded', function () {
      
      assets.forEach( a => {
        let newDiv = document.createElement('div');
        newDiv.style.background = 'var(' + a + ')';
        // newDiv.style.width = '32px';
        // newDiv.style.height = '32px';
        document.children[0].appendChild(newDiv);
      });
//    });
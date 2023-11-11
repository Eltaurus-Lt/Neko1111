const neko = document.createElement("div");
neko.id = "neko";
document.children[0].appendChild(neko);

const step = 12;
const blnStep = 6;
const baloonFreq = 0.02;
const spf = 100;
let posX, posY;
let targetX, targetY;
let state, boredom, fatigue;

function nekoInit() {
  posX = 100;
  posY = 100;
  boredom = 0;
  fatigue = 0;
  state = "still";
  
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

function moveTowardsTarget() {
  
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
  
  if (targetVec[0] * targetVec[0] + targetVec[1] * targetVec[1] > 6000) {
    posX += step * Math.cos(alpha);
    posY += step * Math.sin(alpha);
    neko.style.transform = "translate(calc(" + posX + "px - 50%) , calc(" + posY  + "px - 50%))";
    
  } else {
    switchState("still");
  }
  
  
}

function getBaloonXY(bln) {
  var matches = bln.style.transform.match(/\d+/g);
  let xy = matches.map(function(match) {
    return parseInt(match, 10); 
  });
  return xy;
}

document.addEventListener('mousemove', (e) => {
  targetX = e.pageX;
  targetY = e.pageY;
  if (state === "yawn" || state === "itch" || state === "still") {
    switchState("alert");
  }
});

function nekoLoop() {
  boredom += spf;
  
  switch (state) {
   case "run":
      moveTowardsTarget();
      fatigue += spf;
      break;
   case "still":
      if (fatigue > 5000 && boredom > 5000) {
        switchState("yawn");
      };
      if (boredom > 5000) {
        switchState("itch");
      };
      break;
   case "itch": 
      fatigue += spf;
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
        switchState("run");
      }
      break;
  default:
      
  }
  
  //baloonLoop
  if (Math.random() < baloonFreq) {
    //console.log('~O');
    let newBln = document.createElement("div");
    newBln.classList.add('baloon');
    let prob = Math.random();
    if (prob < .3) {
      newBln.classList.add('yellow');
    } else if (prob > .6) {
      newBln.classList.add('white');
    } else {
      newBln.classList.add('purple');
    }
    newBln.style.transform = "translate(" + Math.round(Math.random() * window.innerWidth) + "px, " + (window.innerHeight + 100) + "px )";
    newBln.style.left = "-16px";
    newBln.style.top = "-16px";
    document.children[0].appendChild(newBln);
    
    
  }
  baloons = document.getElementsByClassName("baloon");
  console.log(baloons.length);
  Array.from(baloons).forEach( bln => {
    let xy = getBaloonXY(bln);
    if (xy[1] <= blnStep) {
      bln.parentNode.removeChild(bln);
    } else {
      bln.style.transform = "translate(" + xy[0] + "px, " + (xy[1] - blnStep) + "px )";
    }
  });
  
}

neko.onclick = function () {switchState("alert");};
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
  '--baloon-purple-1',
  '--baloon-purple-2',
  '--baloon-purple-3',
  '--baloon-yellow-1',
  '--baloon-yellow-2',
  '--baloon-yellow-3',
  '--baloon-white-1',
  '--baloon-white-2',
  '--baloon-white-3',
  '--baloon-pop'
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
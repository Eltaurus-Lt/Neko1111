const neko = document.createElement("div");
neko.id = "neko";
document.children[0].appendChild(neko);

const step = 12;
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
}

neko.onclick = function () {switchState("alert");};
setInterval(nekoLoop, spf);
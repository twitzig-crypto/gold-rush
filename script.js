let gameState = {
  health: 10,
  money: 20,
  progress: 0
};

const images = {
  travel: "images/travel.png",
  danger: "images/danger.png",
  gold: "images/gold.png",
  town: "images/town.png",
  camp: "images/camp.png"
};

const events = [

{
  text: "You receive a letter: Gold in California. How will you travel?",
  type: "travel",
  choices: [
    { text: "Wagon Train", effect: () => apply({health:-2, money:+10, progress:+1}) },
    { text: "Sail Around South America", effect: () => apply({health:-1, money:-10, progress:+2}) },
    { text: "Cross Panama", effect: () => apply({health:-3, money:-5, progress:+2}) }
  ]
},

{
  text: "You can buy one item before leaving.",
  type: "town",
  choices: [
    { text: "Extra Food", effect: () => apply({health:+2}) },
    { text: "Better Tools", effect: () => apply({money:+10}) },
    { text: "Wagon Upgrade", effect: () => apply({progress:+2}) }
  ]
},

{
  text: "A raging river blocks your path.",
  type: "danger",
  choices: [
    { text: "Unload Supplies", effect: () => apply({money:-5, progress:+1}) },
    { text: "Force Crossing", effect: () => randomOutcome([
        {health:-2},
        {progress:+2}
      ])},
    { text: "Stabilize Carefully", effect: () => apply({health:-1, progress:+1}) }
  ]
},

{
  text: "You feel sick and weak.",
  type: "camp",
  choices: [
    { text: "Rest", effect: () => apply({health:+2}) },
    { text: "Push On", effect: () => apply({health:-2, progress:+1}) },
    { text: "Buy Medicine", effect: () => apply({money:-5, health:+3}) }
  ]
},

{
  text: "You arrive at a chaotic boomtown.",
  type: "town",
  choices: [
    { text: "Rush to claim land", effect: () => randomOutcome([
        {money:+15},
        {money:+0}
      ])},
    { text: "Gather info", effect: () => apply({progress:+1, money:+5}) },
    { text: "Join a group", effect: () => apply({money:+8}) }
  ]
},

{
  text: "You try panning for gold.",
  type: "gold",
  choices: [
    { text: "Stop early", effect: () => apply({money:+0}) },
    { text: "Keep working", effect: () => apply({money:+10}) },
    { text: "Sell quickly", effect: () => apply({money:+8}) }
  ]
},

{
  text: "Food is expensive in town.",
  type: "town",
  choices: [
    { text: "Eat basic rations", effect: () => apply({}) },
    { text: "Buy good meals", effect: () => apply({money:-5, health:+2}) },
    { text: "Eat less", effect: () => apply({money:+5, health:-2}) }
  ]
},

{
  text: "A snake appears near your tools!",
  type: "danger",
  choices: [
    { text: "Fight it", effect: () => apply({health:-1, progress:+1}) },
    { text: "Leave and return", effect: () => randomOutcome([
        {money:-5},
        {}
      ])},
    { text: "Scare it away", effect: () => randomOutcome([
        {money:+8},
        {health:-2}
      ])}
  ]
},

{
  text: "A miner offers to sell his land.",
  type: "town",
  choices: [
    { text: "Buy it", effect: () => apply({money:-10}) },
    { text: "Test it first", effect: () => apply({progress:+1}) },
    { text: "Walk away", effect: () => apply({money:+5}) }
  ]
},

{
  text: "A storm floods your claim.",
  type: "danger",
  choices: [
    { text: "Rebuild", effect: () => apply({health:-1}) },
    { text: "Move", effect: () => apply({money:-5, progress:+2}) },
    { text: "Work in town", effect: () => apply({money:+10}) }
  ]
},

{
  text: "Another miner challenges your claim.",
  type: "danger",
  choices: [
    { text: "Fight", effect: () => apply({health:-3}) },
    { text: "Negotiate", effect: () => apply({money:+5}) },
    { text: "Leave", effect: () => apply({money:-5, progress:+1}) }
  ]
},

{
  text: "You notice people making money selling goods.",
  type: "town",
  choices: [
    { text: "Start a business", effect: () => apply({money:+15}) },
    { text: "Keep mining", effect: () => randomOutcome([
        {money:+20},
        {money:+5}
      ])},
    { text: "Partner up", effect: () => randomOutcome([
        {money:+10},
        {money:-5}
      ])}
  ]
}

];

let currentEvent = 0;

function apply(change) {
  gameState.health += change.health || 0;
  gameState.money += change.money || 0;
  gameState.progress += change.progress || 0;
  nextEvent();
}

function randomOutcome(outcomes) {
  let choice = outcomes[Math.floor(Math.random() * outcomes.length)];
  apply(choice);
}

function updateStats() {
  document.getElementById("stats").innerText =
    `Health: ${gameState.health} | Gold: ${gameState.money} | Progress: ${gameState.progress}`;
}

function nextEvent() {

  if (gameState.health <= 0) {
    endGame("You did not survive the journey.");
    return;
  }

  if (currentEvent >= events.length) {
    endGame("You completed your journey!");
    return;
  }

  let event = events[currentEvent];
  currentEvent++;

  document.getElementById("sceneImage").src = images[event.type];
  document.getElementById("eventText").innerText = event.text;

  let choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  event.choices.forEach(choice => {
    let btn = document.createElement("button");
    btn.innerText = choice.text;
    btn.onclick = choice.effect;
    choicesDiv.appendChild(btn);
  });

  updateStats();
}

function endGame(message) {
  let code = `GR-${gameState.progress}-${gameState.health}-${gameState.money}-${Math.floor(Math.random()*1000)}`;

  document.getElementById("eventText").innerText = message;
  document.getElementById("choices").innerHTML = "";
  document.getElementById("result").innerText = "Completion Code: " + code;
}

nextEvent();
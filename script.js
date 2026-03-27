let gameState = {
  health: 10,
  money: 20,
  progress: 0
};

let currentEvent = 0;
let pendingResult = null;

const events = [

{
  text: "You receive a letter: Gold in California. How will you travel?",
  image: "images/travel.png",
  choices: [
    {
      text: "Wagon Train",
      outcomes: [{
        change: {health:-2, money:+10, progress:+1},
        text: "The long journey wears you down, but sharing supplies helps you save money."
      }]
    },
    {
      text: "Sail Around South America",
      outcomes: [{
        change: {health:-1, money:-10, progress:+2},
        text: "The voyage is long and costly, but you avoid many dangers of the land."
      }]
    },
    {
      text: "Cross Panama",
      outcomes: [{
        change: {health:-3, money:-5, progress:+2},
        text: "The jungle is brutal—heat, insects, and sickness take their toll."
      }]
    }
  ]
},

{
  text: "A raging river blocks your path.",
  image: "images/danger.png",
  choices: [
    {
      text: "Unload Supplies",
      outcomes: [{
        change: {money:-5, progress:+1},
        text: "You lighten the wagon and make it across, but lose valuable supplies."
      }]
    },
    {
      text: "Force Crossing",
      outcomes: [
        {
          change: {health:-2},
          text: "The current slams into you. You make it across—but barely, injured and shaken."
        },
        {
          change: {progress:+2},
          text: "With a desperate push, your team powers through the river faster than expected."
        }
      ]
    },
    {
      text: "Stabilize Carefully",
      outcomes: [{
        change: {health:-1, progress:+1},
        text: "You move slowly and carefully, managing the crossing with only minor strain."
      }]
    }
  ]
},

{
  text: "You feel feverish and weak.",
  image: "images/camp.png",
  choices: [
    {
      text: "Rest",
      outcomes: [{
        change: {health:+2},
        text: "You take time to recover, regaining strength before continuing."
      }]
    },
    {
      text: "Push On",
      outcomes: [{
        change: {health:-2, progress:+1},
        text: "You force yourself forward, gaining ground but worsening your condition."
      }]
    },
    {
      text: "Buy Medicine",
      outcomes: [{
        change: {money:-5, health:+3},
        text: "The medicine helps quickly, though it costs you dearly."
      }]
    }
  ]
},

{
  text: "You arrive at a chaotic boomtown.",
  image: "images/town.png",
  choices: [
    {
      text: "Rush to claim land",
      outcomes: [
        {
          change: {money:+15},
          text: "You strike a promising spot and quickly gather gold."
        },
        {
          change: {money:+0},
          text: "The land looks promising—but yields nothing."
        }
      ]
    },
    {
      text: "Gather information",
      outcomes: [{
        change: {progress:+1, money:+5},
        text: "Careful planning pays off. You learn valuable tips and make a small profit."
      }]
    },
    {
      text: "Join a group",
      outcomes: [{
        change: {money:+8},
        text: "Working with others brings steady, if modest, returns."
      }]
    }
  ]
},

{
  text: "You pan for gold along a river.",
  image: "images/gold.png",
  choices: [
    {
      text: "Stop early",
      outcomes: [{
        change: {money:+0},
        text: "You give up too soon and walk away empty-handed."
      }]
    },
    {
      text: "Keep working",
      outcomes: [{
        change: {money:+10},
        text: "Your patience pays off—a small but satisfying find."
      }]
    },
    {
      text: "Sell quickly",
      outcomes: [{
        change: {money:+8},
        text: "You take a quick profit instead of risking more time."
      }]
    }
  ]
}

];

function updateStats() {
  document.getElementById("stats").innerText =
    `Health: ${gameState.health} | Gold: ${gameState.money} | Progress: ${gameState.progress}`;
}

function showEvent() {
  let event = events[currentEvent];

  document.getElementById("sceneImage").src = event.image;
  document.getElementById("eventText").innerText = event.text;

  let choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  document.getElementById("result").innerText = "";

  event.choices.forEach(choice => {
    let btn = document.createElement("button");
    btn.innerText = choice.text;
    btn.onclick = () => handleChoice(choice);
    choicesDiv.appendChild(btn);
  });

  updateStats();
}

function handleChoice(choice) {
  let outcome = choice.outcomes[Math.floor(Math.random() * choice.outcomes.length)];

  pendingResult = outcome;

  applyChange(outcome.change);
  showResult(outcome);
}

function applyChange(change) {
  gameState.health += change.health || 0;
  gameState.money += change.money || 0;
  gameState.progress += change.progress || 0;
}

function showResult(outcome) {
  document.getElementById("eventText").innerText = outcome.text;

  let effectText = "";

  if (outcome.change.health) effectText += `Health: ${outcome.change.health > 0 ? "+" : ""}${outcome.change.health}\n`;
  if (outcome.change.money) effectText += `Gold: ${outcome.change.money > 0 ? "+" : ""}${outcome.change.money}\n`;
  if (outcome.change.progress) effectText += `Progress: ${outcome.change.progress > 0 ? "+" : ""}${outcome.change.progress}`;

  document.getElementById("choices").innerHTML =
    `<button onclick="nextEvent()">Continue</button>`;

  document.getElementById("result").innerText = effectText;

  updateStats();
}

function nextEvent() {
  currentEvent++;

  if (gameState.health <= 0) {
    endGame("You did not survive the journey.");
    return;
  }

  if (currentEvent >= events.length) {
    endGame("You completed your journey!");
    return;
  }

  showEvent();
}

function endGame(message) {
  let code = `GR-${gameState.progress}-${gameState.health}-${gameState.money}-${Math.floor(Math.random()*1000)}`;

  document.getElementById("eventText").innerText = message;
  document.getElementById("choices").innerHTML = "";
  document.getElementById("result").innerText = "Completion Code: " + code;
}

showEvent();
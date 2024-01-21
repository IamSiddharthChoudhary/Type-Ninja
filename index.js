const RANDOM_QUOTE_API_URL = "https://api.quotable.io/random"; // Use https instead of http for secure connection
const timer = document.querySelector(".timer"); // Use querySelector to get the first element with the specified class
const quotes = document.querySelector(".quotes"); // Use querySelector to get the first element with the specified class
const textArea = document.querySelector(".textArea"); // Use querySelector to get the first element with the specified class
const result = document.querySelector(".result"); // Use querySelector to get the first element with the specified class

let startTime, endTime, totalTimeTaken, timerInterval;

textArea.addEventListener("input", () => {
  startTimer();
  const arrayQuote = quotes.querySelectorAll("span");
  const arrayValue = textArea.value.split("");

  let correct = true;
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];
    if (character == null) {
      characterSpan.classList.remove("correct", "incorrect");
      correct = false;
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else {
      characterSpan.classList.remove("correct");
      characterSpan.classList.add("incorrect");
      correct = false;
    }
  });

  if (correct) renderNewQuote();
});

function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then((response) => response.json())
    .then((data) => data.content);
}

async function renderNewQuote() {
  const quote = await getRandomQuote();
  quotes.innerHTML = "";
  quote.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    quotes.appendChild(characterSpan);
  });
  textArea.value = ""; // Clear the textarea when a new quote is rendered
}

function startTimer() {
  if (!startTime) {
    startTime = new Date();
    timerInterval = setInterval(() => {
      const elapsedTime = getTimerTime();
      if (elapsedTime >= 60) {
        clearInterval(timerInterval);
        endTyping();
      }
      timer.innerText = elapsedTime;
    }, 1000);
  }
}

function endTyping() {
  endTime = new Date();
  totalTimeTaken = (endTime - startTime) / 1000;

  calculateTime(totalTimeTaken);
}

function calculateTime(time_taken) {
  let totalWords = textArea.value.trim();
  let actualWords = totalWords === "" ? 0 : totalWords.split(" ").length;

  if (actualWords !== 0) {
    let typing_speed = (actualWords / time_taken) * 60;
    typing_speed = Math.round(typing_speed);
    result.innerHTML = `Your typing speed is ${typing_speed} words per minute & you wrote ${actualWords} words & time taken ${time_taken} seconds`;
  } else {
    result.innerHTML = `Your typing speed is 0 words per minute & time taken ${time_taken} seconds`;
  }
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

function main() {
  renderNewQuote();
}

main();

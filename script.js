const chatBody = document.getElementById('chatBody');
const userInput = document.getElementById('userInput');
const dateInput = document.getElementById('dateInput');

let state = 0;
let userData = {};

function displayMessage(message, isUser = false) {
  const div = document.createElement('div');
  div.className = 'message ' + (isUser ? 'user' : 'bot');
  div.textContent = message;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function handleUserInput() {
  const input = userInput.value.trim();
  if (!input) return;

  displayMessage(input, true);
  userInput.value = '';

  setTimeout(() => {
    nextStep(input);
  }, 600);
}

function nextStep(input) {
  switch (state) {
    case 0:
      userData.name = input;
      displayMessage("Hi " + input + "! From which city are you flying?");
      state++;
      break;
    case 1:
      userData.from = input.toUpperCase();
      displayMessage("Great! Where do you want to go?");
      state++;
      break;
    case 2:
      userData.to = input.toUpperCase();
      displayMessage("Please select your travel date:");
      userInput.style.display = "none";
      dateInput.style.display = "block";
      dateInput.focus();
      state++;
      break;
    case 3:
      // date handled separately
      break;
    case 4:
      const offers = getMockFlights(userData.from, userData.to, userData.date);
      let reply = `✈️ Lowest fares from ${userData.from} to ${userData.to} on ${userData.date}:\n\n`;
      offers.forEach((offer, i) => {
        reply += `${i + 1}. ${offer.airline} - ${offer.time} - Rs. ${offer.price}\n`;
      });
      displayMessage(reply);
      displayMessage("📱 Please enter your contact number:");
      state++;
      break;
    case 5:
      userData.contact = input;
      displayMessage("📞 Thank you! Our agent will contact you soon.");
      state++;
      setTimeout(resetBot, 6000);
      break;
  }
}

dateInput.addEventListener('change', () => {
  userData.date = dateInput.value;
  displayMessage(userData.date, true);
  dateInput.style.display = "none";
  userInput.style.display = "block";
  state++; // move to state 4
  nextStep(userData.date);
});

userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    handleUserInput();
  }
});

function getMockFlights(from, to, date) {
  const basePrices = [30000, 34000, 36500];
  const airlines = ["PIA", "AirBlue", "Serene Air"];
  const times = ["09:00 AM", "03:45 PM", "07:30 PM"];
  return basePrices.map((base, i) => ({
    airline: airlines[i],
    time: times[i],
    price: Math.round(base * 1.02)
  }));
}

function resetBot() {
  userData = {};
  state = 0;
  displayMessage("👋 Welcome to Murad International Travels!\nWhat's your name?");
}

// Start conversation
displayMessage("👋 Welcome to Murad International Travels!\nWhat's your name?");

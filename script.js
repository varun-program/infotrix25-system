// Event data
const events = [
  { name: "Code Contest", desc: "Competitive programming challenges", cat: "Technical" },
  { name: "Debugging", desc: "Find and fix bugs in code", cat: "Technical" },
  { name: "Paper Presentation", desc: "Present your research papers", cat: "Technical" },
  { name: "E-Sports (Free Fire)", desc: "Battle royale gaming tournament", cat: "Non-Technical" },
  { name: "Meme Time", desc: "Create the funniest memes", cat: "Non-Technical" },
  { name: "Poster Design", desc: "Design creative event posters", cat: "Non-Technical" },
];

// Render events
const grid = document.getElementById("eventsGrid");
function renderEvents(filter = "All") {
  grid.innerHTML = "";
  events
    .filter(e => filter === "All" || e.cat === filter)
    .forEach(e => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <h3>${e.name}</h3>
        <p>${e.desc}</p>
        <button class="btn-outline" data-event="${e.name}">Register Now</button>
      `;
      grid.appendChild(div);
    });
}
renderEvents();

// Tabs
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    renderEvents(tab.dataset.cat);
  });
});

// Scroll
function scrollToEvents() {
  document.getElementById("events").scrollIntoView({ behavior: "smooth" });
}

// Modal
const modal = document.getElementById("modalBackdrop");
const selectedEvent = document.getElementById("selectedEvent");
const amountText = document.getElementById("amountText");
let currentEvent = "";
let currentAmount = 200;

grid.addEventListener("click", e => {
  if (e.target.classList.contains("btn-outline")) {
    currentEvent = e.target.dataset.event;
    selectedEvent.textContent = currentEvent;
    modal.classList.remove("hidden");
    updateAmount();
  }
});

document.getElementById("cancelBtn").addEventListener("click", () => {
  modal.classList.add("hidden");
  document.getElementById("regForm").reset();
});

// Update dynamic amount
function updateAmount() {
  const m1 = document.getElementById("m1").value.trim();
  const m2 = document.getElementById("m2").value.trim();
  const m3 = document.getElementById("m3").value.trim();
  const count = [m1, m2, m3].filter(x => x).length;
  currentAmount = count === 1 ? 200 : count === 2 ? 400 : count >= 3 ? 500 : 200;
  amountText.textContent = `₹${currentAmount}`;
}
["m1","m2","m3"].forEach(id => document.getElementById(id).addEventListener("input", updateAmount));

// Razorpay integration
document.getElementById("regForm").addEventListener("submit", async e => {
  e.preventDefault();
  const teamName = document.getElementById("teamName").value;
  const m1 = document.getElementById("m1").value.trim();
  const m2 = document.getElementById("m2").value.trim();
  const m3 = document.getElementById("m3").value.trim();
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const modalStatus = document.getElementById("modalStatus");

  if (!m1) return alert("Please enter at least one member.");

  const options = {
    key: "YOUR_RAZORPAY_KEY_ID",
    amount: currentAmount * 100,
    currency: "INR",
    name: "INFOTRIX'25 Registration",
    description: currentEvent,
    handler: async function (response) {
      modalStatus.textContent = "Payment successful, saving registration...";
      try {
        await fetch("YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL", {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: currentEvent, teamName, m1, m2, m3, email, phone,
            payment_id: response.razorpay_payment_id, amount: currentAmount
          })
        });
        modalStatus.textContent = "Registration successful!";
      } catch {
        modalStatus.textContent = "Error saving registration.";
      }
    },
    prefill: { email, contact: phone },
    theme: { color: "#3efcb9" },
  };
  const rzp = new Razorpay(options);
  rzp.open();
});

// === Event Data ===
const events = [
  { name: "Tech Quiz", desc: "Dive into futuristic computing innovations.", img: "images/techquiz.jpeg" },
  { name: "AI Neural Network Workshop", desc: "Hands-on AI learning for next-gen engineers.", img: "images/wsh.jpeg" },
  { name: "Web Design", desc: "Create and innovate with real-time design challenges.", img: "images/web.jpeg" },
  { name: "E-Sports Arena", desc: "Battle in Free Fire tournaments.", img: "images/esports.jpeg" },
  { name: "Poster Design", desc: "Design stunning posters blending art & tech.", img: "images/poster.jpeg" },
  { name: "Debugging", desc: "Test your knowledge on emerging technologies.", img: "images/debug.jpeg" },
  { name: "Paper Presentation", desc: "Present your research on emerging technologies.", img: "images/paper.jpeg" },
  { name: "Code Contest", desc: "Compete to solve coding challenges efficiently.", img: "images/codecontest.jpeg" },
  { name: "MeMe Time", desc: "Show your creativity through memes.", img: "images/meme.jpeg" },
];

// === Render Events ===
const grid = document.getElementById("eventsGrid");
function renderEvents() {
  grid.innerHTML = "";
  events.forEach(e => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${e.img}" alt="${e.name}">
      <div class="card-content">
        <h3>${e.name}</h3>
        <p>${e.desc}</p>
        <button class="btn-outline" data-event="${e.name}">Register Now</button>
      </div>
    `;
    grid.appendChild(div);
  });
}
renderEvents();

// === Modal Logic ===
const modal = document.getElementById("modalBackdrop");
const selectedEvent = document.getElementById("selectedEvent");
const amountText = document.getElementById("amountText");
let currentEvent = "";
let currentAmount = 200;

// === Update Amount ===
function updateAmount() {
  const m1 = document.getElementById("m1").value.trim();
  const m2 = document.getElementById("m2").value.trim();
  const m3 = document.getElementById("m3").value.trim();
  const m4 = document.getElementById("m4") ? document.getElementById("m4").value.trim() : "";
  const count = [m1, m2, m3, m4].filter(Boolean).length || 1; // ensure at least 1 member counted

  if (currentEvent === "E-Sports Arena") {
    currentAmount = 200;
    amountText.textContent = `₹${currentAmount} (Team Fee)`;
  } else {
    if (count === 1) currentAmount = 200;
    else if (count === 2) currentAmount = 400;
    else currentAmount = 500;
    amountText.textContent = `₹${currentAmount}`;
  }
}

// === Add 4th Member Field for E-Sports ===
const m3Field = document.getElementById("m3");
function ensureFourthMemberField() {
  let m4Field = document.getElementById("m4");

  if (currentEvent === "E-Sports Arena") {
    if (!m4Field) {
      m4Field = document.createElement("input");
      m4Field.id = "m4";
      m4Field.type = "text";
      m4Field.placeholder = "Member 4 (optional)";
      m4Field.className = "member-input";
      m3Field.insertAdjacentElement("afterend", m4Field);
      m4Field.addEventListener("input", updateAmount);
    }
  } else if (m4Field) {
    m4Field.remove();
  }
}

// === Open Modal ===
grid.addEventListener("click", e => {
  if (e.target.classList.contains("btn-outline")) {
    currentEvent = e.target.dataset.event;
    selectedEvent.textContent = currentEvent;

    // Reset form and default price
    const form = document.getElementById("regForm");
    form.reset();
    const m4Field = document.getElementById("m4");
    if (m4Field) m4Field.remove();
    currentAmount = 200;
    amountText.textContent = `₹200`;

    ensureFourthMemberField();
    modal.classList.remove("hidden");
  }
});

// === Close Modal ===
document.getElementById("cancelBtn").addEventListener("click", () => {
  modal.classList.add("hidden");
  document.getElementById("regForm").reset();
  const m4Field = document.getElementById("m4");
  if (m4Field) m4Field.remove();
});

// === Live Update for Member Inputs ===
["m1", "m2", "m3"].forEach(id => document.getElementById(id).addEventListener("input", updateAmount));

// === Razorpay Integration ===
document.getElementById("regForm").addEventListener("submit", async e => {
  e.preventDefault();

  const teamName = document.getElementById("teamName").value;
  const m1 = document.getElementById("m1").value.trim();
  const m2 = document.getElementById("m2").value.trim();
  const m3 = document.getElementById("m3").value.trim();
  const m4 = document.getElementById("m4") ? document.getElementById("m4").value.trim() : "";
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
            event: currentEvent,
            teamName,
            m1,
            m2,
            m3,
            m4,
            email,
            phone,
            payment_id: response.razorpay_payment_id,
            amount: currentAmount,
          }),
        });
        modalStatus.textContent = "Registration successful!";
      } catch {
        modalStatus.textContent = "Error saving registration.";
      }
    },
    prefill: { email, contact: phone },
    theme: { color: "#9d4edd" },
  };
  const rzp = new Razorpay(options);
  rzp.open();
});

// === Smooth Scroll ===
function scrollToEvents() {
  document.getElementById("events").scrollIntoView({ behavior: "smooth" });
}

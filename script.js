// === Event List ===
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

// === Scroll to Events ===
function scrollToEvents() {
  document.getElementById("events").scrollIntoView({ behavior: "smooth" });
}

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
      </div>`;
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

grid.addEventListener("click", e => {
  if (e.target.classList.contains("btn-outline")) {
    currentEvent = e.target.dataset.event;
    selectedEvent.textContent = currentEvent;
    const form = document.getElementById("regForm");
    form.reset();

    const m3Field = document.getElementById("m3");
    let m4Field = document.getElementById("m4");
    if (currentEvent === "E-Sports Arena" && !m4Field) {
      m4Field = document.createElement("input");
      m4Field.id = "m4";
      m4Field.type = "text";
      m4Field.placeholder = "Member 4 (required)";
      m4Field.required = true;
      m3Field.insertAdjacentElement("afterend", m4Field);
    } else if (m4Field && currentEvent !== "E-Sports Arena") {
      m4Field.remove();
    }

    modal.classList.remove("hidden");
    amountText.textContent = "₹200";
  }
});

document.getElementById("cancelBtn").addEventListener("click", () => {
  modal.classList.add("hidden");
});

// === Form Submission ===
document.getElementById("regForm").addEventListener("submit", e => {
  e.preventDefault();

  const team = document.getElementById("teamName").value.trim();
  const m1 = document.getElementById("m1").value.trim();
  const m2 = document.getElementById("m2").value.trim();
  const m3 = document.getElementById("m3").value.trim();
  const m4 = document.getElementById("m4") ? document.getElementById("m4").value.trim() : "";
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  let formURL = "";

  if (currentEvent === "E-Sports Arena") {
    formURL = `https://docs.google.com/forms/d/e/1FAIpQLSd-KpkoOD41Dp3uxzoy5t10LTZea1CzEAqTElAyjMHVqNR2zA/viewform?usp=pp_url` +
      `&entry.2005620554=${encodeURIComponent(team)}` +
      `&entry.405610466=${encodeURIComponent(m1)}` +
      `&entry.1929489613=${encodeURIComponent(m2)}` +
      `&entry.1006516152=${encodeURIComponent(m3)}` +
      `&entry.1345636521=${encodeURIComponent(m4)}` +
      `&entry.1045781291=${encodeURIComponent(phone)}`;
  } else {
    formURL = `https://docs.google.com/forms/d/e/1FAIpQLSep1aw_VaaAXdW9D_fzY3q6KO4ePXGnABdPhtZkmiAlAiiFzA/viewform?usp=pp_url` +
      `&entry.2092238618=${encodeURIComponent(team)}` +
      `&entry.303522656=${encodeURIComponent(m1)}` +
      `&entry.1621350981=${encodeURIComponent(m2)}` +
      `&entry.1113186145=${encodeURIComponent(m3)}` +
      `&entry.1556369182=${encodeURIComponent(email)}` +
      `&entry.1269411362=${encodeURIComponent(phone)}` +
      `&entry.1587391020=${encodeURIComponent(currentEvent)}`;
  }

  window.open(formURL, "_blank");
  modal.classList.add("hidden");
});

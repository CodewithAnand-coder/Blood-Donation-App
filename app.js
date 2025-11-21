// 🌟 Donor Management App

let donors = [];

// 📥 Load donors from backend
function loadDonors() {
  fetch("http://localhost:5000/donors")
    .then(res => res.json())
    .then(data => {
      donors = data;
      displayDonors(donors);
    })
    .catch(err => console.error("Failed to load donors:", err));
}

// 🖼️ Display donors
function displayDonors(list) {
  const box = document.getElementById("donorList");
  box.innerHTML = "";

  document.getElementById("count").innerText = `${list.length} donors found`;

  let html = "";
  list.forEach(d => {
    html += `
      <div class="card">
        <h3>${d.name}</h3>
        <p class="phone">📞 ${d.phone}</p>
        <p class="blood">🩸 ${d.bloodGroup}</p>
      </div>
    `;
  });
  box.innerHTML = html;
}

// 🔍 Search by name
document.getElementById("search").addEventListener("keyup", e => {
  let text = e.target.value.toLowerCase();
  let filtered = donors.filter(d => d.name.toLowerCase().includes(text));
  displayDonors(filtered);
});

// 🩸 Filter by blood group
document.getElementById("filter").addEventListener("change", e => {
  let type = e.target.value;
  if (type === "All") displayDonors(donors);
  else displayDonors(donors.filter(d => d.bloodGroup === type));
});

// 📋 Form controls
function openForm() {
  document.getElementById("formBox").classList.remove("hidden");
}

function closeForm() {
  document.getElementById("formBox").classList.add("hidden");
}

// ➕ Add donor
function addDonor() {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const bloodGroup = document.getElementById("bloodGroup").value;

  if (!name || !phone || !bloodGroup) {
    showMessage("⚠️ Please fill all fields", "error");
    return;
  }

  const donor = { name, phone, bloodGroup };

  fetch("http://localhost:5000/add-donor", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(donor)
  })
  .then(res => {
    if (!res.ok) throw new Error("Server error while adding donor");
    return res.json(); // backend should return donor object or confirmation
  })
  .then(data => {
    showMessage(`✅ Donor "${data.name}" submitted successfully!`, "success");

    // Clear form fields
    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("bloodGroup").value = "All";

    closeForm();
    loadDonors();
  })
  .catch(err => {
    console.error("Failed to add donor:", err);
    showMessage("❌ Failed to submit donor. Please try again.", "error");
  });
}

// 📢 Show message (success/error banner)
function showMessage(text, type) {
  const msgBox = document.getElementById("messageBox");
  msgBox.innerText = text;
  msgBox.className = type; // CSS: .success {color: green}, .error {color: red}

  // Auto-hide after 3 seconds
  setTimeout(() => {
    msgBox.innerText = "";
    msgBox.className = "";
  }, 3000);
}

// 🚀 Initial load
loadDonors();

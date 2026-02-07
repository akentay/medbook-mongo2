const tableBody = document.getElementById("tableBody");
const authStatus = document.getElementById("authStatus");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");
const createForm = document.getElementById("createForm");

let isAuthed = false;
let editingId = null;

// ---------- HELPERS ----------
async function api(url, options = {}) {
  const res = await fetch(url, {
    credentials: "same-origin",   
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}


// ---------- AUTH ----------
async function checkAuth() {
  const { data } = await api("/api/auth/me");
  if (data.authenticated) {
    isAuthed = true;
    authStatus.textContent = "Logged in as " + data.user.email;
    loginForm.style.display = "none";
    logoutBtn.style.display = "inline-block";
    createForm.style.display = "block";
  } else {
    isAuthed = false;
    authStatus.textContent = "Not logged in";
    loginForm.style.display = "block";
    logoutBtn.style.display = "none";
    createForm.style.display = "none";
  }
  loadAppointments();
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { res } = await api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) return alert("Invalid credentials");
  checkAuth();
});

logoutBtn.addEventListener("click", async () => {
  await api("/api/auth/logout", { method: "POST" });
  checkAuth();
});

// ---------- CRUD ----------
async function loadAppointments() {
  const { data } = await api("/api/appointments");
  window.currentAppointments = data;
  tableBody.innerHTML = "";

  // FILTER + SORT
const statusFilter = document.getElementById("statusFilter")?.value || "all";
const sortBy = document.getElementById("sortBy")?.value || "newest";

let items = [...data];

// filter
if (statusFilter !== "all") {
  items = items.filter(a => a.status === statusFilter);
}

// sort by date
items.sort((a, b) => {
  const da = new Date(a.date);
  const db = new Date(b.date);
  return sortBy === "newest" ? db - da : da - db;
});

window.currentAppointments = items;



  items.forEach(item => {
    const tr = document.createElement("tr");

    const actions = isAuthed
  ? `
      <button onclick="startEdit('${item._id}')">Edit</button>
      <button class="danger" onclick="deleteAppointment('${item._id}')">Delete</button>
    `
  : `<span style="color:#888">Login to edit</span>`;


    tr.innerHTML = `
      <td>${item.patientName}</td>
      <td>${item.doctorName}</td>
      <td>${item.date}</td>
      <td>${actions}</td>
    `;

    tableBody.appendChild(tr);
  });
}

async function createAppointment() {
  const body = {
    patientName: document.getElementById("patientName").value,
    doctorName: document.getElementById("doctorName").value,
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
    department: document.getElementById("department").value,
    reason: document.getElementById("reason").value,
    status: document.getElementById("status").value,
    phone: document.getElementById("phone").value,
  };

  const url = editingId ? `/api/appointments/${editingId}` : "/api/appointments";
const method = editingId ? "PUT" : "POST";

const { res, data } = await api(url, {
  method,
  body: JSON.stringify(body),
});


  if (!res.ok) return alert(data.error || "Invalid data");
  cancelEdit();
  loadAppointments();
}


async function deleteAppointment(id) {
  const { res } = await api(`/api/appointments/${id}`, { method: "DELETE" });
  if (!res.ok) return alert("Unauthorized");
  loadAppointments();
}
function startEdit(id) {
  const row = window.currentAppointments.find(a => a._id === id);
  if (!row) return;

  editingId = id;

  document.getElementById("patientName").value = row.patientName;
  document.getElementById("doctorName").value = row.doctorName;
  document.getElementById("date").value = row.date;
  document.getElementById("time").value = row.time;
  document.getElementById("department").value = row.department;
  document.getElementById("reason").value = row.reason;
  document.getElementById("status").value = row.status;
  document.getElementById("phone").value = row.phone;

  document.getElementById("createBtn").textContent = "Update";
  document.getElementById("cancelEditBtn").style.display = "inline-block";
}

function cancelEdit() {
  editingId = null;

  document.getElementById("patientName").value = "";
  document.getElementById("doctorName").value = "";
  document.getElementById("date").value = "";
  document.getElementById("time").value = "";
  document.getElementById("department").value = "";
  document.getElementById("reason").value = "";
  document.getElementById("status").value = "";
  document.getElementById("phone").value = "";

  document.getElementById("createBtn").textContent = "Create";
  document.getElementById("cancelEditBtn").style.display = "none";
}


// START
checkAuth();

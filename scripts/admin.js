import {
  auth,
  db,
  collection,
  getDocs,
  query,
  orderBy,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "./firebase.js";

const ADMIN_EMAIL = "admin@deiufitness.com";

const loginSection = document.getElementById("loginSection");
const adminSection = document.getElementById("adminSection");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");
const refreshBtn = document.getElementById("refreshBtn");
const loginStatus = document.getElementById("loginStatus");
const bookingsList = document.getElementById("bookingsList");
const searchInput = document.getElementById("searchInput");

let cachedBookings = [];

function setLoginStatus(message, isError) {
  if (!loginStatus) return;
  loginStatus.textContent = message;
  loginStatus.style.color = isError ? "#ff6b6b" : "#a8ffbf";
}

function showLogin() {
  if (loginSection) loginSection.style.display = "block";
  if (adminSection) adminSection.style.display = "none";
  if (logoutBtn) logoutBtn.style.display = "none";
  if (refreshBtn) refreshBtn.style.display = "none";
}

function showAdmin() {
  if (loginSection) loginSection.style.display = "none";
  if (adminSection) adminSection.style.display = "block";
  if (logoutBtn) logoutBtn.style.display = "inline-flex";
  if (refreshBtn) refreshBtn.style.display = "inline-flex";
}

function formatDate(timestamp) {
  if (!timestamp) return "—";
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  } catch (error) {
    return "—";
  }
}

function trainingLabel(value) {
  switch (value) {
    case "in_person":
      return "In-person";
    case "online":
      return "Online";
    case "competition_prep":
      return "Competition prep";
    default:
      return "—";
  }
}

function renderBookings(list) {
  if (!bookingsList) return;
  if (!list.length) {
    bookingsList.innerHTML = "<p class=\"muted\">No bookings yet.</p>";
    return;
  }

  bookingsList.innerHTML = list
    .map((booking) => {
      return `
        <div class="booking-card">
          <h3>${booking.fullName || "Unnamed"}</h3>
          <div class="booking-meta">
            <div><span>Email:</span> ${booking.email || "—"}</div>
            <div><span>Phone:</span> ${booking.phone || "—"}</div>
            <div><span>Location:</span> ${booking.location || "—"}</div>
            <div><span>Training:</span> ${trainingLabel(booking.trainingType)}</div>
            <div><span>Experience:</span> ${booking.experience || "—"}</div>
            <div><span>Goals:</span> ${booking.goals || "—"}</div>
            <div><span>Availability:</span> ${booking.availability || "—"}</div>
            <div><span>Injuries:</span> ${booking.injuries || "—"}</div>
            <div><span>Instagram:</span> ${booking.instagram || "—"}</div>
            <div><span>Submitted:</span> ${formatDate(booking.createdAt)}</div>
          </div>
        </div>
      `;
    })
    .join("");
}

async function loadBookings() {
  if (!bookingsList) return;
  bookingsList.innerHTML = "<p class=\"muted\">Loading bookings...</p>";

  try {
    const snapshot = await getDocs(query(collection(db, "bookings"), orderBy("createdAt", "desc")));
    cachedBookings = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    renderBookings(cachedBookings);
  } catch (error) {
    console.error(error);
    bookingsList.innerHTML = "<p class=\"muted\">Unable to load bookings. Check your Firebase rules.</p>";
  }
}

function filterBookings() {
  if (!searchInput) return;
  const term = searchInput.value.trim().toLowerCase();
  if (!term) {
    renderBookings(cachedBookings);
    return;
  }

  const filtered = cachedBookings.filter((booking) => {
    return (
      (booking.fullName || "").toLowerCase().includes(term) ||
      (booking.email || "").toLowerCase().includes(term)
    );
  });

  renderBookings(filtered);
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    showAdmin();
    loadBookings();
  } else {
    showLogin();
  }
});

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setLoginStatus("", false);

    const password = document.getElementById("adminPassword")?.value || "";
    if (!password) {
      setLoginStatus("Enter the password.", true);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
      setLoginStatus("Logged in.", false);
    } catch (error) {
      console.error(error);
      setLoginStatus("Invalid password. Please try again.", true);
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
  });
}

if (refreshBtn) {
  refreshBtn.addEventListener("click", () => loadBookings());
}

if (searchInput) {
  searchInput.addEventListener("input", filterBookings);
}

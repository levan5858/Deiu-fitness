import { db, collection, addDoc, serverTimestamp } from "./firebase.js";

const form = document.getElementById("booking-form");
const statusEl = document.getElementById("booking-status");

function setStatus(message, isError) {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.style.color = isError ? "#ff6b6b" : "#a8ffbf";
}

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
      fullName: getValue("fullName"),
      email: getValue("email"),
      phone: getValue("phone"),
      location: getValue("location"),
      trainingType: getValue("trainingType"),
      experience: getValue("experience"),
      goals: getValue("goals"),
      availability: getValue("availability"),
      injuries: getValue("injuries"),
      instagram: getValue("instagram"),
      status: "new",
      sourceUrl: window.location.href,
      createdAt: serverTimestamp()
    };

    const requiredFields = [
      "fullName",
      "email",
      "phone",
      "location",
      "trainingType",
      "experience",
      "goals",
      "availability"
    ];

    for (const field of requiredFields) {
      if (!payload[field]) {
        setStatus("Please fill in all required fields.", true);
        return;
      }
    }

    const submitButton = form.querySelector("button[type=submit]");
    if (submitButton) submitButton.disabled = true;

    setStatus("Submitting your request...", false);

    try {
      await addDoc(collection(db, "bookings"), payload);
      form.reset();
      setStatus("Thank you! Your request was sent. We will contact you within 24 hours.", false);
    } catch (error) {
      console.error(error);
      setStatus("Something went wrong. Please try again in a moment.", true);
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

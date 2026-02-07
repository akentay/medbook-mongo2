const express = require("express");
const Appointment = require("../models/Appointment");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// helper validation
function validateAppointment(body) {
  const required = ["patientName", "doctorName", "date", "time", "department", "reason", "status", "phone"];
  for (const key of required) {
    if (!body[key] || String(body[key]).trim() === "") return `Missing field: ${key}`;
  }
  const allowed = ["scheduled", "completed", "cancelled"];
  if (!allowed.includes(body.status)) return "Invalid status";
  return null;
}

// ✅ PUBLIC: list
router.get("/", async (req, res) => {
  try {
    const items = await Appointment.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ PUBLIC: get one
router.get("/:id", async (req, res) => {
  try {
    const item = await Appointment.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.status(200).json(item);
  } catch (e) {
    res.status(400).json({ error: "Invalid id" });
  }
});

// 🔒 PROTECTED: create
router.post("/", requireAuth, async (req, res) => {
  try {
    const err = validateAppointment(req.body);
    if (err) return res.status(400).json({ error: err });

    const created = await Appointment.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 🔒 PROTECTED: update
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const err = validateAppointment(req.body);
    if (err) return res.status(400).json({ error: err });

    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Not found" });

    res.status(200).json(updated);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: "Invalid request" });
  }
});

// 🔒 PROTECTED: delete
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });

    res.status(200).json({ message: "Deleted" });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: "Invalid id" });
  }
});

module.exports = router;

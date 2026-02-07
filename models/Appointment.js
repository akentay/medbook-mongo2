const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true, trim: true },
    doctorName: { type: String, required: true, trim: true },
    date: { type: String, required: true },   // проще оставить string: "2026-02-02"
    time: { type: String, required: true },   // "14:30"
    department: { type: String, required: true, trim: true }, // Dental, Cardiology...
    reason: { type: String, required: true, trim: true },
    status: { type: String, required: true, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
    phone: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);

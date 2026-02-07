const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

// GET /api/auth/me
router.get("/me", (req, res) => {
  if (!req.session.user) return res.status(200).json({ authenticated: false });
  return res.status(200).json({ authenticated: true, user: req.session.user });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) {
      // ✅ generic error (no “user not found”)
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // ✅ Store ONLY non-sensitive data in session
    req.session.user = { id: user._id.toString(), email: user.email };

    return res.status(200).json({ message: "Logged in" });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    // Clear cookie
    res.clearCookie("sid");
    return res.status(200).json({ message: "Logged out" });
  });
});


module.exports = router;

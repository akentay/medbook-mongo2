require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const mongoose = require("mongoose");

const appointmentsRouter = require("./routes/appointments");
const authRouter = require("./routes/auth");

const app = express();


// ✅ Render/Reverse proxy fix (ВАЖНО для secure cookies)
app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (UI)
app.use(express.static(path.join(__dirname, "public")));

// ✅ Mongo connect (если у тебя уже есть — оставь своё, но подключение должно быть до session store)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ✅ Sessions
app.use(
  session({
    name: "sid", // cookie name (можешь оставить)
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      ttl: 60 * 60 * 24 * 7,
    }),
    cookie: {
      httpOnly: true, // ✅ required
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production", // ✅ recommended on Render (HTTPS)
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/appointments", appointmentsRouter);

// Default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Global error handler (чтобы app не падало)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open: http://localhost:${PORT}`);
});


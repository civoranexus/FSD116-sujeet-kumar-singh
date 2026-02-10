const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs"); // 👈 Ye add karna zaruri hai
const path = require("path");
const User = require("./models/User");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// 1. Serve static files from the React frontend build folder
app.use(express.static(path.join(__dirname, "build")));

const dbURI = process.env.MONGO_URI;

mongoose
  .connect(dbURI)
  .then(async () => {
    console.log("✅ MongoDB Atlas Cloud Connected Successfully...");

    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash("admin123", salt);
        const staffPassword = await bcrypt.hash("staff123", salt);
        const customerPassword = await bcrypt.hash("customer123", salt);

        await User.insertMany([
          { name: "Admin Sujeet", email: "admin@test.com", password: adminPassword, role: "admin" },
          { name: "Staff Member", email: "staff@test.com", password: staffPassword, role: "staff" },
          { name: "Customer Sujeet", email: "customer@test.com", password: customerPassword, role: "customer" },
        ]);
        console.log("⭐ Professional Default Users Created!");
      }
    } catch (err) {
      console.error("❌ Error creating default users:", err);
    }
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// 2. API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/inventory", require("./routes/inventory"));
app.use("/api/procurement", require("./routes/procurement"));
app.use("/api/batches", require("./routes/batch"));
app.use("/api/reports", require("./routes/reports"));
app.use("/api/sales", require("./routes/sales"));

// 3. SPA Fallback - Isse React ke routes online kaam karenge
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
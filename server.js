const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors());

// 🗄️ Connect to MongoDB
(async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/bloodDonor", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // stop server if DB fails
  }
})();

// 📋 Donor Schema
const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  bloodGroup: { type: String, required: true }
});

const Donor = mongoose.model("Donor", donorSchema);

// 📥 Get all donors
app.get("/donors", async (req, res) => {
  try {
    const donors = await Donor.find();
    res.json({ success: true, donors });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch donors" });
  }
});

// ➕ Add donor
app.post("/add-donor", async (req, res) => {
  try {
    const donor = new Donor(req.body);
    const savedDonor = await donor.save();
    res.json({ success: true, message: "Donor Added Successfully", donor: savedDonor });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message || "Failed to add donor" });
  }
});

// 🚀 Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

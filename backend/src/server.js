const express = require("express");
const cors = require("cors");
const analysisRoutes = require("./routes/analysisRoutes");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api", analysisRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
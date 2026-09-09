const express = require("express");
const cors = require("cors");
require("dotenv/config");

const appointmentRoutes = require("./routes/appointmentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const agendaRoutes = require("./routes/agendaRoutes");
const clientRoutes = require("./routes/clientRoutes");
const financeRoutes = require("./routes/financeRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const reportRoutes = require("./routes/reportRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  }),
);

app.use(express.json());

app.use("/", appointmentRoutes);
app.use("/", adminRoutes);
app.use("/", authRoutes);
app.use("/", agendaRoutes);
app.use("/", clientRoutes);
app.use("/", financeRoutes);
app.use("/", serviceRoutes);
app.use("/", reportRoutes);
app.use("/", settingsRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

import express from "express";
import taskRouter from "./src/routes/task.routes";
import userRouter from "./src/routes/user.routes";
import "dotenv/config";
import { initDB } from "./src/config/database";
const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.get("/api/", (req, res) => {
  res.status(200).send("Bienvenido a la api de tareas.");
});
app.use("/api", userRouter);
app.use("/api", taskRouter);

await initDB();
app.listen(PORT, () => {
  console.log(`Servidor corriendo el http://localhost:${PORT}/api`);
});
import express from "express";
import taskRouter from "./src/routes/task.routes.js";
import userRouter from "./src/routes/user.routes.js";
import "dotenv/config";
import { initDB } from "./src/config/database.js";
import user_role_router from "./src/routes/user_routes.routes.js";
import directionRouter from "./src/routes/direccion_principal.routes.js";
import rolesRouter from "./src/routes/roles.routes.js";
const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.get("/api/", (req, res) => {
  res.status(200).send("Bienvenido a la api de tareas.");
});
app.use("/api", userRouter);
app.use("/api", taskRouter);
app.use("/api", user_role_router);
app.use("/api", directionRouter);
app.use("/api", rolesRouter);

await initDB();

app.listen(PORT, () => {
  console.log(`Servidor corriendo el http://localhost:${PORT}/api`);
});
import {Router} from "express"
import { createDirection, getAllDirections, getDirectionById } from "../controllers/direccion_principal.controller.js";
const router = Router();

router.post("/direction", createDirection)
router.get("/direction", getAllDirections)
router.get("/direction/:id", getDirectionById)

export default router
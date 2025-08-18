import {Router} from "express"
import { getAllUsersAndRoles, relacionarUsersRoles } from "../controllers/user_roles.controller.js";
const router = Router();

router.post("/user-role", relacionarUsersRoles)
router.get("/user-role", getAllUsersAndRoles)
router.get("/user-role/:id", getAllUsersAndRoles)

export default router
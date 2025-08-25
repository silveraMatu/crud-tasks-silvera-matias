import { Router } from "express";
import {
  createDirection,
  deleteDirection,
  getAllDirections,
  getDirectionById,
  updateDirection,
} from "../controllers/direccion_principal.controller.js";
import {
  validationDireccionCreate,
  validationDireccionUpdate,
} from "../middlewares/direccion.validations.js";
import { applyValidations } from "../middlewares/applyValidations.js";
import { paramsValidation } from "../middlewares/params.validator.js";
const router = Router();

router.post(
  "/direction",
  validationDireccionCreate,
  applyValidations,
  createDirection
);

router.get("/direction", getAllDirections);

router.get(
  "/direction/:id",
  paramsValidation,
  applyValidations,
  getDirectionById
);
router.put(
  "/direction/:id",
  paramsValidation,
  validationDireccionUpdate,
  applyValidations,
  updateDirection
);
router.delete(
  "/direction/:id",
  paramsValidation,
  applyValidations,
  deleteDirection
);

export default router;

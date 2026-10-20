import { Router } from "express";
import usersController from "../controllers/usersController.js";

const router = Router();

router.get("/me", usersController.readMe);
router.put("/me", usersController.updateMe);
router.delete("/me", usersController.deleteMe);
router.get("/{:userId}", usersController.readUser);
router.put("/:userId", usersController.updateUser);
router.delete("/:userId", usersController.deleteUser);

export default router;
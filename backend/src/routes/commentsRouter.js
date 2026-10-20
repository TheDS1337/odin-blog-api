import { Router } from "express";
import commentsController from "../controllers/commentsController.js";

const router = Router({ mergeParams: true });

router.get("/{:commentId}", commentsController.readComment);
router.post("/", commentsController.createComment);
router.put("/:commentId", commentsController.updateComment);
router.delete("/:commentId", commentsController.deleteComment);

export default router;
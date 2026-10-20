import { Router } from "express";
import postsController from "../controllers/postsController.js";
import commentsRouter from "./commentsRouter.js";

const router = Router();

router.get("/{:postId}", postsController.readPost);
router.post("/", postsController.createPost);
router.put("/:postId", postsController.updatePost);
router.delete("/:postId", postsController.deletePost);
router.use("/:postId/comments", commentsRouter);

export default router;
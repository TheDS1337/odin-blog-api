import { Router } from "express";

const router = Router({ mergeParams: true });

// Add authorId and postId query parameters to /api/comments
router.get("/{:commentId}", (req, res) => res.status(200).json({ message: `User ${req.user.username} is trying to get comment ${req.params.commentId}.` }));
router.post("/", (req, res) => res.status(200).json({ message: `User ${req.user.username} is trying to add a new comment to the post ${req.params.postId}.` }));

// These are not mounted to api/posts/ as per recommended standards
router.put("/:commentId", (req, res) => res.status(200).json({ message: `User ${req.user.username} is trying to update comment ${req.params.commentId}.` }));
router.delete("/:commentId", (req, res) => res.status(200).json({ message: `User ${req.user.username} is trying to delete comment ${req.params.commentId}.` }));

export default router;
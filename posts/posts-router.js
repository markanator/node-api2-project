const express = require("express");
const db = require("../data/db");
const router = express.Router();

// routes go here

router.post("/api/posts", (req, res) => {
    // vibe check
    if (!req.body.title || !req.body.contents) {
        return res.status(400).json({
            message: "Please provide title and contents for the post.",
        });
    }
    // passed vibe check!
    db.insert(req.body)
        .then((post) => {
            res.status(201).json(post);
        })
        .catch((error) => {
            res.status(500).json({
                message:
                    "here was an error while saving the post to the database",
            });
        });
});

router.post("/api/posts/:id/comments", (req, res) => {
    const { id } = req.params;
    // comment in full
    const combinedComment = { ...req.body, post_id: id };

    db.findById(req.params.id)
        .then((post) => {
            // if returned value is empty array === no post exists
            if (!post) {
                res.status(404).json({
                    message: "there is no post with that id",
                    post,
                });
            } else {
                db.insertComment(combinedComment)
                    .then((comment) => {
                        if (comment) {
                            res.status(201).json({
                                message: "Created and posted!",
                                comment,
                            });
                        } else {
                            res.status(404).json({
                                message: "No post with that id",
                                comment,
                            });
                        }
                    })
                    .catch((error) => {
                        res.status(500).json({
                            message: "Server malfunction COMMENT STUFF",
                            error,
                        });
                    });
            }
        })
        .catch((postError) => {
            res.status(500).json({
                message: "Server malfunction POST ID",
                error,
            });
        });
});

router.get("/api/posts", (req, res) => {
    db.find()
        .then((posts) => {
            res.json(posts);
        })
        .catch((error) => {
            res.status(500).json({
                message: "The posts information could not be retrieved.",
            });
        });
});

router.get("/api/posts/:id", (req, res) => {
    db.findById(req.params.id)
        .then((post) => {
            if (post.length === 0) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist.",
                });
            }
            res.json(post);
        })
        .catch((error) => {
            res.status(500).json({
                message: "The post information could not be retrieved.",
            });
        });
});

router.get("/api/posts/:id/comments", (req, res) => {
    db.findPostComments(req.params.id)
        .then((comments) => {
            res.json(comments);
        })
        .catch((error) => {
            res.status(500).json({
                message: "The comments information could not be retrieved.",
            });
        });
});

router.delete("/api/posts/:id", (req, res) => {
    db.remove(req.params.id)
        .then((post) => {
            if (!post) {
                return res.status(404).json({
                    message: "The post with the specified ID does not exist.",
                });
            }

            res.status(200).json({
                message: "post deleted!",
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: "The post could not be removed.",
            });
        });
});

router.put("/api/posts/:id", (req, res) => {
    // vibe check
    if (!req.body.title || !req.body.contents) {
        return res.status(400).json({
            message: "Please provide title and contents for the post.",
        });
    }
    // passed vibe check!
    db.update(req.params.id, req.body)
        .then((post) => {
            if (!post) {
                return res.status(404).json({
                    message: "post not found!",
                });
            }
            res.status(200).json({
                message: "Post was edited successfully!",
            });
        })
        .catch((error) => {
            res.status(500).json({
                message:
                    "here was an error while saving the post to the database",
            });
        });
});

module.exports = router;

// post id
// foriegn key that links comments to posts

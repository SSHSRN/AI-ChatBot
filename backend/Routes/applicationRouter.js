const express = require("express");
const applicationController = require("../Controllers/applicationController");

const router = express.Router();

router.post("/ask", applicationController.get_text_response);
router.post("/image", applicationController.get_image_response);
router.post("/play", applicationController.play_akinator);
router.post("/issue", applicationController.create_issue);
router.post("/issue/assignee", applicationController.create_issue_with_assignee);

module.exports = router;
const { Router } = require("express");
const { viewProfile, editProfile, changePassword } = require("../controllers/profile");
const { userAuth } = require("../middlewares/auth");

const profileRouter = Router();
profileRouter.get("/view", userAuth, viewProfile);
profileRouter.patch("/edit", userAuth, editProfile);
profileRouter.put("/password", userAuth, changePassword);

module.exports = profileRouter;

import { Router } from "express";
import {
  createUser,
  getAuthUser,
  loginUser,
  logoutUser,
  resetPassword,
  sendResetPasswordEmail,
  verifyEmail,
} from "../controllers/auth.controller";

const authRouter = Router();
import { checkAuth } from "../middlewares/auth.middleware";
// login user
authRouter.post("/user", loginUser);
// create new user
authRouter.post("/new-user", createUser);
// get currently logged in user
authRouter.get("/user", checkAuth, getAuthUser);
// Log current user out
authRouter.delete("/user/session", checkAuth, logoutUser);
authRouter.post("/user/email", checkAuth, verifyEmail);
// forgot password
//send reset password code to email
authRouter.get("/user/password/:email", sendResetPasswordEmail);
// reset password
authRouter.put("/user/password/:email", resetPassword);
// refresh access token
authRouter.get("/access_token", (req, res) => {
  res.send("Login route");
});

export { authRouter as authRoutes };

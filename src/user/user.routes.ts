import { Router } from "express";
import UserController from "./user.controller";
import AuthMiddleware from "../auth/auth.middleware";

const userController = new UserController();
const userRouter: Router = Router();

userRouter.post("/signup", userController.saveUser);
userRouter.get(
	"/profile",
	AuthMiddleware.tokenValidation,
	userController.profile
);
/*userRouter.put(
	"/profile/change",
	AuthMiddleware.tokenValidation,
	userController.modifyUser
);*/

export default userRouter;

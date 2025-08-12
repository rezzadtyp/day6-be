import express, { json } from "express";
import cors from "cors";
import { appConfig } from "./config";
import { errorMiddleware } from "./middlewares/error.middleware";
import { UserRouter } from "./modules/user/user.router";
import { UserController } from "./modules/user/user.controller";
import { UserService } from "./modules/user/user.service";
import { PrismaService } from "./modules/prisma/prisma.service";
import { PasswordService } from "./modules/user/password.service";

export default class App {
  public app;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.errorHandler();
  }

  private configure(): void {
    const allowedOrigins = ["http://localhost:3000"];
    this.app.use(
      cors({
        origin: allowedOrigins,
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
      })
    );
    this.app.use(json());
  }

  private routes(): void {
    // User router & service & controller
    const userService = new UserService(
      new PrismaService(),
      new PasswordService()
    );
    const userController = new UserController(userService);
    const userRouter = new UserRouter(userController);

    // Health check
    this.app.get("/", (_, res) => {
      res.send("Hello World");
    });

    // User routes
    this.app.use("/user", userRouter.getRouter());
  }

  private errorHandler(): void {
    this.app.use(errorMiddleware);
  }

  public start(): void {
    this.app.listen(appConfig.port, () => {
      console.log(`Server is running on port ${appConfig.port}`);
    });
  }
}

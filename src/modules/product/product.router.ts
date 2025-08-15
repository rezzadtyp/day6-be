import { Router } from "express";
import { ProductController } from "./product.controller";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";

export class ProductRouter {
  private readonly router: Router = Router();

  constructor(private readonly productController: ProductController) {
    this.initRoutes();
  }

  private initRoutes = (): void => {
    this.router.get("/", this.productController.getProducts);
    this.router.post(
      "/",
      JwtMiddleware.verifyToken,
      this.productController.createProduct
    );
  };

  public getRouter(): Router {
    return this.router;
  }
}

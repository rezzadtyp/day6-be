import { Router } from "express";
import { ProductController } from "./product.controller";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";
import { uploader } from "../../utils/uploader";

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
      uploader("PROD", "/products").array("file", 1),
      this.productController.createProduct
    );
  };

  public getRouter(): Router {
    return this.router;
  }
}

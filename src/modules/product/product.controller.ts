import { NextFunction, Request, Response } from "express";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/product.dto";

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.productService.createProduct(
        req.user.id,
        req.body as CreateProductDto
      );

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = {
        take: parseInt(req.query.take as string) || 10,
        page: parseInt(req.query.page as string) || 1,
        sortBy: (req.query.sortBy as string) || "createdAt",
        sortOrder: (req.query.sortOrder as string) || "asc",
        search: (req.query.search as string) || "",
      };

      const result = await this.productService.getProducts(query);

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };
}

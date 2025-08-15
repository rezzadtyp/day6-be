import { Prisma } from "../../generated/prisma";
import { PaginationQueryParams } from "../../types/pagination.type";
import { ApiError } from "../../utils/api-error";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProductDto } from "./dto/product.dto";

interface IGetProductsQuery extends PaginationQueryParams {
  search?: string;
}

export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  createProduct = async (userId: string, body: CreateProductDto) => {
    const { name, price, stock } = body;

    const product = await this.prisma.product.findFirst({
      where: {
        name,
      },
    });

    if (product) {
      throw new ApiError("Product already exists", 400);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const newProduct = await this.prisma.product.create({
      data: {
        name,
        price,
        stock,
        userId: user.id,
      },
    });

    return {
      message: "Product created successfully",
      data: newProduct,
    };
  };

  getProducts = async (query: IGetProductsQuery) => {
    const { take, page, sortBy, sortOrder, search } = query;

    // where clause query for prisma
    const where: Prisma.ProductWhereInput = {};

    // kalau ada search, maka cari product dari name product lalu masukkan ke where clause
    if (search) {
      where.OR = [{ name: { contains: search, mode: "insensitive" } }];
    }

    // cari product dengan where clause dan query pagination
    const products = await this.prisma.product.findMany({
      where,
      include: {
        user: true,
      },
      skip: (page - 1) * take,
      take,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    // hitung total product tanpa where clause
    const total = await this.prisma.product.count();

    return {
      data: products,
      meta: {
        page,
        take,
        sortBy,
        sortOrder,
        total,
      },
    };
  };
}

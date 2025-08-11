import { ApiError } from "../../utils/api-error";
import { PrismaService } from "../prisma/prisma.service";
import { prismaExclude } from "../prisma/utils";
import { RegisterDto } from "./dto/register.dto";

export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  register = async (body: RegisterDto) => {
    const { email, name, password } = body;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError("Email already exists", 400);
    }

    return await this.prisma.user.create({
      data: {
        name,
        email,
        password,
      },
      select: prismaExclude("User", ["password"]),
    });
  };

  getUsers = async () => {
    const users = await this.prisma.user.findMany({
      select: prismaExclude("User", ["password"]),
    });

    return users;
  };
}

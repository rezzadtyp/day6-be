import { appConfig } from "../../config";
import { ApiError } from "../../utils/api-error";
import { PrismaService } from "../prisma/prisma.service";
import { prismaExclude } from "../prisma/utils";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { PasswordService } from "./password.service";
import jwt from "jsonwebtoken";

export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService
  ) {}

  login = async (body: LoginDto) => {
    // destructuring body
    const { email, password } = body;

    // cari user berdasarkan emailnya
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // jika user tidak ditemukan, throw error
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    // komparasi password yang diinput dengan password yang sudah dihash (database)
    const isPasswordValid = await this.passwordService.comparePassword(
      password,
      user.password
    );

    // jika password tidak valid, throw error
    if (!isPasswordValid) {
      throw new ApiError("Invalid password", 401);
    }

    // generate token dari jsonwebtoken (import jwt from jsonwebtoken)
    const token = jwt.sign({ id: user.id }, appConfig.jwtSecret, {
      expiresIn: "24h", // token akan expired dalam 24 jam
    });

    return {
      message: "Login success",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  };

  register = async (body: RegisterDto) => {
    const { email, name, password } = body;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError("Email already exists", 400);
    }

    const hashedPassword = await this.passwordService.hashPassword(password);

    return await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
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

  getUserById = async (id: string) => {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: prismaExclude("User", ["password"]),
    });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    return user;
  };

  getMe = async (id: string) => {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: prismaExclude("User", ["password"]),
    });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    return {
      message: "Retrieve me success",
      data: user,
    };
  };

  // login dulu (kalo udah ada register)
  // token yang dari login, buat header authorization /me
}

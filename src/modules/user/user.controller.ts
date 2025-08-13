import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

export class UserController {
  constructor(private readonly userService: UserService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.login(req.body as LoginDto);

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as RegisterDto;

      const result = await this.userService.register(body);

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.getUsers();

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.getUserById(
        req.params.id as string
      );

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.getMe(req.user.id as string);

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };
}

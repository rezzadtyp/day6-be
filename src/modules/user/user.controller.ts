import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import { RegisterDto } from "./dto/register.dto";

export class UserController {
  constructor(private readonly userService: UserService) {}

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
}

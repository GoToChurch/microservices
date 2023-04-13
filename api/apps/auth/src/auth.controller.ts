import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import {CommonService, CreateUserDto, RegistrationDto} from "@app/common";
import {Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";


@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService,
              private readonly commonService: CommonService) {}

  @MessagePattern({ cmd: 'get-all-users' })
  async getAllUsers(@Ctx() context: RmqContext) {
    this.commonService.acknowledgeMessage(context);
    console.log(111)

    return this.authService.getAllUsers();
  }

  @MessagePattern({ cmd: 'get-user' })
  async getUserById(
      @Ctx() context: RmqContext,
      @Payload() user: { id: number },
  ) {
    this.commonService.acknowledgeMessage(context);

    return this.authService.getUserById(user.id);
  }

  @MessagePattern({ cmd: 'edit-user' })
  async editUser(
      @Ctx() context: RmqContext,
      @Payload() payload: {user: CreateUserDto, id: number},
  ) {
    this.commonService.acknowledgeMessage(context);

    return this.authService.editUser(payload.user, payload.id);
  }

  @MessagePattern({ cmd: 'delete-user' })
  async deleteUser(
      @Ctx() context: RmqContext,
      @Payload() user: { id: number },
  ) {
    this.commonService.acknowledgeMessage(context);

    return this.authService.deleteUser(user.id);
  }

  @MessagePattern({ cmd: 'registration' })
  async registration(
      @Ctx() context: RmqContext,
      @Payload() newUser: RegistrationDto
  ) {
    this.commonService.acknowledgeMessage(context);

    return this.authService.registration(newUser);
  }

  @MessagePattern({ cmd: 'login' })
  async login(
      @Ctx() context: RmqContext,
      @Payload() user: CreateUserDto,
  ) {
    this.commonService.acknowledgeMessage(context);

    return this.authService.login(user);
  }
}

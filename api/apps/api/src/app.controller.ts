import {Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {CreateProfileDto, CreateUserDto, JwtAuthGuard, RegistrationDto} from "@app/common";
import {SelfProfileGuard} from "@app/common/guards/self_profile.guard";
import {SelfUserGuard} from "@app/common/guards/self_user.guard";

@Controller()
export class AppController {
    constructor(@Inject('AUTH') private readonly authService: ClientProxy,
              @Inject('PROFILE') private readonly profileService: ClientProxy) {}

    @Post('auth/login')
    async login(@Body() userDto: CreateUserDto) {
        return this.authService.send(
            {
              cmd: 'login',
            },
            {
                userDto
            },
        );
      }

    @Post('auth/registration')
    async register(@Body() registrationDto: RegistrationDto) {
        return this.authService.send(
            {
                cmd: 'registration',
            },
            {
                registrationDto
            },
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get('users')
    async getAllUsers() {
        return this.authService.send(
            {
                cmd: 'get-all-users',
            },
            {},
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get('users/:id')
    async getUser(@Param('id') id: any) {
        return this.authService.send(
            {
                cmd: 'get-user',
            },
            {
                id: id
            },
        );
    }

    @UseGuards(JwtAuthGuard, SelfUserGuard)
    @Put('users/:id')
    async editUSer(@Body() userDto: CreateUserDto,
                   @Param('id') id: any) {
        return this.authService.send(
            {
                cmd: 'edit-user',
            },
            {
                user: userDto,
                id: id
            },
        );
    }

    @UseGuards(JwtAuthGuard, SelfUserGuard)
    @Delete('users/:id')
    async deleteUser(@Param('id') id: any) {
        return this.authService.send(
            {
                cmd: 'delete-user',
            },
            {
                id: id
            },
        );
    }

    @UseGuards(JwtAuthGuard)
    @Post('profiles')
    async createProfile(@Body() profileDto: CreateProfileDto) {
        return this.profileService.send(
            {
                cmd: 'create-profile',
            },
            {
                profile: profileDto,
            },
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get('profiles')
    async getAllProfiles() {
        return this.profileService.send(
            {
                cmd: 'get-all-profiles',
            },
            {},
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get('profiles/:id')
    async getProfile(@Param('id') id: any) {
        return this.profileService.send(
            {
                cmd: 'get-profile',
            },
            {
                id: id
            },
        );
    }

    @UseGuards(JwtAuthGuard, SelfProfileGuard)
    @Put('profiles/:id')
    async editProfile(
        @Body() profileDto: CreateProfileDto,
        @Param('id') id: any
    ) {
        return this.profileService.send(
            {
                cmd: 'edit-profile',
            },
            {
                profile: profileDto,
                id: id
            },
        );
    }

    @UseGuards(JwtAuthGuard, SelfProfileGuard)
    @Delete('profiles/:id')
    async deleteProfile(@Param('id') id: any) {
        return this.profileService.send(
            {
                cmd: 'delete-profile',
            },
            {
                id: id
            },
        );
    }
}


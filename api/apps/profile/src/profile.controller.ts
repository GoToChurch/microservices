import { Controller } from '@nestjs/common';
import { ProfileService } from './profile.service';
import {CommonService} from "@app/common/services/common.service";
import {Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import {CreateProfileDto} from "@app/common";

@Controller()
export class ProfileController {
    constructor(private readonly profileService: ProfileService,
                private readonly commonService: CommonService) {}

    /*
         Эндпоинт для создания нового профиля.
         Доступен только зарегистрированому пользователю, являющемуся администратором.
         Обрабытвает Post запрос по адресу http://localhost:Port/profiles.
         Не должен использоваться, создан только для тестирования. Создание нового пользователя происходит
         по адресу http://localhost:Port/auth/registration.
         На вход принимает тело запроса типа CreateProfileDto 'profileDto' и изображение 'image'.
         Возвращает результат работы метода createProfile из ProfilesService.
      */
    @MessagePattern({ cmd: 'create-profile' })
    create(
        @Ctx() context: RmqContext,
        @Payload() newProfile: CreateProfileDto
    ) {
        this.commonService.acknowledgeMessage(context);

        return this.profileService.createProfile(newProfile)
    }

    /*
        Эндпоинт для получения списка всех профилей.
        Доступен только зарегистрированому пользователю, являющемуся администратором.
        Обрабытвает Get запрос по адресу http://localhost:Port/profiles.
        Возвращает результат работы метода getAllProfiles из ProfilesService.
     */
    @MessagePattern({ cmd: 'get-all-profiles' })
    async getAll(@Ctx() context: RmqContext) {
        this.commonService.acknowledgeMessage(context);

        return this.profileService.getAllProfiles();
    }

    /*
        Эндпоинт для получения профиля по id.
        Доступен только зарегистрированому пользователю, являющемуся администратором.
        Обрабытвает Get запрос по адресу http://localhost:Port/profiles/:id.
        На вход принимает параметр 'id' из url.
        Возвращает результат работы метода getProfileById из ProfilesService.
     */
    @MessagePattern({ cmd: 'get-profile' })
    async getOne(
        @Ctx() context: RmqContext,
        @Payload() profile: { id: number }
    ) {
        this.commonService.acknowledgeMessage(context);

        return this.profileService.getProfileById(profile.id);
    }

    /*
        Эндпоинт для редактированию профиля по его id.
        Доступен только зарегистрированому пользователю, который является владельцем профиля и администратору.
        Обрабытвает Put запрос по адресу http://localhost:Port/profiles/:id.
        На вход принимает тело запроса типа CreateUserDto 'userDto', параметр 'id' из url, объект http запроса 'request'
        для получения из него объекта активного пользователя и необизательный параметр файла 'image'.
        Возвращает результат работы метода editProfile из ProfilesService.
     */
    @MessagePattern({ cmd: 'edit-profile' })
    async edit(
        @Ctx() context: RmqContext,
        @Payload() payload: {profile: CreateProfileDto, id: number}
    ) {
        this.commonService.acknowledgeMessage(context);

        return this.profileService.editProfile(payload.profile, payload.id);
    }

    /*
        Эндпоинт для удаления профиля по его id.
        Доступен только зарегистрированому пользователю, который является владельцем профиля и администратору.
        Обрабытвает Delete запрос по адресу http://localhost:Port/profiles/:id.
        На вход принимает параметр 'id' из url, объект http запроса 'request'
        для получения из него объекта активного пользователя.
        Возвращает результат работы метода deleteProfile из ProfilesService.
     */
    @MessagePattern({ cmd: 'delete-profile' })
    async delete(
        @Ctx() context: RmqContext,
        @Payload() profile: { id: number }
    ) {
        this.commonService.acknowledgeMessage(context);

        return this.profileService.deleteProfile(profile.id);
    }

}

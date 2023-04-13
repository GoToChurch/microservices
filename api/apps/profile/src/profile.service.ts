import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {CreateProfileDto, Profile} from "@app/common";


@Injectable()
export class ProfileService {
    constructor(@InjectModel(Profile) private profileRepository: typeof Profile) {}

    /*
          Метод для создания нового профиля.
          На вход получает объект для создания нового текстового блока типа CreateProfileDto 'dto'
          и изображение 'image',
          которое сохраняет в таблице 'files' в базе данных, а также в директории 'static' на диске.
          Возвращает промис с созданным профилем.
      */
    async createProfile(dto: CreateProfileDto) {
        return await this.profileRepository.create(dto);
    }

    /*
        Метод для получения всех профилей из таблицы.
        Возвращает промис со списком всех профилей.
    */
    async getAllProfiles() {
        return await this.profileRepository.findAll({
          include: {
            all: true
          }
        });
    }

    /*
        Метод для получения профиля по уникальному идентификатору.
        На вход получает уникальный идентификатор 'id'.
        Возвращает промис с найденным по уникальному идентификатору профилем в таблице.
    */
    async getProfileById(id: number) {
        return await this.profileRepository.findByPk(id,{
          include: {
            all: true
          }
        });
    }

    /*
        Метод для изменения данных в таблице профиля по уникальному идентификатору.
        На вход получает объект для создания нового пользователя типа CreateProfileDto 'dto',
        уникальный идентификатор 'id' и необязательный параметр 'image'.
        Если указан параметр 'image', то записывает новый файл на диск и в базу данных
        и изменяет его в объекте текстового блока, а сторый файл удаляет.
        Возвращает промис с найденным по уникальному идентификатору профилем в таблице.
    */
    async editProfile(dto: CreateProfileDto, id: number) {
        await this.profileRepository.update({...dto}, {
          where: {
            id: id
          }
        });

        return await this.getProfileById(id);
    }

    /*
        Метод для удаления профиля из таблицы.
        На вход получает уникальный идентификатор 'id'.
        Возвращает промис с удаленным по уникальному идентификатору профилем в таблице.
    */
    async deleteProfile(id: number) {
        const profile = await this.getProfileById(id);

        return this.profileRepository.destroy({
          where: {
            id: id
          }
        });
    }
}

import {IsPhoneNumber, IsString} from "class-validator";


/*
    Класс, в котором описаны и валидируются поля, необходимые для создания нового профиля.
    name: Имя пользователя,
    surname: Фамилия пользователя,
    phoneNumber: Телефонный номер пользователя,
    address: Адрес пользователя.
 */
export class CreateProfileDto {
    @IsString({message: 'Должно быть строкой'})
    readonly name: string;

    @IsString({message: 'Должно быть строкой'})
    readonly surname: string;

    @IsString({message: 'Должно быть строкой'})
    @IsPhoneNumber('RU')
    readonly phoneNumber: string;

    @IsString({message: 'Должно быть строкой'})
    readonly address: string;
}
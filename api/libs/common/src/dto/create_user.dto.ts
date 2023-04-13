import {IsEmail, IsString, Length} from "class-validator";

/*
    Класс, в котором описаны и валидируются поля, необходимые для создания нового пользователя.
    login: Логин пользователя,
    email: Почтовый адрес пользователя,
    password: Пароль пользователя,
    profileId: Уникальный идентификатор профиля пользователя
 */
export class CreateUserDto {

    @IsString({message: 'Должно быть строкой'})
    readonly login: string;

    @IsString({message: 'Должно быть строкой'})
    @IsEmail({}, {message: "Некорректный email"})
    readonly email: string;

    @IsString({message: 'Должно быть строкой'})
    @Length(8, 16, {message: 'Не меньше 8 и не больше 16'})
    readonly password: string;


    readonly profileId: number;
}
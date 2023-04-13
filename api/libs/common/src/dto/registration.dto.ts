import {IsEmail, IsPhoneNumber, IsString, Length} from "class-validator";

export class RegistrationDto {
    @IsString({message: 'Должно быть строкой'})
    readonly login: string;

    @IsString({message: 'Должно быть строкой'})
    @IsEmail({}, {message: "Некорректный email"})
    readonly email: string;

    @IsString({message: 'Должно быть строкой'})
    @Length(8, 16, {message: 'Не меньше 8 и не больше 16'})
    readonly password: string;

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
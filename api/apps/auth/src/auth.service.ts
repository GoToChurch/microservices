import {
    Injectable,
    Inject,
    UnauthorizedException,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import {InjectModel} from "@nestjs/sequelize";
import {CreateProfileDto, CreateUserDto, Profile, RegistrationDto, User} from "@app/common";
import {ClientProxy} from "@nestjs/microservices";
import {lastValueFrom} from "rxjs";


@Injectable()
export class AuthService {

    constructor(@InjectModel(User) private userRepository: typeof User,
                @Inject('PROFILE') private readonly profileService: ClientProxy,
                private readonly jwtService: JwtService) {}

    async createUser(dto: CreateUserDto) {

        const user = await this.userRepository.create(dto);
        const profile = await lastValueFrom(this.profileService.send<Profile>({
                cmd: 'get-profile',
            },
            { id: dto.profileId },
            )
        );
        await this.setProfileForUser(user, profile)

        return user;
    }

    /*
        Метод для получения всех пользователей из таблицы.
        Возвращает промис со списком всех пользователей.
    */
    async getAllUsers() {
        return await this.userRepository.findAll({
            include: {
                all: true
            }
        });
    }

    /*
        Метод для получения пользователя по уникальному идентификатору.
        На вход получает уникальный идентификатор 'id'.
        Возвращает промис с найденным по уникальному идентификатору пользователем в таблице.
    */
    async getUserById(id: number) {
        return await this.userRepository.findByPk(id, {
            include: {
                all: true
            }
        });
    }

    /*
        Метод для получения пользователя по почтовому адресу.
        На вход получает почтовый адрес 'email'.
        Возвращает промис с найденным по почтовому адресу пользователем в таблице.
    */
    async getUserByEmail(email: string) {
        return await this.userRepository.findOne({
            where: {
                email: email
            },
            include: {
                all: true
            }
        });
    }

    /*
        Метод для получения пользователя по логину.
        На вход получает логин пользователя 'login'.
        Возвращает промис с найденным по логину пользователем в таблице.
    */
    async getUserByLogin(login: string) {
        return await this.userRepository.findOne({
            where: {
                login: login
            },
            include: {
                all: true
            }
        });
    }

    /*
        Метод для изменения данных в таблице пользователя по уникальному идентификатору.
        На вход получает объект для создания нового пользователя типа CreateUserDto 'dto'
        и уникальный идентификатор 'id'.
        Возвращает промис с найденным по уникальному идентификатору пользователем в таблице.
    */
    async editUser(dto: CreateUserDto, id: number) {
        const hashPassword = await this.hashPassword(dto.password);

        await this.userRepository.update({...dto, password: hashPassword}, {
            where: {
                id: id
            }
        });

        return this.getUserById(id);
    }

    /*
        Метод для удаления пользователя из таблицы.
        На вход получает уникальный идентификатор 'id'.
        Возвращает промис с удаленным по уникальному идентификатору пользователем в таблице.
    */
    async deleteUser(id: number) {
        return await this.userRepository.destroy({
            where: {
                id: id
            }
        });
    }

    private async setProfileForUser(user, profile): Promise<void> {
        if (user && profile) {
            await profile.$set('owner', user.id);
            await user.$set('profile', [profile.id]);
        }
    }

    /*
    Метод, отвещающий за регистрациию нового пользователя.
    Метод обращается к UsersService и ProfilesService для создания нового пользователя и его профиля соответственно.
    На вход принимает объект для регистрации нового пользователя типа RegistrationDto 'registrationDto' и
    изображение 'image'.
    Возваращает результат работы метода generateToken.
 */
    async registration(registrationDto: RegistrationDto) {
        await this.checkIfUserMayRegister(registrationDto);

        const hashPassword = await this.hashPassword(registrationDto.password);

        const profileDto: CreateProfileDto = {...registrationDto};

        const profile = await lastValueFrom(this.profileService.send<Profile>({
                cmd: 'create-profile',
            },
            { profileDto },
            )
        )
        const userDto : CreateUserDto = {...registrationDto, profileId: profile.id};
        const user = await this.createUser({...userDto, password: hashPassword});

        return this.generateToken(user);
    }

    /*
        Метод, отвещающий за вход пользователя.
        На вход принимает объект для создания нового пользователя типа CreateUserDto 'userDto'.
        Возваращает результат работы метода generateToken.
     */
    async login(userDto: CreateUserDto) {
        const user = await this.validateUser(userDto);
        return this.generateToken(user);
    }

    /*
        Метод, проверяющий, может ли быть зарегистрирован новый пользователь.
        На вход принимает объект для регистрации нового пользователя типа RegistrationDto 'registrationDto'.
        Возваращает пустой объект пользователя, если пользователя с указанным в 'registrationDto'
        почтовым адресом и логином не существует. В обратном случае бросает HttpException.
     */
    async checkIfUserMayRegister(registrationDto: RegistrationDto) {
        let userToRegister = await this.getUserByEmail(registrationDto.email);

        if(userToRegister) {
            throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST)
        }

        userToRegister = await this.getUserByLogin(registrationDto.login);
        if(userToRegister) {
            throw new HttpException('Пользователь с таким login уже существует', HttpStatus.BAD_REQUEST)
        }

        return userToRegister;
    }

    /*
        Метод, генерирующий jwt-токен.
        На вход принимает объект пользователя типа User 'user'.
        Возваращает объект, содержащий токен.
     */
    private async generateToken(user: User) {
        const payload = {
            id: user.id,
            login: user.login,
            email: user.email,
        }

        return {
            token: this.jwtService.sign(payload)
        }
    }

    /*
        Метод, проверяющий, существует ли указаный пользователь в базе данных.
        На вход принимает объект для создания нового пользователя типа CreateUserDto 'userDto'.
        Возваращает объект пользователя типа User, если пользователь с указанными в CreateUserDto
        почтовым адресом и логином есть в базе данных, а также введен правильный пароль.
        В обратном случае бросает UnauthorizedException.
     */
    private async validateUser(userDto: CreateUserDto) {
        let user = await this.getUserByEmail(userDto.email);
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);

        if(user && passwordEquals) {
            user = await this.getUserByLogin(userDto.login);

            if (user) {
                return user;
            }

            throw new UnauthorizedException({message: 'Пользователя с таким логином не существует'})
        }

        throw new UnauthorizedException({message: 'Неправильный email или пароль'})
    }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 6);
    }
}

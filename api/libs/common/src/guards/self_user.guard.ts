import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Observable} from "rxjs";

/*
    Guard, ограничивающий доступ к эндпоинту только владельцу аккаунта или администратору.
 */
@Injectable()
export class SelfUserGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    /*
        Метод, проверяющий, является ли активный пользователь владельцем аккаунта или администратором.
        В своем теле обращается к объекту запроса и помещает в его тело объект пользователя, если в заголовках
        запроса был найден валидный Bearer token.
        Возвращает true, если у пользователя есть роль администратора или он является владельцем аккаунта.
        В обратном случае бросаает HttpException
     */
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const req = context.switchToHttp().getRequest();
            const authHeader = req.headers.authorization;
            const [bearer, token] = authHeader.split(' ');

            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({message: 'Пользователь не авторизован'})
            }

            const user = this.jwtService.verify(token);
            req.user = user;

            if (user.id !== req.params.id) {
                throw new HttpException( 'Нет доступа', HttpStatus.FORBIDDEN);
            }

            return true;
        } catch (e) {
            throw new HttpException( 'Нет доступа', HttpStatus.FORBIDDEN)
        }
    }
}
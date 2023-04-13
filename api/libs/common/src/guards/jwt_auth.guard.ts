import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";


/*
    Guard, ограничивающий доступ к эндпоинту только зарегестрированным пользователям.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    /*
        Метод, проверяющий наличие Bearer token'а в запросе.
        В своем теле обращается к объекту запроса и помещает в его тело объект пользователя, если в заголовках
        запроса был найден валидный Bearer token и возвращает true.
        В обратном случае бросает UnauthorizedException.
     */
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const req = context.switchToHttp().getRequest();
            const authHeader = req.headers.authorization;
            const [bearer, token] = authHeader.split(' ');

            if(bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({message: 'Пользователь не авторизован'})
            }

            req.user = this.jwtService.verify(token);

            return true;
        } catch (e) {
            throw new UnauthorizedException({message: 'Пользователь не авторизован'})
        }
    }

}
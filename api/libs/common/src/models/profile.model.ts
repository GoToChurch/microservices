import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "./user.model";


/*
    Интерфейс с необходимыми полями для создания новой записи в таблице 'profiles'.
 */
interface ProfileCreationAttrs {
    name: string;
    surname: string;
    phoneNumber: string;
    address: string;
}

/*
    Описание тадлицы 'profiles' в базе данных.
    Связь между таблицами 'users' и 'profiles': One-to-One.
    Связь между таблицами 'profiles' и 'files': One-to-One.
 */
@Table({tableName: 'profiles'})
export class Profile extends Model<Profile, ProfileCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @Column({type: DataType.STRING, allowNull: false})
    surname: string;

    @Column({type: DataType.STRING, allowNull: false})
    phoneNumber: string;

    @Column({type: DataType.STRING, allowNull: false})
    address: string;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;

    @BelongsTo(() => User)
    owner: User;
}
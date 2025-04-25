import {
  Column,
  DataType,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'Id' })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @Column({ type: DataType.STRING })
  declare fullName: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare profilePicture: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare isVerified: boolean;
}

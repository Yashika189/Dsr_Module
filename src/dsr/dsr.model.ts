import {
    Column,
    DataType,
    Model,
    Table,
    ForeignKey,
    BelongsTo,
  } from 'sequelize-typescript';
  import { User } from '../users/user.model';
  
  @Table
  export class Dsr extends Model {
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number;
  
    @Column({ type: DataType.STRING })
    content: string;
  
    @Column({ type: DataType.INTEGER })
    hours: number;
  
    @BelongsTo(() => User)
    user: User;
  }
  
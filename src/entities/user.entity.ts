import { ObjectId } from "mongodb";
import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity()
export class User{
    @ObjectIdColumn()
    id: ObjectId;
    @Column()
    user: string;
    @Column()
    password: string;
    @Column()
    email: string
}
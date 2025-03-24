import { ObjectId } from "mongodb";
import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity()
export class User{
    @ObjectIdColumn()
    id: ObjectId;
    @Column()
    name: string;
    @Column()
    password: string;
    @Column()
    repassword: string;
    @Column()
    email: string
}
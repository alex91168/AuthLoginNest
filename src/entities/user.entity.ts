import { ObjectId } from "mongodb";
import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity()
export class User{
    @ObjectIdColumn()
    id: ObjectId;
    @Column()
    userId: string;
    @Column()
    user: string;
    @Column()
    password: string;
    @Column()
    email: string;
    @Column()
    role: string;
    @Column()
    status: string;
    @Column()
    validationToken? : string;
}



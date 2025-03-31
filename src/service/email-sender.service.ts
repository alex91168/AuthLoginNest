import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";


@Injectable()
export class EmailSenderService {
    constructor(@InjectQueue('emailsender-queue') private emailQueue: Queue){}
    
    async sendEmailQueue(userEmail: string, validationToken: string){
        await this.emailQueue.add('send-email', {userEmail, validationToken});
    }

}
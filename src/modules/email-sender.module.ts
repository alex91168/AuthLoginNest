import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { EmailQueue } from 'src/queues/email.queue';
import { EmailSenderService } from 'src/service/email-sender.service';

@Module({
    imports: [
        BullModule.forRoot({
            redis: {
                host: 'localhost',
                port: 6379,
            },
        }),
        BullModule.registerQueue({ name: 'emailsender-queue'})
    ],
    providers: [EmailQueue, EmailSenderService],
    exports: [EmailSenderService]
})
export class EmailSenderModule {}

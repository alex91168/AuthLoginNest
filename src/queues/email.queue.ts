import { Process, Processor } from "@nestjs/bull";
import { Job } from "bullmq";
import * as nodemailer from 'nodemailer';
import { emailValidationModel } from "src/models/emailModel";

@Processor('emailsender-queue')
export class EmailQueue {

    @Process('send-email')
    async sendEmail(job: Job) {
        const { userEmail, validationToken } = job.data;

        const user = await nodemailer   .createTestAccount();

        const config = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, 
            auth: {
                user: user.user, 
                pass: user.pass, 
            },
        })
        
        const emailModel = emailValidationModel(validationToken);
        
        const info = await config.sendMail({
            from: '"teste" <nome@gmail.com>',
            to: userEmail,
            subject: "Ativar conta",
            text: `${emailModel.text}\n\n${emailModel.link}`,
            html: `<p>${emailModel.text}</p><br><p><a href="${emailModel.link}">Clique aqui para acessar</a></p>`
        });
        
        try {
            const response = nodemailer.getTestMessageUrl(info);
            console.log({message: "Resposta", response});
        } catch (err) {
            console.log("Erro no envio", err.message);
            //return ({message: "Erro ao enviar", err }) //Criar log
        } 
        
    }

}
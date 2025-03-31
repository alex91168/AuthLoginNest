import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { emailValidationModel } from 'src/models/emailModel';

@Injectable()
export class EmailSenderService {

    private async createAccount (): Promise<any> {
        try {
            const account = await nodemailer.createTestAccount();
            return account;
        } catch (err) {
            console.log(err);
        }
    }

    async sendEmail (validationToken: string, userEmail: string): Promise<any> {
        const user = await this.createAccount();

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
            return({message: "Resposta", response});
        } catch (err) {
            console.log("Erro no envio", err.message);
            //throw new Error("Erro durante o envio de email", err);
            return ({message: "Erro ao enviar", err }) //Criar log
        } 

    }
}

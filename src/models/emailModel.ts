export function emailValidationModel (validationToken: string) {
    const linkActivation = `http://localhost:3000/auth/authenticate/${validationToken}`;
    
    const emailBody = {
       text: "Sua conta foi criada com sucesso. Agora acesse o link abaixo para ativar-lá.",
       link: linkActivation
    };
    //https, www.site.com/local
    //http, localhost:port/endpoint

    return emailBody;
}
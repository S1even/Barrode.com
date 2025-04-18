module.exports.signUpErrors = (err) => {
    let errors = { pseudo: '', email: '', password: '' }

    if (err.message.includes('pseudo'))
        errors.pseudo = "Le pseudo doit faire 3 carractères minimum";

    if (err.message.includes('email'))
        errors.email = 'Email incorrect';

    if (err.message.includes('password'))
        errors.password = 'Le mot de passe doit faire 6 caractères minimum'

    if (err.code === 11000) {
        if (err.keyPattern && err.keyPattern.email) {
            errors.email = 'Cet email est déjà enregistré';
        }
        if (err.keyPattern && err.keyPattern.pseudo) {
            errors.pseudo = 'Ce pseudo est déjà pris';
        }
    }

    return errors
}

module.exports.signInErrors = (err) => {
    let errors = { email: '', password: ''}

    if (err.message.includes("email"))
        errors.email = "Email inconnu";
    
    if (err.message.includes("password"))
        errors.password = "Le mot de passe ne correspond pas"

    return errors;
}

module.exports.uploadErrors = (err) => {
    let errors = { format: "", maxSize: "" };

    if (!err || !err.message) return errors;

    if (err.message.includes("invalid file"))
        errors.format = "Format incompatible (jpg, jpeg ou png)";

    if (err.message.includes("max size"))
        errors.maxSize = "Le fichier dépasse 500Ko";

    return errors;
}

module.exports.uploadErrors = (err) => {
    let errors = { format: '', maxSize: ""};
    
    if (err.message.includes('invalid file'))
        errors.format = "Format incompatible";

    if (err.message.includes('max size'))
        errors.maxSize = "Le fichier dépose 1Mo";

    return errors;
}
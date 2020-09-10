const bcCrypt = require('bcryptjs');
const helpers = {};

helpers.encryptPasswords = async (pass) =>{
    const salt = await bcCrypt.genSalt(10); //sal para el cifrado de la contraseña (10 digitos)
    const hashPass = await bcCrypt.hash(pass, salt);
    return hashPass;
}

helpers.login= async (password, savePassword)=>{
  try {
    return await bcCrypt.compare(password, savePassword);// compara la contraseña almacenada en la db
  } catch (err) {
    console.log("El error es:" + err);
  }
}
module.exports = helpers;
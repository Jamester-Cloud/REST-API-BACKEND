require('dotenv').config();
const app = require('./app');
require('./database');

// esto se ve mucho en java y en C#
async function  main(){
   await app.listen(app.get('port'));
   console.log("Server on port" , app.get('port'));
}
// ejecucion de la funcion principal
main();



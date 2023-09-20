const mysql = require("mysql");

let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "db_14_express",
});

connection.connect(function (error) {
    if(!!error){
         console.log(error);    
    }else{
        console.log('Koneksi Sukses');
    }
});

module.exports = connection;
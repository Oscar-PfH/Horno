const mysql = require('mysql'); // mysql connection

const connection = mysql.createConnection({
                    host: 'localhost',
                    user: 'root',
                    password: '',
                    database: 'horno',
                    port: 3306
                });

connection.connect(function(error) {
    if (error) {
        throw error;
    }
    else {
        /*connection.query('SELECT * FROM clientes', function (error, result, fields) {
            if (error) throw error;
            console.log(result);
        });*/
        console.log('conexion correcta');
    }
});

function getConnection() {
    return connection;
}

module.exports = {getConnection}
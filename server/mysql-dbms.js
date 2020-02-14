var mysql = require('mysql')

function call(connection, dbname) {
    //function or procedure
    return (type, func, callback) => {  
        if(type !== 'function' && type !== 'procedure') {
            throw 'Invalid call type'
        }

        connection.query(`${type == 'function'? 'select':'call'} ${dbname}.${func}`, (err, result) => {
            if(result !== undefined) {
                result = result[0]
                if(type === 'function') {
                    result = result[Object.keys(result)[0]]
                }
            }
            callback(err, result)
        })
    }
}

class MYSQL_DBMS {
    constructor(user, password) {
        this.connInfo = {
            host: 'localhost',
            port: 3306,
            user: user,
            password: password,
            database: 'mydb',
            dateStrings: true
        }
        this.conn = mysql.createConnection(this.connInfo)
    }

    connect(callback) {
        this.conn.connect(err => {
            callback(call(this.conn, this.connInfo.database), err)
        })
    }

    resume(callback) {
        callback(call(this.conn, this.connInfo.database))
    }
}

module.exports.MYSQL_DBMS = MYSQL_DBMS;
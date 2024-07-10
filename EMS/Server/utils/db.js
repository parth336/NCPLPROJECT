
const config = {
    user: 'emsadmin', // better stored in an app setting such as process.env.DB_USER
    password: 'Parth*123', // better stored in an app setting such as process.env.DB_PASSWORD
    server: 'ncplproject.database.windows.net', // better stored in an app setting such as process.env.DB_SERVER
    port: 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
    database: 'employeems', // better stored in an app setting such as process.env.DB_NAME
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
}




export default config;


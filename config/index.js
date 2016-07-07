module.exports = {
    service: {
        bind: process.env.IP || "0.0.0.0"
    },
    database: {
        url: "mongodb://127.0.0.1/develop"
    },
    api: {
        port: parseInt(process.env.PORT, 10) || 3000
    },
    ux: {
        port: parseInt(process.env.PORT, 10)+1 || 3100
    }
};
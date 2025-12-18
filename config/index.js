require('dotenv').config();

module.exports = Object.assign({}, {
    server: {
        port: process.env.PORT || 49003,
        env: process.env.NODE_ENV || "development",
        ssl: {
            key: process.env.SSLPATH_KEY || "",
            cert: process.env.SSLPATH_CERT || ""
        }
    },
    db: {
      devDb: {
        server: process.env.DB_SERVER_NAME || 'localhost',
        port: process.env.DB_PORT || 27017,
        username: process.env.DB_USERNAME || "",
        password: process.env.DB_PASSWORD || "",
        dbName: process.env.DB_NAME || "atto_timesheet",
        uri: process.env.DB_URI || "mongodb://localhost:27017/atto_timesheet",
        type: process.env.DB_TYPE || "mongodb"
      },
      serverDb: {
        server: process.env.DB_SERVER_NAME || "cluster",
        port: process.env.DB_PORT || "27017",
        username: process.env.DB_USERNAME || "attotimesheet",
        password: process.env.DB_PASSWORD || "COte4q4K3GikoXxr",
        dbName: process.env.DB_NAME || "test",
        uri: process.env.DB_URI || "mongodb+srv://chaitanyadhayarkar005_db_user:JoVECsF75xrSMgTy@cluster0.877qnji.mongodb.net/?appName=Cluster0",
        type: process.env.DB_TYPE || "mongodb"
      }
    },
    mail: {
      username: process.env.MAIL_USER || "",
      password: process.env.MAIL_PASS || "zokojqlywlisbvqq",
      host: process.env.MAIL_HOST || "",
      port: process.env.MAIL_PORT || 587
    },
    siteHeader: process.env.SITE_HEADER || "https",
    keys: {
      secret: process.env.SECRET || "time_app",
      key: process.env.KEY || "sheet_app"
    },
    userSession: {
      maxAge: process.env.SESSION_AGE || 43200000
    },
    redis: {
      server: process.env.REDIS_SERVER,
      port: process.env.REDIS_PORT,
      expiry: process.env.REDIS_EXPIRY || 600,
      encrypt: process.env.REDIS_ENCRYPT || "",
      retryDelay: process.env.REDIS_RETRY_DELAY || 3000,
      retryAttempts: process.env.REDIS_RETRY_ATTEMPTS || 300,
      delay: process.env.REDIS_DELAY || 200,
      maxAttempts: process.env.REDIS_MAX_ATTEMPTS || 3,
      minDelay: process.env.REDIS_MIN_DELAY || 200,
      maxDelay: process.env.REDIS_MAX_DELAY || 400,
      clearInternalRedis: process.env.CLEAR_REDIS ? process.env.CLEAR_REDIS === 'true' : true
    },
    log: {
      logLevel: process.env.LOG_LEVEL || 0
    },
    roles: {
      admin: process.env.ADMIN || 1,
      employee: process.env.EMPLOYEE || 2
    },
    timezone: process.env.TIMEZONE || "Asia/Kolkata",
    admin: {
        email: process.env.SYS_ADMIN_EMAIL || "sysadmin@system.com",
        password: process.env.SYS_ADMIN_PASSWORD || "asdf@123",
        firstName: process.env.FIRSTNAME || "system",
        lastName: process.env.LASTNAME || "admin",
        phone: process.env.PHONE || 9876543210,
        role: process.env.ROLE || "admin"
    }
})

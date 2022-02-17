module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "txaw3zs",
  DB: "memestone_dev",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

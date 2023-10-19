import mysql2, { PoolOptions } from "mysql2";

//init connection
export const createConnection = () => {
  try {
    return mysql2.createPool({
      host: "localhost",
      user: "root",
      password: "12345678",
      database: "hackathonbs",
      port: 3306,
    } as PoolOptions);
  } catch (error) {
    console.error(error);
  }
};
import bodyParser from "body-parser";
import express, { Express } from "express";
import morgan from "morgan";
import cors from "cors";
import {createConnection} from "./utils/database.config"
import { Pool } from "mysql2/typings/mysql/lib/Pool";
const app: Express = express();
const connection = createConnection() as Pool;

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use(morgan("dev"));

app.get("/api/v1/todo",async (req,res)=>{
    try {
        const [rows, fields] = await connection.promise().execute("SELECT * FROM todo");
        console.log(rows);
        
        res.status(200).json(rows);
      } catch (error) {
        res.json(error);
      }
})

app.post("/api/v1/todo", async (req, res) => {
    const { task } = req.body;
    console.log(task);
    try {
      await connection.promise().execute("INSERT INTO todo(task) VALUES(?)", [
        task,
      ]);
      res.status(201).json({
        message: "Add new task successfully",
        status: "success",
      });
    } catch (error) {
      res.json(error);
    }
  });

  app.delete("/api/v1/todo/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await connection.execute("DELETE FROM todo where id=?", [id]);
      res.status(200).json({
        message: "Delete task successfully",
      });
    } catch (error) {
      res.json(error);
    }
  });

  app.put("/api/v1/todo/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        const [rows, fields] = await connection.promise().execute("SELECT * FROM todo WHERE id=?",[id]);
        let change:number=0;
       
        if (Array.isArray(rows) && rows.length > 0) {
            const row = rows[0] as {id:number,task:string, status: number };
            change = row.status===1?0:1;
        } else {
            console.log("No rows found.");
        }
        
      await connection.promise().execute("UPDATE todo SET status=? WHERE id=?", [change,id]);
      res.status(200).json({
        message: "Update task successfully",
        status: "success",
      });
    } catch (error) {
      res.json(error);
    }
  });

app.listen(3000,()=>{
    console.log("app listening at http://localhost:3000")
})
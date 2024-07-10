import sql from 'mssql'
import express from 'express'
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

const router = express.Router()

router.post("/employee_login", (req, res) => {
    const query = `SELECT * from employee Where email = '${req.body.email}'`;
    sql.connect(con,(err)=>{
      if (err) return res.json({ loginStatus: false, Error: "Query error" });
      sql.query(query,(err,result) => {

        result = result.recordset;
        if (result.length > 0) {
          bcrypt.compare(req.body.password, result[0].password, (err, response) => {
              if (err) return res.json({ loginStatus: false, Error: "Wrong Password" });
              if(response) {
                  const email = result[0].email;
                  const token = jwt.sign(
                      { role: "employee", email: email, id: result[0].id },
                      "jwt_secret_key",
                      { expiresIn: "1d" }
                  );
                  res.cookie('token', token)
                  return res.json({ loginStatus: true, id: result[0].id });
              }
          })
          
        } else {
            return res.json({ loginStatus: false, Error:"wrong email or password" });
        }
      })
    })
    
    });

  router.get('/detail/:id', (req, res) => {
    const id = req.params.id;
    const query = `SELECT * FROM employee where id = ${id}`
    sql.connect(con,(err)=>{
      if (err) return res.json({ Status: false, Error: "Query Error" + err });
      sql.query(query,(err,result)=>{
        if (err) return res.json({ Status: false, Error: "Query Error" + err });
      return res.json(result.recordset);  
      })
    })
  })

  router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
  })

  export {router as EmployeeRouter}
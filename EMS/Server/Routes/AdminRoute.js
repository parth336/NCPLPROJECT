import sql from "mssql";
import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";

const router = express.Router();

router.post("/adminlogin", (req, res) => {
  const query = `SELECT * from admin Where email = '${req.body.email}' and password = '${req.body.password}'`;
  sql
    .connect(con)
    .then(() => {
      return sql.query(query);
    })
    .then((result) => {
        var records = result.recordset
      if (records.length > 0) {
        const email = records[0].email;
        const token = jwt.sign(
          { role: "admin", email: email, id: records[0].id },
          "jwt_secret_key",
          { expiresIn: "1d" }
        );
        res.cookie("token", token);
        return res.json({ loginStatus: true });
      } else {
        return res.json({
          loginStatus: false,
          Error: "wrong email or password",
        });
      }
    })
    .catch((err) => {
        console.log(err)
        return res.json({ loginStatus: false, Error:"Server Error" });
    });
});

router.get("/category", (req, res) => {
  const query = "SELECT * FROM category";
  sql
  .connect(con)
  .then(() => {
    return sql.query(query);
  }).then((result)=>{
    return res.json({ Status: true, Result: result.recordset });
  }).catch((err)=>{
    es.json({ Status: false, Error: "Query Error" });
  })
});

router.post("/add_category", (req, res) => {
  const query = `INSERT INTO category VALUES ('${req.body.category}')`;
  console.log(query)
  sql.connect(con).then(()=>{
    sql.query(query,(result)=>{  
      console.log(result);
    return res.json({ Status: true });
    })
  }).catch((err)=>{
    console.log(err);
    return res.json({ Status: false, Error: "Query Error" });
  })
});

// image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/Images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
});
// end imag eupload

router.post("/add_employee", upload.single("image"), (req, res) => {
  const query = `INSERT INTO employee 
    (name,email,password, address, salary,image, category_id) 
    VALUES (?)`;
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    const values = [
      req.body.name,
      req.body.email,
      hash,
      req.body.address,
      req.body.salary,
      req.file.filename,
      req.body.category_id,
    ];
    const query = `INSERT INTO employee 
    (name,email,password, address, salary,image, category_id) 
    VALUES ('${values[0]}','${values[1]}','${values[2]}','${values[3]}','${values[4]}','${values[5]}','${values[6]}')`;
    sql.connect(con,(err)=>{
      if(err) return res.json({ Status: false, Error: "Query Error" });
      sql.query(query,(err)=>{
        if (err) return res.json({ Status: false, Error: err });
      return res.json({ Status: true });
      })
    })
  });
});

router.get("/employee", (req, res) => {
  const query = "SELECT * FROM employee";
  sql.connect(con,(err)=>{
    if (err) return res.json({ Status: false, Error: "Query Error" });
    sql.query(query,(err,result)=>{
      if (err) return res.json({ Status: false, Error: "Query Error" });
      console.log(result)
      return res.json({ Status: true, Result: result.recordset });
    })
  })
});

router.get("/employee/:id", (req, res) => {
  const id = req.params.id;
  const query = `SELECT * FROM employee WHERE id = ${id}`;
  sql.connect(con,(err)=>{
    if (err) return res.json({ Status: false, Error: "Query Error" });
    sql.query(query,(err,result)=>{
      if (err) return res.json({ Status: false, Error: "Query Error" });
      return res.json({ Status: true, Result: result.recordset });
    })
  })
});

router.put("/edit_employee/:id", (req, res) => {
  const id = req.params.id;
  const query = `UPDATE employee 
        set name = '${req.body.name}', email = '${req.body.email}', salary = '${req.body.salary}', address = '${req.body.address}', category_id = ${req.body.category_id} 
        Where id = ${id}`;
  sql.connect(con,(err)=>{
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    sql.query(query,(err,result)=>{
      if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result.recordset });  
    })
  })
  
});

router.delete("/delete_employee/:id", (req, res) => {
  const id = req.params.id;
  const query = `delete from employee where id = ${id}`;
  sql.connect(con,(err)=>{
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    sql.query(query,(err,result)=>{
      if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result.recordset });  
    })
  })
  
});

router.get("/admin_count", (req, res) => {
  const query = "select count(id) as admin from admin";
  sql.connect(con,(err)=>{
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    sql.query(query,(err,result)=>{
      if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result.recordset });  
    })
  })
});

router.get("/employee_count", (req, res) => {
  const query = "select count(id) as employee from employee";
  sql.connect(con,(err)=>{
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    sql.query(query,(err,result)=>{
      if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result.recordset });  
    })
  })
});

router.get("/salary_count", (req, res) => {
  const query = "select sum(salary) as salaryOFEmp from employee";
  sql.connect(con,(err)=>{
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    sql.query(query,(err,result)=>{
      if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result.recordset });  
    })
  })
});

router.get("/admin_records", (req, res) => {
  const query = "select * from admin";
  sql.connect(con,(err)=>{
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    sql.query(query,(err,result)=>{
      if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result.recordset });  
    })
  })
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true });
});

export { router as adminRouter };

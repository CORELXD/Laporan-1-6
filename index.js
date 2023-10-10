const express = require("express");
const app = express();
const port = 8000;

const bodyPs = require('body-parser');
app.use(bodyPs.urlencoded({ extended: false}));
app.use(bodyPs.json());

//app.get('/', (req, res)=>{ 
  //  res.send('Hey Kamu')
//})

const mhsRouter = require("./mahasiswa");
const jurusanRouter = require("./jurusan");
app.use("/api/mhs", mhsRouter);
app.use("/api/jurusan", jurusanRouter);

app.listen(port, () =>{
    console.log(`aplikasi berjalan di http:://localhost:${port}`)
});
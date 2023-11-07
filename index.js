const express = require("express");
const app = express();
const port = 3000;
const cors = require('cors');
//membuat route baru dengan method Get Dan isinya
app.use(cors());

const path = require('path');
app.use('/static', express.static(path.join(__dirname, 'public/image')));


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

//import rute register dan Login 
const auth = require('./auth/auth');
app.use('/api/auth', auth);


app.listen(port, () =>{
    console.log(`aplikasi berjalan di http:://localhost:${port}`)
});
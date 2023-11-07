const express = require("express");
const router = express.Router();
const {body, validationResult } = require('express-validator');
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/image')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname) )
    }
}) 

const fileFilter = (req, file, cb) => {
    //mengecek Jenis FIle Yang Diizinkan (contoh hanya gambar JPEG,PNG, dan PDF)
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
        cb(null, true); // Izinkan File
    }else{
        cb(new Error('Jenis File Tidak diizinkan'), false); // file ditolak
    }
}
const upload = multer({storage: storage, fileFilter: fileFilter})

const authenticateToken = require('../routes/auth/midleware/authenticateToken')


const connection = require("./db");

router.get('/', authenticateToken, function (req, res) {
    // Menggunakan alias untuk memudahkan membaca query.
    const query = `
      SELECT
        a.id_m as id,
        a.id_jurusan,
        a.nama,
        b.nama_jurusan AS jurusan,
        a.gambar,
        a.swa_foto,
        a.nrp
      FROM mahasiswa a
      JOIN jurusan b ON b.id_j = a.id_jurusan
      ORDER BY a.id_m DESC
    `;
  
    connection.query(query, (err, rows) => {
      if (err) {
        console.error('Kesalahan database:', err);
        return res.status(500).json({
          status: false,
          message: 'Terjadi kesalahan server'
        });
      } else {
        return res.status(200).json({
          status: true,
          message: 'Data Mahasiswa',
          data: rows
        });
      }
    });
  });


router.post(
    "/store", authenticateToken,
    upload.fields([
      { name: "gambar", maxCount: 1 },
      { name: "swa_foto", maxCount: 1 },
    ]),
    [
      body("nama").notEmpty(),
      body("nrp").notEmpty(),
      body("id_jurusan").notEmpty(), // Menambah validasi untuk jurusan
    ],
    (req, res) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(422).json({
          error: error.array(),
        });
      }
      let Data = {
        nama: req.body.nama,
        nrp: req.body.nrp,
        id_jurusan: req.body.id_jurusan,
        gambar: req.files.gambar[0].filename,
        swa_foto: req.files.swa_foto[0].filename,
      };
      connection.query(
        "INSERT into mahasiswa set ? ",
        Data,
        function (err, rows) {
          if (err) {
            return res.status(500).json({
              status: false,
              message: "Server Error",
            });
          } else {
            return res.status(201).json({
              status: true,
              message: "Sukses..!",
              data: rows[0],
            });
          }
        }
      );
    }
  );

router.get('/(:id)', function (req, res) {
    let id = req.params.id;
     connection.query(`select * from mahasiswa where id_m = ${id}`, function(eror, rows){
         if(eror){
             return res.status(500).json({
                 status: false,
                 message: 'Server Eror Dude.....',
                 eror: eror
             });
         }
         if(rows.length <=0){
             return res.status(404).json({
                 status: false,
                 message: 'Coba Lagi Dude.....',
                 eror: eror
             });
         }
         else{
             return res.status(200).json({
                 status: true,
                 message: 'Data Mahasiswa',
                 data: rows[0]
             });
         }
     });
 });
 
router.patch('/update/(:id)', authenticateToken, upload.fields([{ name: 'gambar', maxCount: 1 }, { name: 'swa_foto', maxCount: 1 }]), [
 //validasi
 body('nama').notEmpty(),
 body('nrp').notEmpty(),
 body('id_jurusan').notEmpty(),
],(req, res)=>{
 const error = validationResult(req);
 if(!error.isEmpty()){
     return res.status(422).json({
         error: error.array() 
     });
 }
 let id = req.params.id;
 //Lakukan Pengecekan Apakah Ada file yang diunggah
 let gambar = req.files['gambar']? req.files['gambar'][0].filename : null;
 let swa_foto = req.files['swa_foto']? req.files['swa_foto'][0].filename : null;

 let data = {
     nama: req.body.nama,
     nrp: req.body.nrp,
     id_jurusan: req.body.id_jurusan,
 };

 //Ceka Apakah Ada Gambar dan Swa_foto jika yang Diunggah
    if(gambar){
        data.gambar = gambar;
    }
    if(swa_foto){
        data.swa_foto = swa_foto;
    }

     connection.query(`update mahasiswa set ? where id_m = ${id}`, data ,function(eror, rows){
         if(eror){
             return res.status(500).json({
                 status: false,
                 message: 'Server Eror Dude.....',
                 eror: eror
             });
         }else{
             return res.status(200).json({
                 status: true,
                 message: 'Update Data Success Dude....',
             });
         }
     });
 });

 router.delete('/delete/(:id)', authenticateToken, function (req, res) {
    let id = req.params.id;
    
    connection.query(`select * from mahasiswa where id_m = ${id}`, function(eror, rows){
        if(eror){
            return res.status(500).json({
                status: false,
                message: 'Server Eror Dude.....',
                eror: eror
            });
        }
        if(rows.length ===0){
            return res.status(404).json({
                status: false,
                message: 'Coba Lagi Dude.....',
                eror: eror
            });
        }
        const gambarLama = rows[0].gambar;
        const swa_fotoLama = rows[0].swa_foto;

        // Hapus file lama jika ada
        if(gambarLama) {
            const pathGambar = path.join(__dirname, './public/image', gambarLama);
            fs.unlinkSync(pathGambar);
        }
        if(swa_fotoLama) {
            const pathSwaFoto = path.join(__dirname, './public/image', swa_fotoLama);
            fs.unlinkSync(pathSwaFoto);
        }
    
     connection.query(`delete from mahasiswa where id_m = ${id}`, function(eror, rows){
         if(eror){
             return res.status(500).json({
                 status: false,
                 message: 'Server Eror Dude.....',
                 eror: eror
             });
         }else{
             return res.status(200).json({
                 status: true,
                 message: 'Data Sudah Sukses Dihapus Dude....',
             });
         }
     });
 });

});


module.exports = router;
const express = require("express");
const router = express.Router();
const {body, validationResult } = require('express-validator');

const connection = require("./db");

router.get('/', function (req, res){
    connection.query('select * from mahasiswa order by id_m desc', function(err,rows){
        if (err){
            return res.status(500).json({
                status: false,
                message: "Server Gagal"
            })
        }else{
            return res.status(200).json({
                status: true,
                message: "data Mahasiswa",
                data: rows
            });
        }
    });
});

router.post('/store',[
    //validasi
    body('nama').notEmpty(),
    body('nrp').notEmpty()
],(req, res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array() 
        });
    }
    let data = {
        nama: req.body.nama,
        nrp: req.body.nrp
    };
    connection.query('insert into mahasiswa set ?', data, function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Coba Lagi Dude.....',
            });
        }else{
            return res.status(201).json({
                status: true,
                message: 'Berhasil Dude.....',
                data: rows[0]
            });
        }
    });
});

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
 
router.patch('/update/(:id)', [
 //validasi
 body('nama').notEmpty(),
 body('nrp').notEmpty()
],(req, res)=>{
 const error = validationResult(req);
 if(!error.isEmpty()){
     return res.status(422).json({
         error: error.array() 
     });
 }
 let id = req.params.id;
 let data = {
     nama: req.body.nama,
     nrp: req.body.nrp
 };
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

 router.delete('/delete/(:id)', function (req, res) {
    let id = req.params.id;
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


module.exports = router;
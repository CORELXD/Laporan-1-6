const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const connection = require("./db"); // Update the path to your database connection file

// GET all jurusan records
router.get("/", (req, res) => {
  connection.query("SELECT * FROM jurusan", (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Server Gagal",
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "Data Jurusan",
        data: rows,
      });
    }
  });
});

// POST (STORE) a new jurusan record
router.post(
  "/store",
  [
    // Validation
    body("nama_jurusan").notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

    const data = {
      nama_jurusan: req.body.nama_jurusan,
    };

    connection.query("INSERT INTO jurusan SET ?", data, (err, result) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Coba Lagi Dude.....",
        });
      } else {
        return res.status(201).json({
          status: true,
          message: "Berhasil Dude.....",
          data: {
            insettedId: result.insertId,
          },
        });
      }
    });
  }
);

// GET a specific jurusan record by ID
router.get("/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM jurusan WHERE id_j = ?",
    [id],
    (error, rows) => {
      if (error) {
        return res.status(500).json({
          status: false,
          message: "Server Eror Dude.....",
          error: error,
        });
      }
      if (rows.length <= 0) {
        return res.status(404).json({
          status: false,
          message: "Coba Lagi Dude.....",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Data Jurusan",
          data: rows[0],
        });
      }
    }
  );
});

// PATCH (UPDATE) a jurusan record by ID
router.patch(
  "/update/:id",
  [
    // Validation
    body("nama_jurusan").notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

    const id = req.params.id;
    const data = {
      nama_jurusan: req.body.nama_jurusan,
    };

    connection.query(
      "UPDATE jurusan SET ? WHERE id_j = ?",
      [data, id],
      (error, result) => {
        if (error) {
          return res.status(500).json({
            status: false,
            message: "Server Eror Dude.....",
            error: error,
          });
        } else {
          return res.status(200).json({
            status: true,
            message: "Update Data Success Dude....",
          });
        }
      }
    );
  }
);

// DELETE a jurusan record by ID
router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "DELETE FROM jurusan WHERE id_j = ?",
    [id],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          status: false,
          message: "Server Eror Dude.....",
          error: error,
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Data Sudah Sukses Dihapus Dude....",
        });
      }
    }
  );
});

module.exports = router;

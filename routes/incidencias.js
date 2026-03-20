const express = require("express");
const router = express.Router();
const db = require("../db");

//
// CREATE
//
router.post("/", async (req, res) => {
  try {
    const { x, y, descripcio, nombre, foto } = req.body;

    const result = await db.query(
      `INSERT INTO incidencias (x, y, descripcio, nombre, foto)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [x, y, descripcio, nombre, foto],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando incidencia" });
  }
});

//
// READ ALL
//
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM incidencias ORDER BY id_incidencias DESC",
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo incidencias" });
  }
});

//
// READ ONE
//
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      "SELECT * FROM incidencias WHERE id_incidencias = $1",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo incidencia" });
  }
});

//
// UPDATE
//
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { x, y, descripcio, nombre, foto } = req.body;

    const result = await db.query(
      `UPDATE incidencias
       SET x=$1, y=$2, descripcio=$3, nombre=$4, foto=$5
       WHERE id_incidencias=$6
       RETURNING *`,
      [x, y, descripcio, nombre, foto, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error actualizando incidencia" });
  }
});

//
// DELETE
//
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      "DELETE FROM incidencias WHERE id_incidencias = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No encontrada" });
    }

    res.json({ message: "Eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error eliminando incidencia" });
  }
});

module.exports = router;

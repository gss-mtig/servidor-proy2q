const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

// configuración
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//
// POST /upload
//
router.post("/", async (req, res) => {
  try {
    const { foto, name } = req.body;

    if (!foto || !name) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    // validar base64 tipo imagen
    const match = foto.match(/^data:image\/(\w+);base64,/);
    if (!match) {
      return res.status(400).json({ error: "Formato inválido" });
    }

    const ext = match[1].toLowerCase();

    if (!["jpg", "jpeg", "png", "webp"].includes(ext)) {
      return res.status(400).json({ error: "Tipo no permitido" });
    }

    // subir a cloudinary
    const result = await cloudinary.uploader.upload(foto, {
      folder: "incidencias",
      public_id: name, // opcional
      overwrite: true,
    });

    return res.json({
      message: "Imagen subida correctamente",
      url: result.secure_url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error subiendo imagen" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

router.use(express.raw({ type: "image/*", limit: "20mb" }));

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
    const name = req.headers["x-filename"];
    const buffer = req.body; // 👈 aquí está la imagen como Buffer

    if (!buffer || !name) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    // subir a Cloudinary usando upload_stream
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "incidencias", public_id: name, overwrite: true },
        (err, result) => (err ? reject(err) : resolve(result)),
      );
      stream.end(buffer);
    });

    return res.json({
      message: "Imagen subida correctamente",
      url: result.secure_url,
    });
  } catch (error) {
    console.error(error); // esto mostrará el error real
    res.status(500).json({ error: "Error subiendo imagen" });
  }
});

module.exports = router;

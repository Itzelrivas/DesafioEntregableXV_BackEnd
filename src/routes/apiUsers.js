import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { addFilesController, changeRolController } from '../controllers/users.Controller.js';
import errorHandler from '../services/errors/middlewares/index.js';
import __dirname from '../../utils.js';

const router = Router();

// Configuración de Multer para guardar archivos en diferentes carpetas
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = '';
        const fileNameWithoutExt = path.parse(file.originalname).name
        //console.log(fileNameWithoutExt)
        // Determinar la carpeta de destino según el tipo de archivo
        if (fileNameWithoutExt === 'profileImage') {
            uploadPath = path.join(`${__dirname}/src/public/uploads/profiles`);
        } else if (fileNameWithoutExt === 'productImage') {
            uploadPath = path.join(`${__dirname}/src/public/uploads/products`);
        } else {
            uploadPath = path.join(`${__dirname}/src/public/uploads/documents`);
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Middleware de Multer
const upload = multer({ storage });



//Cambiar el role
router.get("/premium/:_id", changeRolController)

// Ruta para subir archivos a un usuario
router.post('/:uid/documents', upload.array('files'), addFilesController);



// Middleware para el manejo de errores
router.use(errorHandler);

export default router;
import { Router } from "express";
import produtoController from "../controllers/produtoController.js";
import uploadImage from "../middlewares/uploadImage.middleware.js";

const produtoRoutes = Router();

produtoRoutes.post("/", uploadImage.single("imagem"), produtoController.criar);
produtoRoutes.put("/:id", produtoController.editar);
produtoRoutes.delete("/:id", produtoController.deletar);
produtoRoutes.get("/", produtoController.selecionar);

export default produtoRoutes;
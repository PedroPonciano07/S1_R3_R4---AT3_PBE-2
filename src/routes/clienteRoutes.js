import { Router } from "express";
import clienteController from "../controllers/clienteController.js";

const clienteRoutes = Router();


clienteRoutes.post('/', clienteController.criar);
clienteRoutes.get('/', clienteController.selecionar);
clienteRoutes.put('/', clienteController.editar);
clienteRoutes.delete('/', clienteController.deletar);

export default clienteRoutes;
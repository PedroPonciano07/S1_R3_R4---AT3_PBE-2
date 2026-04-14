
import { Router } from "express";
import clienteController from "../controllers/clienteController.js";

const clienteRoutes = Router();

clienteRoutes.post('/', clienteController.criar);
clienteRoutes.put('/', clienteController.editar);
clienteRoutes.delete('/', clienteController.deletar);
clienteRoutes.get('/', clienteController.listar);


export default clienteRoutes;
import { Router } from "express";
const router = Router();
import produtosRoutes from "./produtosRoutes.js";
import categoriaRoutes from "./categoriaRoutes.js";
import clienteRoutes from "./clienteRoutes.js"

router.use("/categorias", categoriaRoutes);
router.use("/produtos", produtosRoutes);
router.use("/clientes", clienteRoutes);

export default router;
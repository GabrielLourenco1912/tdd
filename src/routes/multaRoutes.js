const { Router } = require('express');
const { criar, listar, deletar, buscarPorId, atualizar, listarPorUsuario } = require('../controllers/multaController');

const router = Router();

router.post("/", criar);
router.get("/", listar);
router.get("/usuarios/:usuarioId", listarPorUsuario );
router.get("/:id", buscarPorId);
router.put("/:id", atualizar);
router.delete('/:id', deletar);

module.exports = router;
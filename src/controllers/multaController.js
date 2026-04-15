const { criarMulta, listarMultas, pegarPorId, deletarMulta, atualizarMulta, listarMultasPorUsuario } = require('../services/multaService');

const criar = async (req, res) => {
    try {
        const {emprestimo_id, valor, status_pagamento, data_geracao} = req.body;

        if (!emprestimo_id || !valor || !data_geracao) return res.status(400)
            .json({erro: 'emprestimo, valor e data de geração são obrigatórios'})

        const multa = await criarMulta(emprestimo_id, valor, status_pagamento, data_geracao);
        res.status(201).json(multa);
    } catch(err) {
        return res.status(400).json({ erro: 'Erro ao criar multa' });
    }
}

const listar = async (req, res) => {
    const multas = await listarMultas();
    res.status(200).json(multas);
}

const listarPorUsuario = async (req, res) => {
    try {
        const { usuarioId } = req.params;

        if (!usuarioId) {
            return res.status(400).json({ erro: 'usuarioId é obrigatório' });
        }

        const multas = await listarMultasPorUsuario(usuarioId);

        return res.status(200).json(multas);

    } catch (error) {
        return res.status(500).json({ erro: 'Erro interno' });
    }
};

const buscarPorId = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ erro: 'id é obrigatório' });
    const multas = await pegarPorId(id);
    res.status(200).json(multas);
}

const atualizar = async (req, res) => {
    try {
        const {id} = req.params;
        const {emprestimo_id, valor, status_pagamento, data_geracao} = req.body;
        if (!id) return res.status(400).json({erro: 'id é obrigatório'});

        const multas = await atualizarMulta(emprestimo_id, valor, status_pagamento, data_geracao, id);
        res.status(200).json(multas);
    } catch (err) {
        if (err.message === "multa já quitada") {
            return res.status(400).json({ error: err.message });
        }

        if (err.message === "multa not found") {
            return res.status(404).json({ error: err.message });
        }

        console.error(err.message);

        return res.status(500).json({ error: "erro interno" });
    }
}

const deletar = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id) return res.status(400).json({erro: 'id é obrigatório'});
        await deletarMulta(id);
        res.status(204).send();
    } catch(err) {
        res.status(404).json({ error: err.message });
    }
}

module.exports = { criar, listar, listarPorUsuario, deletar, buscarPorId, atualizar };
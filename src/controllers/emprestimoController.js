const { criarEmprestimo, listarEmprestimo, pegarPorId, deletarEmprestimo, atualizarEmprestimo } = require('../services/emprestimoService');

const criar = async (req, res) => {
    const { usuario_id, livro_id, data_devolucao_prevista } = req.body;

    if (!usuario_id || !livro_id || !data_devolucao_prevista) return res.status(400)
        .json({ erro: 'livro, usuario e data de devolução são obrigatórios'})

    const emprestimo = await criarEmprestimo(usuario_id, livro_id, data_devolucao_prevista);
    res.status(201).json(emprestimo);
}

const listar = async (req, res) => {
    const emprestimos = await listarEmprestimo();
    res.status(200).json(emprestimos);
}

const buscarPorId = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ erro: 'id é obrigatório' });
    const emprestimos = await pegarPorId(id);
    res.status(200).json(emprestimos);
}

const atualizar = async (req, res) => {
    const { id } = req.params;
    const { usuario_id, livro_id, data_devolucao_prevista } = req.body;
    if (!id) return res.status(400).json({ erro: 'id é obrigatório' });
    const emprestimos = await atualizarEmprestimo(usuario_id, livro_id, data_devolucao_prevista, id);
    res.status(201).json(emprestimos);
}

const deletar = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ erro: 'id é obrigatório' });
    await deletarEmprestimo(id);
    res.status(204).send();
}

module.exports = { criar, listar, deletar, buscarPorId, atualizar };
const { criarEmprestimo, listarEmprestimo, pegarPorId, deletarEmprestimo, atualizarEmprestimo, listarEmprestimosPorUsuario } = require('../services/emprestimoService');

const criar = async (req, res) => {
    try {
        const {usuario_id, livro_id, data_devolucao_prevista} = req.body;

        if (!usuario_id || !livro_id || !data_devolucao_prevista) return res.status(400)
            .json({erro: 'livro, usuario e data de devolução são obrigatórios'})

        const emprestimo = await criarEmprestimo(usuario_id, livro_id, data_devolucao_prevista);
        res.status(201).json(emprestimo);
    } catch(err) {
        return res.status(400).json({ erro: 'Erro ao criar empréstimo' });
    }
}

const listar = async (req, res) => {
    const emprestimos = await listarEmprestimo();
    res.status(200).json(emprestimos);
}

const listarPorUsuario = async (req, res) => {
    try {
        const { usuarioId } = req.params;

        if (!usuarioId) {
            return res.status(400).json({ erro: 'usuarioId é obrigatório' });
        }

        const emprestimos = await listarEmprestimosPorUsuario(usuarioId);

        return res.status(200).json(emprestimos);

    } catch (error) {
        return res.status(500).json({ erro: 'Erro interno' });
    }
};

const buscarPorId = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ erro: 'id é obrigatório' });
    const emprestimos = await pegarPorId(id);
    res.status(200).json(emprestimos);
}

const atualizar = async (req, res) => {
    try {
        const {id} = req.params;
        const {usuario_id, livro_id, data_devolucao_prevista, devolucao} = req.body;
        if (!id) return res.status(400).json({erro: 'id é obrigatório'});

        const emprestimos = await atualizarEmprestimo(devolucao, usuario_id, livro_id, data_devolucao_prevista, id);
        res.status(200).json(emprestimos);
    } catch (err){
        res.status(404).json({ error: err.message });
    }
}

const deletar = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id) return res.status(400).json({erro: 'id é obrigatório'});
        await deletarEmprestimo(id);
        res.status(204).send();
    } catch(err) {
        res.status(404).json({ error: err.message });
    }
}

module.exports = { criar, listar, listarPorUsuario, deletar, buscarPorId, atualizar };
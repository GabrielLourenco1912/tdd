const { Emprestimo } = require('../models');

const criarEmprestimo = async (usuario_id, livro_id, data_devolucao_prevista) => {
    const emprestimo = await Emprestimo.create({ usuario_id, livro_id, data_devolucao_prevista });
    return {
        id: emprestimo.id,
        usuario_id: emprestimo.usuario_id,
        livro_id: emprestimo.livro_id,
        data_devolucao_prevista: emprestimo.data_devolucao_prevista,
    };
};

const atualizarEmprestimo = async (usuario_id, livro_id, data_devolucao_prevista, id) => {
    const emprestimo = await Emprestimo.findByPk(id);
    await emprestimo.update({ usuario_id, livro_id, data_devolucao_prevista });
    return {
        id: emprestimo.id,
        usuario_id: emprestimo.usuario_id,
        livro_id: emprestimo.livro_id,
        data_devolucao_prevista: emprestimo.data_devolucao_prevista,
    };
};

const listarEmprestimo = async () => {
    const emprestimo = await Emprestimo.findAll();
    return emprestimo;
};

const deletarEmprestimo = async (id) => {
    await Emprestimo.destroy({where: { id }});
}

const pegarPorId = async (id) => {
    const emprestimo = await Emprestimo.findByPk(id);
    return emprestimo;
}

const resetarEmprestimo = async (id) => {
    await Emprestimo.destroy({truncate: true});
}

module.exports = { criarEmprestimo, atualizarEmprestimo, listarEmprestimo, deletarEmprestimo, pegarPorId, resetarEmprestimo };
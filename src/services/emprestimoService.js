const { Emprestimo } = require('../models');
const { pegarPorId: pegarPorIdLivro } = require("./livroService");

const criarEmprestimo = async (usuario_id, livro_id, data_devolucao_prevista) => {
    const livro = await pegarPorIdLivro(livro_id)
    if (livro.disponivel === false) throw new Error()

    const emprestimo = await Emprestimo.create({ usuario_id, livro_id, data_devolucao_prevista });
    return {
        id: emprestimo.id,
        usuario_id: emprestimo.usuario_id,
        livro_id: emprestimo.livro_id,
        data_devolucao_prevista: emprestimo.data_devolucao_prevista,
    };
};

const atualizarEmprestimo = async (devolucao, usuario_id, livro_id, data_devolucao_prevista, id) => {
    const emprestimo = await Emprestimo.findByPk(id);
    if (!emprestimo) throw new Error();
    await emprestimo.update({usuario_id, livro_id, data_devolucao_prevista, devolucao});
    return {
        id: emprestimo.id,
        usuario_id: emprestimo.usuario_id,
        livro_id: emprestimo.livro_id,
        data_devolucao_prevista: emprestimo.data_devolucao_prevista,
        devolucao: emprestimo.devolucao
    };
};

const listarEmprestimo = async () => {
    const emprestimo = await Emprestimo.findAll();
    return emprestimo;
};

const listarEmprestimosPorUsuario = async (usuarioId) => {
    const emprestimos = await Emprestimo.findAll({
        where: { usuario_id: usuarioId }
    });

    return emprestimos;
};

const deletarEmprestimo = async (id) => {
    const res = await Emprestimo.destroy({where: { id }});
    if(res === 0) throw new Error();
}

const pegarPorId = async (id) => {
    const emprestimo = await Emprestimo.findByPk(id);
    return emprestimo;
}

const resetarEmprestimo = async (id) => {
    await Emprestimo.destroy({truncate: true});
}

module.exports = { criarEmprestimo, atualizarEmprestimo, listarEmprestimo, listarEmprestimosPorUsuario, deletarEmprestimo, pegarPorId, resetarEmprestimo };
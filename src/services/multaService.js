const { Multa, Emprestimo} = require('../models');

const criarMulta = async (emprestimo_id, valor, status_pagamento, data_geracao) => {
    const multa = await Multa.create({ emprestimo_id, valor, status_pagamento, data_geracao });
    return {
        id: multa.id,
        emprestimo_id: multa.emprestimo_id,
        valor: multa.valor,
        status_pagamento: multa.status_pagamento,
        data_geracao: new Date()
    };
};

const atualizarMulta = async (emprestimo_id, valor, status_pagamento, data_geracao, id) => {
    const multa = await Multa.findByPk(id);
    if (!multa) throw new Error("multa not found");
    if (multa.status_pagamento === 'pago' && status_pagamento === 'pago') throw new Error("multa já quitada");
    await multa.update({emprestimo_id, valor, status_pagamento, data_geracao});
    return {
        id: multa.id,
        emprestimo_id: multa.emprestimo_id,
        valor: multa.valor,
        status_pagamento: multa.status_pagamento,
        data_geracao: multa.data_geracao
    };
};

const listarMultas = async () => {
    return await Multa.findAll();
};

const listarMultasPorUsuario = async (usuarioId) => {
    return await Multa.findAll({
        include: [
            {
                model: Emprestimo,
                attributes: [],
                where: {
                    usuario_id: usuarioId
                }
            }
        ]
    });
};

const deletarMulta = async (id) => {
    const res = await Multa.destroy({where: { id }});
    if(res === 0) throw new Error();
}

const pegarPorId = async (id) => {
    return await Multa.findByPk(id);
}

const resetarMultas = async () => {
    await Multa.destroy({truncate: true});
}

module.exports = { criarMulta, atualizarMulta, listarMultas, listarMultasPorUsuario, deletarMulta, pegarPorId, resetarMultas };
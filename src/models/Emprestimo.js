const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const Emprestimo = sequelize.define('Emprestimo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    livro_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    data_devolucao_prevista: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    tableName: 'emprestimos',
    timestamps: true,
    underscored: false,
});

module.exports = Emprestimo;
const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const Multa = sequelize.define('Multa', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    emprestimo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    valor: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status_pagamento: {
        type: DataTypes.ENUM('pago', 'pendente', 'cancelado'),
        allowNull: false,
    },
    data_geracao: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    tableName: 'multas',
    timestamps: true,
    underscored: false,
});

module.exports = Multa;
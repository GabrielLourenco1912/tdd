'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('multas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      emprestimo_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'emprestimos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      valor: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      status_pagamento: {
        type: Sequelize.ENUM('pago', 'pendente', 'cancelado'),
        allowNull: false,
        defaultValue: 'pendente'
      },

      data_geracao: {
        type: Sequelize.DATE,
        allowNull: true
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('multas');
  }
};
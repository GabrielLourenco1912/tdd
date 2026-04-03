'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('emprestimos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      livro_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'livros',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      data_devolucao_prevista: {
        type: Sequelize.DATE,
        allowNull: false
      },

      devolucao: {
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
    await queryInterface.dropTable('emprestimos');
  }
};
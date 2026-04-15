const sequelize = require('../database/sequelize');
const Livro = require('./Livro');
const Usuario = require('./Usuario');
const Emprestimo = require('./Emprestimo');
const Multa = require('./Multa');

Multa.belongsTo(Emprestimo, { foreignKey: 'emprestimo_id' });
Emprestimo.hasMany(Multa, { foreignKey: 'emprestimo_id' });

module.exports = {
  sequelize,
  Livro,
  Usuario,
  Emprestimo,
  Multa
};
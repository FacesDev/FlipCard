'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
     return queryInterface.createTable('cards', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      question: {
        type: Sequelize.STRING
      },
      answer: {
        type: Sequelize.STRING
      },
      author: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
  
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('cards');
  }
};

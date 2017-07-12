'use strict';
module.exports = function(sequelize, DataTypes) {
  var cards = sequelize.define('cards', {
    question: DataTypes.TEXT,
    answer: DataTypes.TEXT,
    author: DataTypes.STRING
  
      
});
cards.associate = function(models) {
        cards.belongsTo(models.decks);
      }
  return cards;
};


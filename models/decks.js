'use strict';
module.exports = function(sequelize, DataTypes) {
  var decks = sequelize.define('decks', {
    userId: DataTypes.TEXT,
    name: DataTypes.STRING
  
      
});
decks.associate = function(models) {
        decks.belongsTo(models.users);
        decks.hasMany(models.cards);
      }
  return decks;
};


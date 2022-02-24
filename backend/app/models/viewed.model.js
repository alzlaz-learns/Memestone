module.exports = (sequelize, Sequelize) => {
  const Viewed = sequelize.define('viewed', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    userID: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    memeID: {
        type: Sequelize.INTEGER,
        allowNull: false 
    }
  });

  return Viewed;
};

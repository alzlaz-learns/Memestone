module.exports = (sequelize, Sequelize) => {
  const Likes = sequelize.define('likes', {
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

  return Likes;
};

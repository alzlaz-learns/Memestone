module.exports = (sequelize, Sequelize) => {
  const Likes = sequelize.define('likes', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    memeID: {
        type: Sequelize.INTEGER,
        allowNull: false 
    }
  });

  return Likes;
};

module.exports = (sequelize, Sequelize) => {
  const Memes = sequelize.define('memes', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
	uuid: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true
	},
    url: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    caption: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tags: {
        type: Sequelize.STRING,
        allowNull: false
    },
    is_private: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    },
    poster_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
	likes: {
		type: Sequelize.INTEGER,
		allowNull: false,
		defaultValue: 0
	}
  });

  return Memes;
};

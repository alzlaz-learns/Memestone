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
        allowNull: false
    },
    caption: {
        type: Sequelize.STRING
    },
    tags: {
        type: Sequelize.STRING
    },
    is_private: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    },
    poster_id: {
        type: Sequelize.INTEGER,
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

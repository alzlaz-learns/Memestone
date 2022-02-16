module.exports = (sequelize, Sequelize) => {
    const Images = sequelize.define("images", {
        ImageId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            unique: true,

        },
        Title: {
            type: Sequelize.STRING,
            allowNull: false

        },
        PosterId: {
            type: Sequelize.INTEGER,
            allowNull: false,

        },
        LikedById:{
            type: Sequelize.STRING(1234),
            allowNull: false,

        },
        path: {
            type:Sequelize.TEXT,
            allowNull: false
        }
    });
  
    return Images;
  };
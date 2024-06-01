import {Sequelize} from "sequelize";

const sequelize = new Sequelize( //dat ten bien la gi cung duoc, khong nhat thiet la sequelize
 'tour_management',   //ten db
 'root', //username de dang nhap, mac dinh la root
 '', //password mac dinh de trong
  {
    host: 'localhost', //link hosting, sau nay thay bang link online
    dialect: 'mysql'
  }
);


sequelize.authenticate().then(() => {
   console.log('Connection has been established successfully.');
}).catch((error) => {
   console.error('Unable to connect to the database: ', error);
});

export default sequelize;
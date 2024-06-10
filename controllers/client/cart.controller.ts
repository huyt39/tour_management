import { Request, Response } from "express";
import sequelize from "../../config/database";
import { QueryTypes } from "sequelize";

// [GET] /cart/
export const index = async (req: Request, res: Response) => {
  res.render("client/pages/cart/index", {
    pageTitle: "Giỏ hàng"
  });
};

// [POST] /cart/list-json
export const listJson = async (req: Request, res: Response) => {
  const tours =  req.body;

  for (const tour of tours) {
    const infoTour = await sequelize.query(`
      SELECT * FROM tours 
      WHERE deleted = false
      AND id = ${tour.tourId}
      AND status = 'active';
    `, {
      type: QueryTypes.SELECT,
      raw: true,
      plain: true
    });
    infoTour['images'] = JSON.parse(infoTour['images']);
    infoTour['price_special'] = infoTour['price'] * (1 - infoTour['discount']/100);
    infoTour['total'] = infoTour['price_special'] * tour['quantity'];
    tour['infoTour'] = infoTour;
  }

  res.json({
    tours: tours,
  })
};
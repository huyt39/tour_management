import { Request, Response } from "express";
import Category from "../../models/category.model";
import sequelize from "../../config/database";

// [GET] /categories/
export const index = async (req: Request, res: Response) => {
  // SELECT * FROM categories WHERE deleted = false AND status = "active";
  const query = `SELECT * FROM categories 
  WHERE deleted = false AND status = 'active' `;

  const categories = await sequelize.query(query, {
    model: Category,
    raw: true
  });

  console.log(categories);

  res.render("client/pages/categories/index", {
    pageTitle: "Danh mục tour",
    categories: categories
  });
}
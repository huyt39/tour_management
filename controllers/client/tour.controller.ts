import { Request, Response } from "express";
import Tour from "../../models/tour.model";

//[GET] /tours/
export const index = async (req: Request, res: Response)=>{
    // SELECT * FROM tours WHERE deleted = false AND status = "active";
    const tours = await Tour.findAll({
        where: {
            deleted: false,
            status: "active"
        },
        raw: true  //data tra ra ngan gon
    });

    res.render("client/pages/tours/index.pug", {
        pageTitle: "Danh sách tour",
        tours: tours
    });
}
import { Router } from "express";
import express, {Express, Request, Response} from "express";
import Tour from "../../models/tour.model";

const router: Router = Router();

router.get("/", async (req: Request, res: Response)=>{
    const tours = await Tour.findAll({
        raw: true
    });

    res.render("client/pages/tours/index.pug", {
        tours: tours
    });
});
export const tourRoutes: Router = router;
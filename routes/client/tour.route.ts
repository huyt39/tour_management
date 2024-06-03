import { Router } from "express";
import * as controller from "../../controllers/client/tour.controller"

const router: Router = Router();

router.get("/:slugCategory", controller.index);
router.get("/detail/:slugTour", controller.detail);
export const tourRoutes: Router = router;
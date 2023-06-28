import express, {Request,  NextFunction, Response} from "express";
import { IncomingMessage } from "http";
const router = express.Router();

/* GET users listing. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.send('respond with a resource');
});

export default router;
import express from 'express';
import {createUser, login} from '../controllers/userscontrollers';


const router = express.Router();

router.post('/signup', createUser);
router.post('/login', login);

export default router;
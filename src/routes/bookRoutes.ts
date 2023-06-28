import express from 'express';
import { createBooks } from '../controllers/bookcontrollers';
import { updateBooks } from '../controllers/bookcontrollers';
import { getAllBooks } from '../controllers/bookcontrollers';
import { deleteBooks } from '../controllers/bookcontrollers';


import {auth}  from '../utilities/auth';

const router = express.Router();

router.post('/createBook', auth, createBooks);
router.patch('/updateBooks', updateBooks);
router.get('/getAllBooks', getAllBooks);
router.delete('/deleteBooks', deleteBooks);



export default router;
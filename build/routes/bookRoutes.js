"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookcontrollers_1 = require("../controllers/bookcontrollers");
const bookcontrollers_2 = require("../controllers/bookcontrollers");
const bookcontrollers_3 = require("../controllers/bookcontrollers");
const bookcontrollers_4 = require("../controllers/bookcontrollers");
const auth_1 = require("../utilities/auth");
const router = express_1.default.Router();
router.post('/createBook', auth_1.auth, bookcontrollers_1.createBooks);
router.patch('/updateBooks', bookcontrollers_2.updateBooks);
router.get('/getAllBooks', bookcontrollers_3.getAllBooks);
router.delete('/deleteBooks', bookcontrollers_4.deleteBooks);
exports.default = router;

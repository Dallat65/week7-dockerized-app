"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorisation = req.headers.authorization;
        if (authorisation == undefined) {
            return res.status(401).send({
                status: "Error",
                message: "Please login to your account!"
            });
        }
        const pin = authorisation.split(" ")[1];
        if (!pin || pin === "") {
            return res.status(401).send({
                status: "Error",
                message: "Authorisation Failed!"
            });
        }
        const decoded = jsonwebtoken_1.default.verify(pin, "Daniely");
        if ("user" in req) {
            req.user = decoded;
        }
        return next();
    }
    catch (err) {
        console.log(err);
    }
});
exports.auth = auth;

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
exports.login = exports.createUser = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let databaseFolder = path_1.default.join(__dirname, "../../userDatabase");
let databaseFile = path_1.default.join(databaseFolder, "userDatabase.json");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create Database
        if (!fs_1.default.existsSync(databaseFolder)) {
            fs_1.default.mkdirSync(databaseFolder);
        }
        if (!fs_1.default.existsSync(databaseFile)) {
            fs_1.default.writeFileSync(databaseFile, "[]");
        }
        //Read database
        let databaseRead = [];
        try {
            const infos = fs_1.default.readFileSync(databaseFile, "utf-8");
            if (!infos) {
                return res.status(404).json({
                    message: `Error reading from database`,
                });
            }
            else {
                databaseRead = JSON.parse(infos);
            }
        }
        catch (parseError) {
            databaseRead = [];
        }
        //Read from frontend
        const { userName, email, password } = req.body;
        const existtingEmail = databaseRead.find((user) => user.email == email);
        const existinguserName = databaseRead.find((user) => user.userName == userName);
        if (existtingEmail) {
            return res.send({
                message: `This email is already in use`,
            });
        }
        if (existinguserName) {
            return res.send({
                message: `${userName} is already in use. Please choose another username.`,
            });
        }
        // Password encryption
        const saltlength = 17;
        const salt = yield bcrypt_1.default.genSalt(saltlength);
        const hash = yield bcrypt_1.default.hash(password, salt);
        // Create the User
        const newUser = {
            id: (0, uuid_1.v4)(),
            email: email,
            userName: userName,
            password: hash,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        databaseRead.push(newUser);
        fs_1.default.writeFileSync(databaseFile, JSON.stringify(databaseRead, null, 2), "utf-8");
        return res.status(200).json({
            message: `User successfully created!`,
            newUser: newUser,
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.createUser = createUser;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Read from database
        let readDatabase = [];
        const infos = fs_1.default.readFileSync(databaseFile, "utf-8");
        if (!infos) {
            return res.status(404).json({
                message: `Error reading database`,
            });
        }
        else {
            readDatabase = JSON.parse(infos);
        }
        const { email, password } = req.body;
        const thisUser = readDatabase.find((user) => user.email == email);
        if (!thisUser) {
            return res.send({
                message: `User does not exist. Please create an account`,
            });
        }
        if (thisUser) {
            const validate = yield bcrypt_1.default.compare(password, thisUser.password);
            if (validate) {
                const token = jsonwebtoken_1.default.sign(thisUser, "Daniely");
                return res.status(200).json({
                    message: "Login Successful",
                    email: thisUser.email,
                    token: token,
                });
            }
            else {
                return res.send(400).json({
                    message: "Incorrect Password!",
                });
            }
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.login = login;

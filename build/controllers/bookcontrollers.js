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
exports.deleteBooks = exports.getAllBooks = exports.updateBooks = exports.createBooks = void 0;
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
let databaseFolder = path_1.default.join(__dirname, "../../bookDatabase");
let databaseFile = path_1.default.join(databaseFolder, "bookDatabase.json");
const createBooks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create Database
        if (!fs_1.default.existsSync(databaseFolder)) {
            fs_1.default.mkdirSync(databaseFolder);
        }
        if (!fs_1.default.existsSync(databaseFile)) {
            fs_1.default.writeFileSync(databaseFile, " ");
        }
        //Read database
        let allBooks = [];
        try {
            const infos = fs_1.default.readFileSync(databaseFile, "utf-8");
            if (!infos) {
                return res.status(404).json({
                    message: `Error reading from database`
                });
            }
            else {
                allBooks = JSON.parse(infos);
            }
        }
        catch (parseError) {
            allBooks = [];
        }
        const { title, author, datePublished, description, pageCount, genre, bookId, publisher } = req.body;
        let existingBook = allBooks.find((book) => book.title == title);
        if (existingBook) {
            return res.send({
                message: `${req.body.title} is already in the library.`
            });
        }
        let newBook = {
            title: title,
            author: author,
            datePublished: datePublished,
            description: description,
            pageCount: pageCount,
            genre: genre,
            bookId: (0, uuid_1.v4)(),
            publisher: publisher,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        allBooks.push(newBook);
        fs_1.default.writeFile(databaseFile, JSON.stringify(allBooks, null, 2), 'utf-8', (err) => {
            if (err) {
                return res.status(500).json({
                    message: `Error in uploading to the the library`
                });
            }
            else {
                res.status(200).json({
                    message: `Book uploaded sucessfully!`,
                    newBook
                });
            }
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.createBooks = createBooks;
// ============Update Book==============
const updateBooks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Read database
        let allBooks = [];
        try {
            const infos = fs_1.default.readFileSync(databaseFile, "utf-8");
            if (!infos) {
                return res.status(404).json({
                    message: `Error reading from database`
                });
            }
            else {
                allBooks = JSON.parse(infos);
            }
        }
        catch (parseError) {
            allBooks = [];
        }
        const { bookId } = req.body;
        let updatedBookIndex = allBooks.findIndex((book) => book.bookId === bookId);
        if (!updatedBookIndex) {
            return res.status(404).json({
                message: `Book not found in the library`
            });
        }
        const updatedBook = Object.assign(Object.assign(Object.assign({}, allBooks[updatedBookIndex]), req.body), { updatedAt: new Date() });
        allBooks[updatedBookIndex] = updatedBook;
        fs_1.default.writeFile(databaseFile, JSON.stringify(allBooks, null, 2), 'utf-8', (err) => {
            if (err) {
                return res.status(500).json({
                    message: `Error in updating the library`
                });
            }
            else {
                res.status(200).json({
                    message: `Book updated successfully!`,
                    updatedBook
                });
            }
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.updateBooks = updateBooks;
//===================Get AllBooks====================
const getAllBooks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Read database
        let allBooks = [];
        try {
            const infos = fs_1.default.readFileSync(databaseFile, "utf-8");
            if (!infos) {
                return res.status(404).json({
                    message: `Error reading from database`
                });
            }
            else {
                allBooks = JSON.parse(infos);
                res.send(allBooks);
            }
        }
        catch (parseError) {
            allBooks = [];
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.getAllBooks = getAllBooks;
//====================Delete Books====================
const deleteBooks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Read database
        let allBooks = [];
        try {
            const infos = fs_1.default.readFileSync(databaseFile, "utf-8");
            if (!infos) {
                return res.status(404).json({
                    message: `Error reading from database`
                });
            }
            else {
                allBooks = JSON.parse(infos);
            }
        }
        catch (parseError) {
            allBooks = [];
        }
        const { title } = req.body;
        let booktoDelete = allBooks.find((book) => book.title == title);
        if (booktoDelete) {
            allBooks.splice(booktoDelete, 1);
        }
        fs_1.default.writeFile(databaseFile, JSON.stringify(allBooks, null, 2), 'utf-8', (err) => {
            if (err) {
                return res.status(500).json({
                    message: `Error in deteting the the library`
                });
            }
            else {
                res.status(200).json({
                    message: `Book deleted sucessfully!`,
                });
            }
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.deleteBooks = deleteBooks;

import express, { Request, Response, NextFunction} from 'express';
import {v4} from 'uuid';
import path from 'path';
import fs from 'fs';



let databaseFolder = path.join(__dirname, "../../bookDatabase")
let databaseFile = path.join(databaseFolder, "bookDatabase.json")

export const createBooks = async (req: Request, res:Response, next:NextFunction) =>{
    try{
        // Create Database
        if (!fs.existsSync(databaseFolder)) {
            fs.mkdirSync(databaseFolder)
        } if(!fs.existsSync(databaseFile)){
            fs.writeFileSync(databaseFile, " ")
        }
        //Read database
        let allBooks:any[] = [];
        try{
            const infos = fs.readFileSync(databaseFile, "utf-8")
            if (!infos){
                return res.status(404).json({
                    message: `Error reading from database`
                })
            }else{
                allBooks = JSON.parse(infos)
            }
        }catch(parseError){
            allBooks = [];
        }

        const {
            title,
            author,
            datePublished,
            description,
            pageCount,
            genre,
            bookId,
            publisher
        } = req.body

        let existingBook = allBooks.find((book) => book.title == title);
        if(existingBook){
            return res.send({
                message: `${req.body.title} is already in the library.`
            })
        }

        let newBook = {
            title: title,
            author: author,
            datePublished: datePublished,
            description: description,
            pageCount: pageCount,
            genre: genre,
            bookId: v4(),
            publisher: publisher,
            createdAt: new Date (),
            updatedAt: new Date ()
        }

        allBooks.push(newBook) 

        fs.writeFile(databaseFile, JSON.stringify(allBooks, null, 2), 'utf-8', (err) =>{
            if (err) {
                return res.status(500).json({
                    message: `Error in uploading to the the library`
                })
            }else{
                res.status(200).json({
                    message: `Book uploaded sucessfully!`,
                    newBook
                })
            }
        })


    }catch (err){
        console.log(err); 
    }
}



// ============Update Book==============

export const updateBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Read database
      let allBooks: any[] = [];
      try {
        const infos = fs.readFileSync(databaseFile, "utf-8");
        if (!infos) {
          return res.status(404).json({
            message: `Error reading from database`
          });
        } else {
          allBooks = JSON.parse(infos);
        }
      } catch (parseError) {
        allBooks = [];
      }
  
      const { bookId } = req.body;
  
      let updatedBookIndex = allBooks.findIndex((book: any) => book.bookId === bookId);
      if (!updatedBookIndex) {
        return res.status(404).json({
          message: `Book not found in the library`
        });
      }
  
      const updatedBook = {
        ...allBooks[updatedBookIndex],
        ...req.body,
        updatedAt: new Date()
      };
  
      allBooks[updatedBookIndex] = updatedBook;
  
      fs.writeFile(databaseFile, JSON.stringify(allBooks, null, 2), 'utf-8', (err) => {
        if (err) {
          return res.status(500).json({
            message: `Error in updating the library`
          });
        } else {
          res.status(200).json({
            message: `Book updated successfully!`,
            updatedBook
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  
  



//===================Get AllBooks====================


export const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Read database
      let allBooks: any[] = [];
      try {
        const infos = fs.readFileSync(databaseFile, "utf-8");
        if (!infos) {
          return res.status(404).json({
            message: `Error reading from database`
          });
        } else {
          allBooks = JSON.parse(infos);
          res.send(allBooks);
        }
      } catch (parseError) {
        allBooks = [];
      }
    } catch (err) {
      console.log(err);
    }
  };
  


  //====================Delete Books====================
  export const deleteBooks = async (req: Request, res:Response, next:NextFunction) =>{
    try{
        
        //Read database
        let allBooks:any[] = [];
        try{
            const infos = fs.readFileSync(databaseFile, "utf-8")
            if (!infos){
                return res.status(404).json({
                    message: `Error reading from database`
                })
            }else{
                allBooks = JSON.parse(infos)
            }
        }catch(parseError){
            allBooks = [];
        }

        const { title } = req.body

        let booktoDelete = allBooks.find((book) => book.title == title);
        if(booktoDelete){
             allBooks.splice(booktoDelete, 1)
        }

        

        fs.writeFile(databaseFile, JSON.stringify(allBooks, null, 2), 'utf-8', (err) =>{
            if (err) {
                return res.status(500).json({
                    message: `Error in deteting the the library`
                })
            }else{
                res.status(200).json({
                    message: `Book deleted sucessfully!`,
                   
                })
            }
        })


    }catch (err){
        console.log(err);
    }
}

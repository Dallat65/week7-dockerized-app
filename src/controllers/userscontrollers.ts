import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import jwt from "jsonwebtoken";

let databaseFolder = path.join(__dirname, "../../userDatabase");
let databaseFile = path.join(databaseFolder, "userDatabase.json");

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Create Database
    if (!fs.existsSync(databaseFolder)) {
      fs.mkdirSync(databaseFolder);
    }
    if (!fs.existsSync(databaseFile)) {
      fs.writeFileSync(databaseFile, "[]");
    }
    //Read database
    let databaseRead: any[] = [];
    try {
      const infos = fs.readFileSync(databaseFile, "utf-8");
      if (!infos) {
        return res.status(404).json({
          message: `Error reading from database`,
        });
      } else {
        databaseRead = JSON.parse(infos);
      }
    } catch (parseError) {
      databaseRead = [];
    }

    //Read from frontend
    const { userName, email, password } = req.body;

    const existtingEmail = databaseRead.find(
      (user: any) => user.email == email
    );
    const existinguserName = databaseRead.find(
      (user: any) => user.userName == userName
    );

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
    const salt = await bcrypt.genSalt(saltlength);
    const hash = await bcrypt.hash(password, salt);

    // Create the User
    const newUser = {
      id: v4(),
      email: email,
      userName: userName,
      password: hash,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    databaseRead.push(newUser);

    fs.writeFileSync(
      databaseFile,
      JSON.stringify(databaseRead, null, 2),
      "utf-8"
    );
    return res.status(200).json({
      message: `User successfully created!`,
      newUser: newUser,
    });
  } catch (err) {
    console.log(err);
  }
};

export const login = async ( req: Request, res: Response,next: NextFunction) => {
  try {
    // Read from database
    let readDatabase: any[] = [];
    const infos = fs.readFileSync(databaseFile, "utf-8");
    if (!infos) {
      return res.status(404).json({
        message: `Error reading database`,
      });
    } else {
      readDatabase = JSON.parse(infos);
    }

    const { email, password } = req.body;
    const thisUser = readDatabase.find((user: any) => user.email == email);
    if (!thisUser) {
      return res.send({
        message: `User does not exist. Please create an account`,
      });
    }
    if (thisUser) {
      const validate = await bcrypt.compare(password, thisUser.password);
      if (validate) {
        const token = jwt.sign(thisUser, "Daniely");
        return res.status(200).json({
          message: "Login Successful",
          email: thisUser.email,
          token: token,
        });
      } else {
        return res.send(400).json({
          message: "Incorrect Password!",
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

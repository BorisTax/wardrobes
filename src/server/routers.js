import messages from './messages.js'
import {captions as ruCaptions} from './locale/ru.js';
import {captions as uaCaptions} from './locale/ua.js';
import express from "express";
import emailValidator from 'deep-email-validator';
import {
  getUsers,
  loginUser,
  registerUser,
  sendMail,
  activate,
  isUserEmailExist,
  isUserNameExist
} from "./users.js";

import { getCaptions } from "./options.js";

const captions = {"ru": ruCaptions, "ua": uaCaptions}
export const router = express.Router();

router.post("/login", async (req, res) => {
  const user = req.body;
  if (!user.name) user.name = "";
  if (!user.password) user.password = "";
  const result = await loginUser(user);
  //if(result.success) res.cookie('token',result.token,{httpOnly:false})
  res.json(result);
});
router.post("/lang", async (req, res) => {
  let lang = req.body.lang;
  const result = captions[lang]
  if (!result) res.sendStatus(500);
  else res.json(result);
});

router.post("/register", async (req, res) => {
  const user = req.body;
  if (!user.name || !user.password || !user.email) return res.json({ success: false, errCode: messages.INVALID_USER_DATA });
  result = await registerUser(user);
  res.json(result);
});

router.post("/users", async (req, res) => {
  var result
  result = await getUsers();
  res.json(result);
});

router.post("/checkname", async (req, res) => {
  const name = req.body.name;
  const result = await isUserNameExist(name);
  res.json(result);
});

router.post("/checkemail", async (req, res) => {
  const email = req.body.email;
  const result = await isUserEmailExist(email);
  res.json(result);
});


router.post("/emailvalid", async (req, res) => {
  const email = req.body.email;
  const result = await emailValidator.validate(email);
  res.json(result);
});

router.post("/send", async (req, res) => {
  const user = req.body;
  const result = await sendMail(user.email);
  res.json(result);
});
router.post("/activate", async (req, res) => {
  const code = req.body.code;
  const userName = req.body.name
  if (!code) {
    res.json({ success: false, message: messages.INVALID_ACTIVATION_CODE });
  } else {
    const result = await activate(userName, code);
    res.json(result);
  }
});

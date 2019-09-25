import crypto from "crypto";
import knex from 'knex';
import logger from '../boot/logger';
import { default as config } from "../config";
import pug from 'pug';

export default function (req, res) {
  return res.render('index', { title: 'This is Didarul TESTING Template' });
}



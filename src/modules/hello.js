import crypto from "crypto";
import knex from 'knex';
import logger from '../boot/logger';
import { default as config } from "../config";
import * as pdb from '../utils/db';
import * as utils from '../utils/utils';

const db = knex({
  client: "pg",
  connection: config.db,
  searchPath: ["knex", "public"],
  ssl: true
});

export default function (req, res) {

  pdb.verifyEmail("didarul@somewhere.com").then(rows => {
     console.log("TEST: ", rows);
  });

  pdb.saveData(['contents', {
    title: 'hey there', 
    device_name: 'smart display', 
    action: 'save', 
    data: 'this is crazy!!!', 
  }, 'id']).then(rows => {
     console.log("TEST: ", rows);
  });

  let authToken = crypto.randomBytes(20).toString("hex");
  const userEmail = req.body.email.toLowerCase() || "didarul@somewhere.com";
  db("users")
    .select()
    .where({ email: userEmail })
    .then(rows => {
      if (rows[0]) {
        rows[0].auth_token = authToken;
        res.status(200).json(rows[0]);
      }
      else {
        res.status(400).json({ msg: 'No matching records found.' });
      }
      logger.log({
        level: "info",
        message: `User logged in ${userEmail}`
      });
    })
    .catch(error => {
      res.status(500).json({ error });
    });
}

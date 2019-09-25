/**
 * DB WRAPPER MODULE
 */
import { default as config } from "../config";
import jwt from 'jsonwebtoken';
import knex from 'knex';
import logger from '../boot/logger';
import * as utils from '../utils/utils';

const authKey = process.env.AUTH_TOKEN_KEY || '1234566';
const authSec = process.env.AUTH_TOKEN_SECRET || '1234566';

const db = knex({
  client: "pg",
  connection: config.db,
  searchPath: ["knex", "public"],
  ssl: true
});

/**
 * Verify email address for login
 */
const verifyEmail = (userEmail) => {
  return db('users')
    .where({ email: userEmail.toLowerCase() })
    .then((rows) => {
      logger.log({
        level: 'info',
        message: `AUTH: Login access ${userEmail} .`,
      });
      return rows[0];
    });
};

/**
 * UPDATE USER LOGIN ACCESS TOKEN
 * Update token with each successful login
 */
const updateToken = (userEmail) => {
  const authToken = jwt.sign(authKey, authSec);
  return db('users')
    .where('email', userEmail)
    .update('auth_token', authToken)
    .then((result) => {
      logger.log({
        level: 'info',
        message: `AUTH: Token updated access ${authToken} .`,
      });
      return authToken;
    });
};


/**
 * Save data
 * @param params
 * params is array [table, data_object, primary_key, user_id]
 */
const saveData = async (params) => {
  const [table, object, constraint] = params;
  const currentDate = await new Date()
    .toISOString()
    .replace(/T/, ' ')
    .replace(/\..+/, '');
  object['created_at'] = currentDate;
  object['updated_at'] = currentDate;

  // If no ID value passed, consider it an update action.
  if (object['id'] < 1) {
    delete object['id'];
  }

  console.log("ENV:", process.env.ENV_NAME);
  console.log("Data Obj:", config.db);

  logger.log({ level: 'info', message: 'DB: Record save successfull.' });
  return db
    .raw(`? ON CONFLICT (${constraint}) DO ? returning *`, [
      db(table).insert(object),
      db.queryBuilder().update(object),
    ])
    .get('rows')
    .catch(error => {
      logger.log({
        level: 'info',
        message: 'DB: Record save failed.',
      });
      throw new Error(`DB Query Failed: ${error}`);
    });
};


/**
 * Fetch Article
 *
 * Fetch with specific ID
 * db.getData({ id: 12})
 *
 * Pagination request
 * db.getData({limit: 10, offset: 4 })
 */
const getArticle = (params) => {
  let whereClause = {};
  const limitVal = params.limit || 25;
  const offsetVal = params.offset || 0;
  if (params.id) {
    whereClause = { 'content.id': params.id };
  }
  return db
    .select('*')
    .from('content')
    .leftJoin('article', 'content.id', 'article.id')
    .where(whereClause)
    .limit(limitVal)
    .offset(offsetVal)
    .then((rows) => {
      return { data: rows, code: 200, status: 'ok', msg: '' };
    });
};

/**
 * Fetch records from DB
 *
 * Fetch with specific ID
 * db.getData({ id: 12, type: content})
 *
 * Pagination request
 * db.getData({ type: content })
 * db.getData({ type: content, limit: 10, offset: 4 })
 */
const getData = (params) => {
  let whereClause = {};
  const limitVal = params.limit || 25;
  const offsetVal = params.offset || 0;

  if (!params.type) {
    return {
      code: 500,
      data: {},
      msg: `DB: No content type found.`,
      status: 'failed',
    };
  }

  if (params.id) {
    whereClause = { id: params.id };
  }

  if (params.type === 'revision' && params.rec_id) {
    whereClause = { rec_id: params.rec_id };
  }

  return db(params.type)
    .where(whereClause)
    .limit(limitVal)
    .offset(offsetVal)
    .then((rows) => {
      logger.log({
        level: 'info',
        message: `Data Fetched from ${params.type} with ${params.type}.`,
      });
      const resultObj = rows && rows.length === 1 ? rows[0] : rows;
      if (rows && rows.length > 0) {
        return { data: resultObj, code: 200, status: 'ok', msg: '' };
      }
      logger.log({
        level: 'error',
        message: `DB: No records found for table ${params.type} with ${
          params.id
        }.`,
      });
      return {
        code: 500,
        data: {},
        msg: `DB: No records found for table ${params.type} with id ${
          params.id
        }.`,
        status: 'failed',
      };
    })
    .catch(error => {
      return {
        code: 500,
        data: {},
        msg: `DB: Query failed for table ${params.type}`,
        status: 'failed',
      };
    });
};

/**
 * Delete records
 * URL /post/TABLE_NAME/ID_VALUE
 * db.delData({action : delete, token: 'adfafasf' });
 */
const delData = (params) => {
  let whereClause = {};

  if (params.id) {
    whereClause = { id: params.id };
  } else {
    return {
      code: 500,
      data: {},
      msg: `DB: No ID value found.`,
      status: 'failed',
    };
  }

  return db(params.type)
    .where(whereClause)
    .del()
    .then((rows) => {
      logger.log({
        level: 'info',
        message: `POST: Deleted record .`,
      });

      if (!rows) {
        throw new Error('There was an error executing this query.');
      } else {
        return {
          code: 200,
          data: {},
          msg: 'Record deleted succssfully.',
          status: 'ok',
        };
      }
    })
    .catch(error => {
      return { data: {}, code: 500, status: 'failed', msg: `${error}` };
    });
};

/**
 * Create article helper
 * @param contentData (Main content table data)
 * @param articleData (Article content table data)
 * @param res (Express response object)
 */
const createArticle = (
  contentData,
  articleData,
  res,
) => {
  saveData(contentData)
    .then(result => {
      return utils.updateObj(articleData, 'id', result[0].id);
    })
    .then(result => {
      return saveData(result);
    })
    .then(result => {
      utils.displayData(res, {
        code: 200,
        data: result,
        msg: `DB: Saved successfully.`,
        status: 'ok',
      });
    });
};

export {
  db,
  verifyEmail,
  updateToken,
  getData,
  delData,
  saveData,
  createArticle,
  getArticle,
};

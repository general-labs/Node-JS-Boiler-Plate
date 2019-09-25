/**
 * UTILITY MODULE / HELPER FUNCTIONS
 */

/**
 * Helper function to slugify any text/title
 */

/* tslint:disable:no-string-literal */
const slugify = (text = '') => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

/**
 * Display express response object.
 */
const displayMSG = (msg, code = 200, res) => {
  res.status(code).send({
    msg,
    status: code === 200 ? 'ok' : 'error',
  });
};

/**
 * Display response
 * @param express response object
 * @param result result data
 */
const displayData = (res, result) => {
  res.status(result.code).send({
    data: result.data,
    message: result.msg,
    status: result.status,
  });
};

/**
 * Generate common return response object.
 * Example calls
 * utils.displayObj(object);
 * utils.displayObj(msg);
 * utils.displayObj(msg, http status code);
 */
const displayObj = (...returnObj) => {
  let [msg, code = 200, data = {}] = returnObj;
  if (typeof msg === 'object') {
    code = code;
    data = msg;
    msg = '';
  }
  return { msg, code, data, status: code === 200 ? 'ok' : 'failed' };
};



/**
 * Append items into existing object
 * @param obj
 * @param key
 * @param val
 */
const updateObj = (obj, key, val) => {
  const [table, object, constraint] = obj;
  return new Promise((resolve, reject) => {
    object[key] = val;
    const postObject = [table, object, constraint];
    resolve(postObject);
  });
};

export {
  slugify,
  displayMSG,
  displayData,
  displayObj,
  updateObj,
};

/** User class for message.ly */
const bcrypt = require("bcrypt")
const { BCRYPT_WORK_FACTOR } = require("../config");
const db = require("../db")
const ExpressError = require("../expressError")



/** User of the site. */

class User {
  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register(username, password, first_name, last_name, phone) { 
    // const {username, password, first_name, last_name, phone} = req.body;
    const HASHED_PASSWORD = await bcrypt.hash(password, BCRYPT_WORK_FACTOR)
    const results = await db.query(`INSERT INTO users (username, password, first_name, last_name, phone, join_at)
                                    VALUES ($1, $2, $3, $4, $5, current_timestamp) 
                                    RETURNING id, username, password, first_namme, last_name, phone, join_at`, 
                                    [username, HASHED_PASSWORD, first_name, last_name, phone])

                                    return results.rows[0]
  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) { 
    // const {username, password} = req.body;
    const result = await db.query(`SELECT password FROM users WHERE username = $1`, [username])
    const user = result.rows[0]
    return bcrypt.compare(password, user.password)
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) { 
    const results = await db.query(`UPDATE users SET last_login_at = current_timestamp WHERE = $1
                                                  RETURNING last_login_at`,
                                      [username])
                                      if (results.rows.length === 0) {
                                        throw new ExpressError(`No such username: ${username}`);
                                      }
                                  
                                      return results.rows[0].last_login_at;
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() { 
    const result = await db.query(`SELECT username, first_name, last_name, phone FROM users`)
    return result.rows.map(d => new User(d.username, d.first_name, d.last_name, d.phone))
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) { 
    const result = await db.query(`SELECT username, first_name, last_name, phone FROM users WHERE username = $1`,
    [username])

    if (result.rows.length === 0) throw new ExpressError(`No such user: ${username}`);
    
     return result.rows[0]
    
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) { 
    const results =  await db.query('SELECT')
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) { 

  }
}


module.exports = User;
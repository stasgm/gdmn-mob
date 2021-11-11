export default {
  /**
   * URL of the API : http://API_URL:PORT/...
   */
  API_URL: 'localhost',

  /**
   * Logs localisation
   */
  LOG_COMBINED_PATH: 'logs/combined.log',

  /**
   * Error logs localisation
   */
  LOG_ERROR_PATH: 'logs/error.log',
  /**
   * Server port that you will find in the URL :
   * http://API_URL:PORT/...
   */
  PORT: 8000,

  /**
   * Firebird database host (localhost or IP adress)
   *  S5/3054:k:/Bases/Broiler/GDBASE2021_6_1.FDB
   */

  FIREBIRD_HOST: 'S5',

  /**
   * Firebird database Port (mainly 3050)
   */
  FIREBIRD_PORT: 3054,

  /**
   * Firebird database path
   * d:\TEST.FDB
   */

  FIREBIRD_DATABASE: 'k:\\Bases\\Broiler\\GDBASE2021_6_1.FDB',

  /**
   * Firebird connection username
   */

  FIREBIRD_USER: 'SYSDBA',

  /**
   * Firebird connection password
   */
  FIREBIRD_PASSWORD: 'masterkey',

  /**
   * Application version
   */
  VERSION: '0.0.1',
};

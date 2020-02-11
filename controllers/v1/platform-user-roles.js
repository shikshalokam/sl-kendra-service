/**
 * name : user-extensions.js
 * author : Aman Jung Karki
 * created-date : 11-Feb-2020
 * Description : All user extension related information.
 */

const platformUserRolesHelper = require(MODULES_BASE_PATH + "/platform-user-roles/helper.js");

/**
    * PlatformUserRoles
    * @class
*/

module.exports = class PlatformUserRoles {
  
  constructor() {}

  static get name() {
    return "platform-user-roless";
  }

  getProfile(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let getUserProfile = await platformUserRolesHelper.getProfile(
          (req.params._id && req.params._id != "") ? req.params._id : req.userDetails.userId,
          req.userDetails.userToken
        );

        return resolve(getUserProfile);

      } catch(error) {
        
        return reject({
          status: 
          error.status || 
          httpStatusCode["internal_server_error"].status,

          message: 
          error.message || 
          httpStatusCode["internal_server_error"].message
        });
      }
    });
  }

};
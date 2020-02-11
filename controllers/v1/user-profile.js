/**
 * name : user-extensions.js
 * author : Aman Jung Karki
 * created-date : 11-Feb-2020
 * Description : All user extension related information.
 */

const userProfileHelper = require(MODULES_BASE_PATH + "/user-profile/helper.js");

/**
    * UserProfile
    * @class
*/

module.exports = class UserProfile {
  
  constructor() {}

  static get name() {
    return "user-profile";
  }

  create(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let createUserProfile = await userProfileHelper.create(
          req.body,
          req.userDetails.userToken
        );

        return resolve(createUserProfile);

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

  update(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let updateUserProfile = await userProfileHelper.update(
          req.body,
          req.userDetails.userToken
        );

        return resolve(updateUserProfile);

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

  verify(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let verifyUserProfile = await userProfileHelper.verify(
          req.params._id,
          req.userDetails.userToken
        );

        return resolve(verifyUserProfile);

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
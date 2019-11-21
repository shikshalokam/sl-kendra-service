
module.exports = class userExtensionHelper {

    static userExtensionDocument(filterQueryObject, projection = {}) {
        return new Promise(async (resolve, reject) => {
            try {

                let userExtensionData = await database.models.userExtension.findOne(filterQueryObject, projection).lean()

                return resolve(userExtensionData)

            } catch (error) {
                return reject(error);
            }
        })


    }

    static createOrUpdate(deviceData, userDetails) {

        return new Promise(async (resolve, reject) => {
            try {

                let userExtensionData = await this.userExtensionDocument({
                    userId: userDetails.userId,
                    status: "active",
                    isDeleted: false
                }, { devices: 1 })

                let response = {}

                if (userExtensionData) {

<<<<<<< HEAD
<<<<<<< HEAD
                    let deviceNotFound = false;
=======
                    let deviceNotFound = false
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
=======
                    let deviceNotFound = false
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717

                    if (userExtensionData.devices && userExtensionData.devices.length > 0) {

                        let matchingDeviceData = userExtensionData.devices.find(eachDevice => eachDevice.deviceId === deviceData.deviceId);

                        if (!matchingDeviceData) {

<<<<<<< HEAD
<<<<<<< HEAD
                            deviceNotFound = true;
                        }

                    } else {
                        deviceNotFound = true;
=======
=======
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
                            deviceNotFound = true
                        }

                    } else {
                        deviceNotFound = true
<<<<<<< HEAD
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
=======
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
                    }

                    if (deviceNotFound) {

                        let updatedData = await database.models.userExtension.findOneAndUpdate({
                            userId: userDetails.userId,
                        }, { $addToSet: { devices: deviceData } }).lean();

                        if (updatedData) {
                            response["success"] = true
                            response["message"] = `Added Successfully device id ${deviceData.deviceId} for user ${userDetails.email}`
                        } else {
                            throw `Could not add device id ${deviceData.deviceId} for user ${userDetails.email}`
                        }
                    }

                } else {

                    let createUserExtension = await database.models.userExtension.create(
                        {
                            "userId": userDetails.userId,
                            "externalId": userDetails.userName,
                            "devices": [deviceData],
                            "createdBy": "SYSTEM",
                            "updatedBy": "SYSTEM"
                        }
                    )

                    if (createUserExtension) {
                        response["success"] = true
                        response["message"] = `Successfully created user ${userDetails.userId} in userExtension`
                    } else {
                        throw `Could not create user ${userDetails.userId} in userExtension`
                    }

                }

                return resolve(response)

            } catch (error) {
                return reject(error);
            }
        })


    }


    static updateDeviceStatus(deviceData, deviceArray, userId) {

        return new Promise(async (resolve, reject) => {

<<<<<<< HEAD
            try {
                deviceArray.forEach(async devices => {
=======
            deviceArray.forEach(async devices => {

                delete devices['message'];
                delete devices['title'];
<<<<<<< HEAD
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
=======
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717

                    delete devices['message'];
                    delete devices['title'];

                    if (devices.deviceId == deviceData.deviceId) {
                        devices.status = "inactive"
                        devices.deactivatedAt = new Date();
                    }
                });

                let updateDevice = await database.models.userExtension.findOneAndUpdate(
                    { userId: userId },
                    { $set: { "devices": deviceArray } }
                ).lean();

                if (!updateDevice) {
                    throw "Could not update device."
                }

                return resolve({
                    success: true,
                    message: "successfuly updated the status to inactive"
                });

            } catch (error) {
                return reject(error)
            }

        })
    }


};





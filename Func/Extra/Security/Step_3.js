const crypto = require('crypto');
const aes = require("aes-js");
if (!require('../Src/SecurityCheck')()) {
    console.log("You Are Cheating !",require('../Src/SecurityCheck')());
    process.exit(0)
}
module.exports.encryptState = function encryptState(data, key) {
    let hashEngine = crypto.createHash("sha256");
    let hashKey = hashEngine.update(key).digest();
    let bytes = aes.utils.utf8.toBytes(data);
    let aesCtr = new aes.ModeOfOperation.ctr(hashKey);
    let encryptedData = aesCtr.encrypt(bytes);
    return aes.utils.hex.fromBytes(encryptedData);
}

module.exports.decryptState = function decryptState(data, key) {
    let hashEngine = crypto.createHash("sha256");
    let hashKey = hashEngine.update(key).digest();
    let encryptedBytes = aes.utils.hex.toBytes(data);
    let aesCtr = new aes.ModeOfOperation.ctr(hashKey);
    let decryptedData = aesCtr.decrypt(encryptedBytes);
    return aes.utils.utf8.fromBytes(decryptedData);
}

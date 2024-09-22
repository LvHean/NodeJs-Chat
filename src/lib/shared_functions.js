import crypto from 'crypto'
import bcrypt from 'bcrypt'

export function removeWhiteSpace(text) {
    text = text.replace("\n", "")
    text = text.replace("\\n", "")
    text = text.replace(/^\s+|\s+$/g, '');
    return text
}

export function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export function generateRandomText () {
    return crypto.randomBytes(64).toString('hex');
}

export function encryptText (text) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(text, salt);
}

export function compareEncryptedTextWithPlainText (encryptedText, plainText) {
    return bcrypt.compareSync(plainText, encryptedText);
}
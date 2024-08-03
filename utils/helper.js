// utils/helper.js

const crypto = require('crypto');

/**
 * تحقق مما إذا كان البريد الإلكتروني صحيحاً.
 * @param {string} email - البريد الإلكتروني الذي تريد التحقق منه.
 * @returns {boolean} - قيمة Boolean إذا كان البريد الإلكتروني صحيحًا.
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * تشفير النص باستخدام خوارزمية AES.
 * @param {string} text - النص الذي تريد تشفيره.
 * @param {string} secret - المفتاح السري للتشفير.
 * @returns {string} - النص المشفر.
 */
function encryptText(text, secret) {
  const cipher = crypto.createCipher('aes-256-cbc', secret);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

/**
 * فك تشفير النص المشفر باستخدام خوارزمية AES.
 * @param {string} encryptedText - النص المشفر الذي تريد فك تشفيره.
 * @param {string} secret - المفتاح السري لفك التشفير.
 * @returns {string} - النص المفكوك.
 */
function decryptText(encryptedText, secret) {
  const decipher = crypto.createDecipher('aes-256-cbc', secret);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/**
 * تنسيق التاريخ إلى صيغة محددة.
 * @param {Date} date - التاريخ الذي تريد تنسيقه.
 * @returns {string} - التاريخ المنسق.
 */
function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

/**
 * إنشاء رسالة خطأ مخصصة.
 * @param {string} message - رسالة الخطأ.
 * @param {number} [statusCode=500] - رمز الحالة HTTP.
 * @returns {object} - كائن الخطأ.
 */
function createError(message, statusCode = 500) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

module.exports = { isValidEmail, encryptText, decryptText, formatDate, createError };

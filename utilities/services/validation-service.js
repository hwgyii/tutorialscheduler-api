/**
 * @module ValidationService
 * @description A locally-made utility to check validity of fields dynamically and recursively
 * @author Elli Gwen Cabusay, Jomarie Guevarra
 * @version 1.0
 * @since July 13, 2021
 */

 const { get, isEmpty } = require("lodash");
 const moment = require('moment');
 
 //@ These are for developer-made instances of errors
 const VALIDATION_UTIL_ERROR_MESSAGE = "Validation util error: ";
 
 const validateDefaultData = (value, stringedDataType, dataType, fieldToCheck) => {
   const valueType = typeof value;
   
   if (valueType === stringedDataType && value.constructor.name == dataType) {
     return;
   }
   throw { message: `Value: ${value} for field ${fieldToCheck} should be a ${stringedDataType}. Found ${valueType}` }
 }
 
 const validateDate = (value, fieldToCheck) => {
   const valueType = typeof value;
 
   if (valueType === "string") {
     const isDateValidViaMoment = moment(value).isValid();
     if (!isDateValidViaMoment) {
       throw {
         message: `Value: ${value} for field ${fieldToCheck} should be a moment date (MM/DD/YYYY). Found ${valueType}`
       };
     }
   } else {
     throw {
       message: `Value: ${value} for field ${fieldToCheck} should be a moment date (MM/DD/YYYY). Found ${valueType}`
     };
   }
 }
 
 const checkData = (value, fieldToCheck, options) => {
   if (!options.type) {
     throw { message: `${VALIDATION_UTIL_ERROR_MESSAGE} Missing type for ${fieldToCheck}` };
   }
 
   switch (options.type) {
     case "string":
       return validateDefaultData(value, "string", "String", fieldToCheck);
     case "number":
       return validateDefaultData(value, "number", "Number", fieldToCheck);
     case "date":
       return validateDate(value, fieldToCheck);
     case "boolean":
       return validateDefaultData(value, "boolean", "Boolean", fieldToCheck);
     case "array":
       return validateDefaultData(value, "object", "Array", fieldToCheck);
     case "object":
       return validateDefaultData(value, "object", "Object", fieldToCheck);
     default:
       throw { message: `${VALIDATION_UTIL_ERROR_MESSAGE} Type ${options.type} for ${fieldToCheck} doesn't exist` };
   }
 }
 
 const validateFields = (objectToValidate={}, validations = {}, strictMode=false) => {
   const originalKeys = Object.keys(objectToValidate); 
   const fieldsToCheck = Object.keys(validations); 
 
   //@ Remove unnecesary fields from objectToValidate
   if (strictMode) {
     originalKeys.forEach(key => {
       if (!fieldsToCheck.includes(key)) {
         delete objectToValidate[key];
       }
     })
   }
 
   fieldsToCheck.forEach(fieldToCheck => {
     const value = get(objectToValidate, [fieldToCheck], undefined);
     const options = get(validations, [fieldToCheck]); 
 
     if (options.required && (!value || value === undefined)) {
       throw { message: `Field ${fieldToCheck} is required.` }
     }
     if (options.type === "object" && options.properties) {
       return validateFields(value, options.properties);
     }
 
     if (value && options.type === "arrayOfObjects" && options.properties && value.length) {
       value.forEach(currentObject => {
         validateFields(currentObject, options.properties);
       })
     }
     
     if (value && options.type !== "arrayOfObjects") {
       checkData(value, fieldToCheck, options);
     }
   });
 
   return objectToValidate;
 }
 
 const validateAllowedQueries = (reqQuery, allowedFields) => {
   if (isEmpty(reqQuery)) {
     return true;
   }
 
   let keys = Object.keys(reqQuery);
   return keys.every(key => allowedFields.includes(key));
 }
 
 module.exports = {
   validateFields,
   validateAllowedQueries
 }
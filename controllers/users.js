const express = require('express');
const router = express.Router();
const { isEmpty, get } = require('lodash');
const isValidObjectId = require("mongoose").isValidObjectId;
const { sendEmail } = require('../utilities/services/email-service');
const { EMAIL_BODY } = require('../common/email-body');
const { HTTP_CODES, ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../common/http-codes-and-messages');

const { validateFields } = require("../utilities/services/validation-service");

const TUTOR = require("../schemas/tutor");

router.post("/user/set-schedule", async (req, res) => {
  const body = req.body;

  let validatedBody;

  try{
    validatedBody = validateFields(body, {
      firstName: { type: "string", required: true },
      lastName: { type: "string", required: true },
      email: { type: "string", required: true },
      course: { type: "string", required: true },
      topic: { type: "string", required: true },
      remarks: { type: "string", required: false },
    });
  } catch (error) {
    return res.status(HTTP_CODES.SERVER_ERROR).json({
      message: error.message
    });
  }
  
  const schedule = {
    user: {
      firstName: validatedBody.firstName,
      lastName: validatedBody.lastName,
      email: validatedBody.email
    },
    course: validatedBody.course,
    topic: validatedBody.topic,
    date: validatedBody.date,
    remarks: validatedBody.remarks
  }

  const userToSched = body.userToSched;

  await sendEmail(userToSched.email, "Tutorial Appointment", EMAIL_BODY.SCHEDULING(userToSched, schedule), res);

  return res.status(HTTP_CODES.SUCCESS).json({
    message: "Schedule Appointment Sent"
  })
});

router.post("/user/register-tutor", async (req, res) => {
  const body = req.body;

  let validatedBody;

  try{
    validatedBody = validateFields(body, {
      firstName: { type: "string", required: true },
      lastName: { type: "string", required: true },
      email: { type: "string", required: true },
      availability: { type: "string", required: true },
      coursesToTeach: { type: "array", required: true }
    });

  } catch (error) {
    return res.status(HTTP_CODES.SERVER_ERROR).json({
      message: error.message
    });
  }

  try {
    const existingTutor = await TUTOR.find( { email: validatedBody.email });
    
    if (!isEmpty(existingTutor)) {
      return res.status(HTTP_CODES.UNPROCESSABLE_ENTITY).json({
        message: ERROR_MESSAGES.EMAIL_ALREADY_TAKEN
      });
    }

    const newTutor = await new TUTOR({
      firstName: validatedBody.firstName,
      lastName: validatedBody.lastName,
      email: validatedBody.email,
      availability: validatedBody.availability,
      coursesToTeach: validatedBody.coursesToTeach
    }).save();

    return res.status(HTTP_CODES.SUCCESS).json({
      mesage: SUCCESS_MESSAGES.TUTOR_REGISTERED
    });


  } catch (error) {
    return res.status(HTTP_CODES.SERVER_ERROR).json({
      message: error.message
    });
  }
});

router.get("/user/get-tutors", async (req, res) => {
  const tutors = await TUTOR.find();

  return res.json({
    tutors: tutors
  })
});

router.get("/user/filter-tutors", async (req, res) => {
  let query = req.query.keyword;

  let validatedQuery;


  try {
    validatedQuery = validateFields({ searchQuery: query }, {
      searchQuery: { type: "string" }
    }, true);
  } catch (error) {
    return res.status(HTTP_CODES.UNPROCESSABLE_ENTITY).json({
      message: error.message
    })
  }

  const findOptions = {
    $or: [
      { firstName: { $regex: validatedQuery.searchQuery, $options: "i" } },
      { lastName: { $regex: validatedQuery.searchQuery, $options: "i" } },
      { email: { $regex: validatedQuery.searchQuery, $options: "i" } },
      { coursesToTeach: { $in: validatedQuery.searchQuery } },
    ]
  }

  const tutors = await TUTOR.find(findOptions);

  return res.json({
    tutors: tutors
  });
});

module.exports = router;
module.exports = {
  EMAIL_BODY: {
    SCHEDULING: (userToSched, scheduleInformation) => {return(
        `
        Hello, ${userToSched.firstName}.
        
        A user is trying to schedule a tutorial appointment with you.
        His/Her/Their name is ${scheduleInformation.user.firstName} ${scheduleInformation.user.lastName}. and he/she/they are trying to ask if you can teach ${scheduleInformation.course} about the lesson ${scheduleInformation.topic} at ${scheduleInformation.date}.
        Please communicate with them with this email ${scheduleInformation.user.email}.

        Remarks:
        ${scheduleInformation.remarks}

        Thank you!

        UPLB COSS Tutorial Scheduler
        `
    )},
  }
}
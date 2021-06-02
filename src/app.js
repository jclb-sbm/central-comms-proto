const express = require("express");

const {
  getGsheetStudents,
  getCohortsByAdmin,
  getEmails,
  sendMail,
} = require("./gmail")

const app = express();

app.use(require("cors")())
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/gsheets", async (req, res) => {
  try {
    const resp = await getCohortsByAdmin(req.body);
    res.send(resp)
  } catch (e) {
    res.send(e)
  }
})

app.get("/gsheets/students", async (req, res) => {
  try {
    const resp = await getGsheetStudents(req.body);
    res.send(resp)
  } catch (e) {
    res.send(e)
  }
})

app.get("/emails", async (req, res) => {
  try {
    const resp = await getEmails(req.body)
    res.send(resp)
  } catch (e) {
    res.send(e)
  }
})

app.post("/send-email", async (req, res) => {
  try {
    const resp = await sendMail(req.body)
    res.send(resp)
  } catch (e) {
    res.send(e)
  }
})

app.post("/admin-emails", async (req, res) => {
  try {
    const cohorts = await getCohortsByAdmin(req.body);
    const cohortIds = cohorts.map(({ id }) => id)
    const students = await getGsheetStudents({cohortIds})
    const studentEmailAddresses = students.map(([,,email]) => email)

    const adminEmails = await getEmails(req.body)

    const directedGmailAddresses = studentEmailAddresses.map(studentEmail => {
      const gmailKeys = Object.keys(adminEmails)
      return gmailKeys.filter(key => {
        return key.includes(studentEmail)
      })
    })

    const privateMessages = directedGmailAddresses.map(gmailAddress => {
      let obj = {}
      obj[gmailAddress] = adminEmails[gmailAddress]
      return obj
    })

    res.json(privateMessages)
  } catch (e) {
    res.send(e)
  }
})

app.post("/email-hook", async (req, res) => {
  req.app.get('io').emit('new-email', req.body)
  res.send(req.body)
})

app.use("/slack", require("./slack"))

module.exports = app
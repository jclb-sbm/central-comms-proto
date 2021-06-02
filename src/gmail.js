const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);
oAuth2Client.setCredentials({ 
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

const GMAIL = google.gmail({
  version: "v1",
  auth: oAuth2Client
})

async function getEmails({ email }) {
  try {
    let resp = await GMAIL.users.messages.list({
      maxResults: 11,
      userId: email,
    })

    const reqs = resp.data.messages.map(({id}) => {
      return GMAIL.users.messages.get({
        id,
        userId: email,
      })
    })


    resp = await Promise.all(reqs)
    
    let emails = resp.map(r => {
      return {
        snippet: r.data.snippet,
        from: r.data.payload.headers.find(h => h.name === "From").value,
      }
    })

    let parsedEmails = {}
    emails.map(e => {
      if (!parsedEmails.hasOwnProperty(e.from)) {
        parsedEmails[e.from] = [e.snippet]
      } else {
        parsedEmails[e.from].push(e.snippet)
      }
    })


    return parsedEmails
  } catch (e) {
    return e
  }
}

async function sendMail({subject, text, to,}) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'johnchristian@kingslanduniversity.com',
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken,
      },
    });

    const mailOptions = {
      from: 'SENDER NAME <johnchristian@kingslanduniversity.com>',
      html: `<p>${text}</p>`,
      subject, to,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}

const GSHEET = google.sheets({
  version: "v4",
  auth: oAuth2Client
})

async function getCohortsByAdmin({ admin }) {
  try {
    const resp = await GSHEET.spreadsheets.values.get({
      spreadsheetId: "1pCIbAF46WLJNxPHzLydK3NA5ce34tO5Qdnr5Jo4_fVk",
      range: "A2:Z1000",
      majorDimension: "ROWS"
    })
    
    return resp.data.values.flatMap(([cohort, programAdmin, id]) => {
      if (admin !== programAdmin) return []
      return {cohort, id}
    })
  } catch (e) {
    return e
  }
}

async function getGsheetStudents({ cohortIds }) {
  try {
    const reqs = []
    cohortIds.map(id => {
      reqs.push(
        GSHEET.spreadsheets.values.get({
          spreadsheetId: id,
          range: "A2:Z1000",
          majorDimension: "ROWS"
        })
      )
    })
  
    const resp = await Promise.all(reqs);
    return resp[0].data.values
  } catch (e) {
    return e
  }
}

module.exports = {
  getGsheetStudents,
  getCohortsByAdmin,
  getEmails,
  sendMail,
}
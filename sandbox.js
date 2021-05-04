const gmails = {
  "pia@kingsland.io": [
      "This event has been changed. KIC Sprint Review and Retro When Wed May 5, 2021 10:30am – 12pm Philippine Standard Time Joining info Changed: Join Zoom Meeting us02web.zoom.us/j/86884186525 (ID:",
      "You have been invited to the following event. KIC Sprint Review and Retro When Wed May 5, 2021 10:30am – 12pm Philippine Standard Time Where https://us02web.zoom.us/u/kc2EPjKgUE (map) Calendar"
  ],
  "SENDER NAME <johnchristian@kingslanduniversity.com>": [
      "Hello from gmail email using API",
      "Hello from gmail email using API",
      "Hello from gmail email using API",
      "Hello from gmail email using API"
  ],
  "John Christian Los Banes <jclb.gaming@gmail.com>": [
      "new email",
      "Reply On Mon, May 3, 2021 at 5:53 PM John Christian Los Banes &lt;jclb.gaming@gmail.com&gt; wrote: PM PM PM",
      "PM PM PM"
  ],
  "\"Pia Bonilla (@piabianca)\" <gitlab@mg.gitlab.com>": [
      "Merge request !210 was merged — Reply to this email directly or view it on GitLab. You&#39;re receiving this email because of your account on gitlab.com. If you&#39;d like to receive fewer emails, you",
      "Merge request was approved (3/0) Merge request !210 was approved by Pia Bonilla Project Kingsland Innovation Centre PH / kingsland-student-database Branch 319-task-bundle Author Jechris Russel"
  ]
}

const studentEmailAddresses = [
  "johnchristian@kingslanduniversity.com",
  "jclb.gaming@gmail.com"
]

const directedGmailAddresses = studentEmailAddresses.map(studentEmail => {
  const gmailKeys = Object.keys(gmails)
  return gmailKeys.filter(key => {
    return key.includes(studentEmail)
  })
})


console.log(directedGmailAddresses.map(gmailAddress => {
  let obj = {}
  obj[gmailAddress] = gmails[gmailAddress]
  return obj
}))


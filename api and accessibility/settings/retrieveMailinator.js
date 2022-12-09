const got = require("pactum");

const options = {
  headers: {
    Authorization: sharedObjects.salesforceData.credentials.mailinator.apiKey,
  },
  throwHttpErrors: true,
  simple: false,
  allowGetBody: true,
  resolveWithFullResponse: true,
};

const retrieveAllEmails = async (inbox) => {
  try {
    console.log("Retrieving all emails...");
    options.url = `${env.mailinatorApiBaseUrl}/${inbox}`;
    const response = await got.get(options).json();

    return response.msgs;
  } catch (e) {
    console.error(e);
  }
};

const getVerificationCode = async (inbox) => {
  let messageId;
  let allCurrentReceivedEmails = [];

  while (allCurrentReceivedEmails.length < 1) {
    try {
      allCurrentReceivedEmails = await retrieveAllEmails(inbox);
      await browser.pause(DELAY_10s);
    } catch (e) {
      console.error(e);
    }
  }

  messageId = allCurrentReceivedEmails[allCurrentReceivedEmails.length - 1].id;
  options.url = `${env.mailinatorApiBaseUrl}/${inbox}/messages/${messageId}`;

  const verificationEmail = await got.get(options).json();
  const verificationEmailBody = verificationEmail.parts[0].body;

  console.log("Email retrieved");

  const verificationCode = verificationEmailBody
    .match(/Código de verificación: (\d+)/g)[0]
    .match(/\d+/g)[0];
  await got.delete(options);
  return verificationCode;
};

module.exports = getVerificationCode;

// import { google } from 'googleapis'; // Disabled for Edge compatibility

export async function getGoogleSheetsClient() {
  /*
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.readonly'
    ],
  });

  return google.sheets({ version: 'v4', auth });
  */
  throw new Error('Google Sheets client disabled for Edge compatibility');
}

export async function getSheetData(
  spreadsheetId: string,
  sheetName: string,
  range?: string
) {
  throw new Error('Direct sheet access disabled. Use the iframe method.');
}

export async function updateSheetData(
  spreadsheetId: string,
  sheetName: string,
  range: string,
  values: any[][]
) {
  throw new Error('Direct sheet update disabled.');
}

export async function getAvailableSheets(spreadsheetId: string) {
  return [];
}

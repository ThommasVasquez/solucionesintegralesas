import { google } from 'googleapis';

export async function getGoogleSheetsClient() {
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
}

export async function getSheetData(
  spreadsheetId: string,
  sheetName: string,
  range?: string
) {
  const sheets = await getGoogleSheetsClient();
  const fullRange = range || `${sheetName}!A1:ZZ1000`;
  
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: fullRange,
  });

  return response.data.values || [];
}

export async function updateSheetData(
  spreadsheetId: string,
  sheetName: string,
  range: string,
  values: any[][]
) {
  const sheets = await getGoogleSheetsClient();
  
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${sheetName}!${range}`,
    valueInputOption: 'RAW',
    requestBody: { values },
  });
}

export async function getAvailableSheets(spreadsheetId: string) {
  const sheets = await getGoogleSheetsClient();
  
  const response = await sheets.spreadsheets.get({
    spreadsheetId,
  });

  return response.data.sheets?.map(sheet => ({
    title: sheet.properties?.title || '',
    sheetId: sheet.properties?.sheetId || 0,
  })) || [];
}

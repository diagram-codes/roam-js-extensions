import { APIGatewayProxyEvent } from "aws-lambda";
import axios from "axios";

const apiKey = process.env.GOOGLE_CALENDAR_API_KEY;
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
};

export const handler = async (event: APIGatewayProxyEvent) => {
  const { calendarId, timeMin, timeMax } = event.queryStringParameters;
  if (!calendarId) {
    return {
      statusCode: 400,
      body: "calendarId is required",
      headers,
    };
  }
  if (!apiKey) {
    return {
      statusCode: 500,
      body: "No API key stored",
      headers,
    };
  }
  return axios
    .get(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&orderBy=startTime&singleEvents=true`
    )
    .then((r) => ({
      statusCode: 200,
      body: JSON.stringify(r.data),
      headers,
    }))
    .catch((e) => ({
      statusCode: 500,
      body: e.message,
      headers,
    }));
};
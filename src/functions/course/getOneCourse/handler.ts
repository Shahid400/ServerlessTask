import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { Dynamo } from '@libs/dynamodb';

//This function Get Course by id

const getOneCourse: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const { id } = event.pathParameters;
    const params = {
      TableName: 'SEMSTable',
      Key: {
        id
      },
    }
    //Get Course by id
    const data = await Dynamo.getData(params);
    const course = {
      coursecode: data.Item.coursecode,
      coursetitle: data.Item.coursetitle,
      CH: data.Item.CH,
    };
    if (data.Item) {
      const msg = "Course Found";
      return formatJSONResponse({
        message: msg, course
      });
    }
  } catch (error) {
    return formatJSONResponse({
      message: "Wrong ID"
    });
  }
}

export const main = middyfy(getOneCourse);

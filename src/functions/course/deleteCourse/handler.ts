import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { Dynamo } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';

import schema from './schema';

//This function Delete Course from DB

const deleteCourse: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const { id } = event.pathParameters;
    const params = {
      TableName: 'SEMSTable',
      Key: {
        id
      }
    }
    //Check if Course Exists in DB or not
    const data = await Dynamo.getData(params);
    if (data.Item.id === id) {
      //Delete Course
      const msg = await Dynamo.deleteData(params);
      return formatJSONResponse({
        message: `Course ${msg}`
      });
    }
  } catch (error) {
    return formatJSONResponse({
      message: "course not found"
    });
  }
}

export const main = middyfy(deleteCourse);

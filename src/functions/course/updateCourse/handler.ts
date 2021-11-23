import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { Dynamo } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';

import schema from './schema';

//This function Updates Course in DB

const updateCourse: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const { id } = event.pathParameters;
    const coursecode = event.body.coursecode;
    const coursetitle = event.body.coursetitle;
    const CH = event.body.CH;
    const params = {
      TableName: 'SEMSTable',
      Key: {
        id
      },
      UpdateExpression: "set coursecode = :cc, coursetitle = :ct, CH = :ch",
      ExpressionAttributeValues: {
        ":cc": coursecode,
        ":ct": coursetitle,
        ":ch": CH,
      },
    }
    const params1 = {
      TableName: 'SEMSTable',
      Key: {
        id
      }
    }
    // Check Course Exists in DB or not
    const data = await Dynamo.getData(params1);
    if (data.Item.id === id) {
      // Check the new Data matches the existing Data in DB or not
      if (data.Item.coursecode === coursecode && data.Item.coursetitle === coursetitle && data.Item.CH === CH) {
        return formatJSONResponse({
          message: "Course already exits"
        })
      } else {
        const msg = await Dynamo.updateData(params);
        return formatJSONResponse({
          message: `Course ${msg}`
        });
      }
    }
  } catch (error) {
    return formatJSONResponse({
      message: "Course not found"
    });
  }
}

export const main = middyfy(updateCourse);

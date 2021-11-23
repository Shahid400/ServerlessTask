import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { Dynamo } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';
import { v4 } from 'uuid';

import schema from './schema';

//This function adds new Course in DB

const createCourse: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    var id = v4();
    const TableName = 'SEMSTable';
    const coursecode = event.body.coursecode;
    const coursetitle = event.body.coursetitle;
    const CH = event.body.CH;
    const params = {
      TableName,
      Item: {
        id,
        coursecode,
        coursetitle,
        CH
      }
    };

    const params1 = {
      TableName: "SEMSTable",
      FilterExpression: 'coursecode = :tag',
      ExpressionAttributeValues: { ':tag': coursecode }
    };
    // Check if Course already exists or not
    const data = await Dynamo.getList(params1);
    if (data.Count === 0) {
      //Add new Course
      const msg = await Dynamo.createData(params);
      return formatJSONResponse({
        message: `New Course ${msg}`
      });
    } else {
      return formatJSONResponse({
        message: "Course already exist"
      });
    }
  } catch (error) {
    return formatJSONResponse({
      message: "Please sent the right body again"
    });
  }
}

export const main = middyfy(createCourse);

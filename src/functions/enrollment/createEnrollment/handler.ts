import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { Dynamo } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';
import { v4 } from 'uuid';

import schema from './schema';

//This function adds new Enrollment in DB

const createEnrollment: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    var id = v4();
    const TableName = 'SEMSTable';
    const courseid = event.body.courseid;
    const studentid = event.body.studentid;
    const dateofassignment = event.body.dateofassignment;
    const params = {
      TableName,
      Item: {
        id,
        courseid,
        studentid,
        dateofassignment
      }
    };
    const params1 = {
      TableName: "SEMSTable",
      FilterExpression: 'courseid = :tag',
      ExpressionAttributeValues: { ':tag': courseid }
    };

    // Check if Enrollment already exists or not
    const data = await Dynamo.getList(params1);
    if (data.Count === 0) {
      //Add new Enrollment
      const msg = await Dynamo.createData(params);
      return formatJSONResponse({
        message: `New enrollment ${msg}`
      });
    } else {
      if (data.Items[0].studentid === studentid) {
        return formatJSONResponse({
          message: "Enrollment already exist"
        });
      }
      else {
        const msg = await Dynamo.createData(params);
        return formatJSONResponse({
          message: `New enrollment ${msg}`
        });
      }
    }
  } catch (error) {
    return formatJSONResponse({
      message: "any of the body attributes is not upto mark"
    });
  }
}

export const main = middyfy(createEnrollment);

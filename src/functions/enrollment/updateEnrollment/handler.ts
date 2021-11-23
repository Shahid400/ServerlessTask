import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { Dynamo } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';

import schema from './schema';

//This function Updates Enrollment in DB

const updateEnrollment: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const { id } = event.pathParameters;
    const courseid = event.body.courseid;
    const studentid = event.body.studentid;
    const dateofassignment = event.body.dateofassignment;
    const params = {
      TableName: 'SEMSTable',
      Key: {
        id
      },
      UpdateExpression: "set courseid = :ci, studentid = :si, dateofassigment = :doa",
      ExpressionAttributeValues: {
        ":ci": courseid,
        ":si": studentid,
        ":doa": dateofassignment,
      },
    }
    const params1 = {
      TableName: 'SEMSTable',
      Key: {
        id
      }
    }
    // Check Enrollment Exists in DB or not
    const data = await Dynamo.getData(params1);
    if (data.Item.id === id) {
      // Check the new Data matches the existing Data in DB or not
      if (data.Item.courseid === courseid && data.Item.studentid === studentid && data.Item.dateofassignment === dateofassignment) {
        return formatJSONResponse({
          message: "same enrollment entity already exits"
        })
      } else {
        const msg = await Dynamo.updateData(params);
        return formatJSONResponse({
          message: `enrollment ${msg}`
        });
      }
    }
  } catch (error) {
    return formatJSONResponse({
      message: "enrollment not found"
    });
  }
}

export const main = middyfy(updateEnrollment);

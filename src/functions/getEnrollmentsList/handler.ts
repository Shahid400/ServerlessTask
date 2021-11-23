import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { Dynamo } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';

import schema from './schema';

//This function Get the List of Enrollments from DB

const getEnrollmentsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  try {
    const params = {
      TableName: 'SEMSTable'
    }
    // Get All Data
    const data = await Dynamo.getList(params);
    const enrollments = [];
    for (const index in data.Items) {
      //Filter Enrollment Data
      if (data.Items[index].courseid !== undefined) {
        var courseid = data.Items[index].courseid;
        var studentid = data.Items[index].studentid;
        var date_of_enrollment = data.Items[index].dateofassignment;
        var params1 = {
          TableName: 'SEMSTable',
          Key: {
            id: studentid
          }
        }
        //Using studentid to get Student Data
        const student = await Dynamo.getData(params1);
        if (student.Item.id === studentid) {
          var studentname = student.Item.name;
        }
        var params2 = {
          TableName: 'SEMSTable',
          Key: {
            id: courseid
          }
        }
        //Using courseid to get Course Data
        var course = await Dynamo.getData(params2);
        if (course.Item.id === courseid) {
          var coursetitle = course.Item.coursetitle;
        }

        //Push required data in array
        enrollments.push(
          {
            coursetitle,
            studentname,
            date_of_enrollment
          }
        );
      }
    }

    return formatJSONResponse({
      message: "List of the enrollments", enrollments
    });
  } catch (error) {
    return formatJSONResponse({
      message: "Data not found in DB"
    });
  }
}

export const main = middyfy(getEnrollmentsList);

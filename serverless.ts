import type { AWS } from '@serverless/typescript';

//import methods of student
import { createStudent, getOneStudent, updateStudent, deleteStudent, getStudentsList } from 'src/functions/';

//import methods of course
import { createCourse, getOneCourse, updateCourse, deleteCourse, getCoursesList } from 'src/functions/';

//import methods of enrollment
import { createEnrollment, getOneEnrollment, updateEnrollment, deleteEnrollment, getEnrollmentsList } from 'src/functions/';

const serverlessConfiguration: AWS = {
  service: 'shahidserverlesstask',
  frameworkVersion: '2',
  plugins: [
    'serverless-esbuild',
    'serverless-dynamodb-local',
    'serverless-offline'
  ],
  custom: {
    //Local DB Configuration
    dynamodb: {
      stages: ["dev"],
      start: {
        port: 8000,
        migrate: true,
        seed: true
      },
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-2',
    iamRoleStatements:
      [
        {
          Effect: 'Allow',
          Action: ['dynamodb:*'],
          Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.DB_TABLE}'
        }
      ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      DB_TABLE: 'SEMSTable'
    },
    lambdaHashingVersion: '20201221',
  },
  resources: {
    Resources: {
      SEMSTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "SEMSTable",
          BillingMode: "PAY_PER_REQUEST",
          AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'S' }
          ],
          KeySchema: [
            { AttributeName: 'id', KeyType: 'HASH' }
          ],
        },
      }
    }
  },
  // import the function via paths
  functions: {
    createStudent, getOneStudent, updateStudent, deleteStudent, getStudentsList,
    createCourse, getOneCourse, updateCourse, deleteCourse, getCoursesList,
    createEnrollment, getOneEnrollment, updateEnrollment, deleteEnrollment, getEnrollmentsList
  }

};

module.exports = serverlessConfiguration;

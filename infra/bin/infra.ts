#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfraStack } from '../lib/infra-stack';
import { FrontStack } from '../lib/front-stack';
import { DataBaseStack } from '../lib/data-base-stack';

const app = new cdk.App();


const context = app.node.tryGetContext('environment');

new InfraStack(app, 'InfraStack', {
  env: {account: context.env}
});

new FrontStack(app, 'FrontStack', {
  env: {account: context.env}
});

new DataBaseStack(app, 'DataBaseStack', {
  env: {account: context.env}
});

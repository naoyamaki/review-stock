#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfraStack } from '../lib/infra-stack';

const app = new cdk.App();


const context = app.node.tryGetContext('environment');

new InfraStack(app, 'InfraStack', {
  env: {account: context.env}
});

#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkStack } from '../lib/cdk-stack';

const app = new cdk.App();
const context = app.node.tryGetContext('environment');

new CdkStack(app, 'CdkStack', {
  env: {account: context.env}
});

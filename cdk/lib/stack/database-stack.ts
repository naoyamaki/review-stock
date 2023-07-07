import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class DatabaseStack extends Stack {
  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props);

  }
}

export interface DatabaseStackProps extends StackProps {
  envValues: any;
}

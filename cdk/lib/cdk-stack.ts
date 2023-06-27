import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NetworkStack } from './stack/network-stack';
// import { DatabaseStack } from './stack/database-stack';
import { FrontStack } from './stack/front-stack';

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const envValues = scope.node.tryGetContext(scope.node.tryGetContext('environment'));

    const networkStack = new NetworkStack(scope, 'NetworkStack');

//    const databaseStack = new DatabaseStack(scope, 'DatabaseStack');

    const frontStack = new FrontStack(scope, 'FrontStack', {
      pubSubC: networkStack.pubSubC,
      pubSubD: networkStack.pubSubD
    });

  }
}

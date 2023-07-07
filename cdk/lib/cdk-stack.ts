import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NetworkStack } from './stack/network-stack';
import { FrontStack } from './stack/front-stack';

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const envValues = scope.node.tryGetContext(scope.node.tryGetContext('environment'));

    const networkStack = new NetworkStack(scope, 'NetworkStack', {
      envValues: envValues,
    });

//    const frontStack = new FrontStack(scope, 'FrontStack', {
//      mainVpc: networkStack.mainVpc,
//      pubSubC: networkStack.pubSubC,
//      pubSubD: networkStack.pubSubD,
//      envValues: envValues,
//    });

  }
}

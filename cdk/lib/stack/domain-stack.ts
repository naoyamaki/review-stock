import { Stack, StackProps, aws_route53 } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class DomainStack extends Stack {
  constructor(scope: Construct, id: string, props: DomainStackProps) {
    super(scope, id, props);
    const zone = new aws_route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: props.envValues.domainName,
    });

//    手間なので一旦ACM利用は手動で作成したものをARN直書き
//    const apNorthEastAcmStack = new ApNorthEastAcmStack(scope, 'ApNorthEastAcmStack', {
//      envValues: Object,
//    });
//    const usEastAcmStack = new UsEastAcmStack(scope, 'UsEastAcmStack', {
//      envValues: Object,
//    });

  }
}

export interface DomainStackProps extends StackProps {
  envValues: any;
}

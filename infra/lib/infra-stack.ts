import { aws_ec2, aws_s3, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const context = this.node.tryGetContext('environment')

    const vpc = new aws_ec2.Vpc(this, 'VPC', {
      availabilityZones: ['ap-northeast-1c', 'ap-northeast-1d'],
      ipAddresses: context.vpcCidr,
      vpcName: context.serviceName,
      natGateways: 2,
      // サブネットは後続にてoverrideで実装
      subnetConfiguration: [{
        cidrMask: 25,
        name: 'public-1c',
        subnetType: aws_ec2.SubnetType.PUBLIC,
      },{
        cidrMask: 25,
        name: 'public-1d',
        subnetType: aws_ec2.SubnetType.PUBLIC,
      },{
        cidrMask: 25,
        name: 'private-app-1c',
        subnetType: aws_ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },{
        cidrMask: 25,
        name: 'private-app-1d',
        subnetType: aws_ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },{
        cidrMask: 25,
        name: 'private-db-1c',
        subnetType: aws_ec2.SubnetType.PRIVATE_ISOLATED,
      },{
        cidrMask: 25,
        name: 'private-db-1d',
        subnetType: aws_ec2.SubnetType.PRIVATE_ISOLATED,
      }]
    });

    // サブネットの設定を実装
    const public1c = vpc.publicSubnets[0].node.defaultChild as aws_ec2.CfnSubnet
    public1c.addPropertyOverride('CidrBlock', context.pubricCCider)
    public1c.addPropertyOverride('availabilityZone', 'ap-northeast-1c')
    const public1d = vpc.publicSubnets[1].node.defaultChild as aws_ec2.CfnSubnet
    public1d.addPropertyOverride('CidrBlock', context.publicDCider)
    public1d.addPropertyOverride('availabilityZone', 'ap-northeast-1d')
    const privateApp1c = vpc.privateSubnets[0].node.defaultChild as aws_ec2.CfnSubnet
    privateApp1c.addPropertyOverride('CidrBlock', context.privateAppCCider)
    privateApp1c.addPropertyOverride('availabilityZone', 'ap-northeast-1c')
    const privateApp1d = vpc.privateSubnets[1].node.defaultChild as aws_ec2.CfnSubnet
    privateApp1d.addPropertyOverride('CidrBlock', context.privateAppDCider)
    privateApp1d.addPropertyOverride('availabilityZone', 'ap-northeast-1d')
    const privateDb1c = vpc.privateSubnets[2].node.defaultChild as aws_ec2.CfnSubnet
    privateDb1c.addPropertyOverride('CidrBlock', context.privateDbCCider)
    privateDb1c.addPropertyOverride('availabilityZone', 'ap-northeast-1c')
    const privateDb1d = vpc.privateSubnets[3].node.defaultChild as aws_ec2.CfnSubnet
    privateDb1d.addPropertyOverride('CidrBlock', context.privateDbDCider)
    privateDb1d.addPropertyOverride('availabilityZone', 'ap-northeast-1d')

    // create VPC flow log
    const flowLogBucket = new aws_s3.Bucket(this, 'Bucket', {
      bucketName: context.serviceName+"-vpc-flow-log"
    });
    const flowLog = new aws_ec2.FlowLog(this, 'FlowLog', {
      resourceType: aws_ec2.FlowLogResourceType.fromVpc(vpc),
      destination: aws_ec2.FlowLogDestination.toS3(flowLogBucket)
    });

  }
}

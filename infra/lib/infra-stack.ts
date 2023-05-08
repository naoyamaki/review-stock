import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const context = this.node.tryGetContext('environment')

    const vpc = new ec2.Vpc(this, 'VPC', {
      availabilityZones: ['ap-northeast-1c', 'ap-northeast-1d'],
      ipAddresses: context.vpcCidr,
      vpcName: context.serviceName,
      natGateways: 2,
      // サブネットは後続にてoverrideで実装
      subnetConfiguration: [{
        cidrMask: 25,
        name: 'public-1c',
        subnetType: ec2.SubnetType.PUBLIC,
      },{
        cidrMask: 25,
        name: 'public-1d',
        subnetType: ec2.SubnetType.PUBLIC,
      },{
        cidrMask: 25,
        name: 'private-app-1c',
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },{
        cidrMask: 25,
        name: 'private-app-1d',
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },{
        cidrMask: 25,
        name: 'private-db-1c',
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },{
        cidrMask: 25,
        name: 'private-db-1d',
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      }]
    });

    // サブネットの設定を実装
    const public1c = vpc.publicSubnets[0].node.defaultChild as ec2.CfnSubnet
    public1c.addPropertyOverride('CidrBlock', context.pubricCCider)
    public1c.addPropertyOverride('availabilityZone', 'ap-northeast-1c')
    const public1d = vpc.publicSubnets[1].node.defaultChild as ec2.CfnSubnet
    public1d.addPropertyOverride('CidrBlock', context.publicDCider)
    public1d.addPropertyOverride('availabilityZone', 'ap-northeast-1d')
    const privateApp1c = vpc.privateSubnets[0].node.defaultChild as ec2.CfnSubnet
    privateApp1c.addPropertyOverride('CidrBlock', context.privateAppCCider)
    privateApp1c.addPropertyOverride('availabilityZone', 'ap-northeast-1c')
    const privateApp1d = vpc.privateSubnets[1].node.defaultChild as ec2.CfnSubnet
    privateApp1d.addPropertyOverride('CidrBlock', context.privateAppDCider)
    privateApp1d.addPropertyOverride('availabilityZone', 'ap-northeast-1d')
    const privateDb1c = vpc.privateSubnets[2].node.defaultChild as ec2.CfnSubnet
    privateDb1c.addPropertyOverride('CidrBlock', context.privateDbCCider)
    privateDb1c.addPropertyOverride('availabilityZone', 'ap-northeast-1c')
    const privateDb1d = vpc.privateSubnets[3].node.defaultChild as ec2.CfnSubnet
    privateDb1d.addPropertyOverride('CidrBlock', context.privateDbDCider)
    privateDb1d.addPropertyOverride('availabilityZone', 'ap-northeast-1d')

    // create VPC flow log
    const flowLogBucket = new s3.Bucket(this, 'Bucket', {
      bucketName: context.serviceName+"-vpc-flow-log"
    });
    const flowLog = new ec2.FlowLog(this, 'FlowLog', {
      resourceType: ec2.FlowLogResourceType.fromVpc(vpc),
      destination: ec2.FlowLogDestination.toS3(flowLogBucket)
    });

  }
}

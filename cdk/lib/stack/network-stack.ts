import { aws_ec2, aws_s3, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class NetworkStack extends Stack {
  public readonly mainVpc: aws_ec2.Vpc;
  public readonly publicSubnetC: aws_ec2.CfnSubnet;
  public readonly publicSubnetD: aws_ec2.CfnSubnet;
  public readonly privateSubnetAppC: aws_ec2.CfnSubnet;
  public readonly privateSubnetAppD: aws_ec2.CfnSubnet;
  public readonly privateSubnetDbC: aws_ec2.CfnSubnet;
  public readonly privateSubnetDbD: aws_ec2.CfnSubnet;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const context = this.node.tryGetContext('environment')

    const mainVpc = new aws_ec2.Vpc(this, 'VPC', {
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
    const publicSubnetC = mainVpc.publicSubnets[0].node.defaultChild as aws_ec2.CfnSubnet
    publicSubnetC.addPropertyOverride('CidrBlock', context.pubricCCider)
    publicSubnetC.addPropertyOverride('availabilityZone', 'ap-northeast-1c')
    const publicSubnetD = mainVpc.publicSubnets[1].node.defaultChild as aws_ec2.CfnSubnet
    publicSubnetD.addPropertyOverride('CidrBlock', context.publicDCider)
    publicSubnetD.addPropertyOverride('availabilityZone', 'ap-northeast-1d')
    const privateSubnetAppC = mainVpc.privateSubnets[0].node.defaultChild as aws_ec2.CfnSubnet
    privateSubnetAppC.addPropertyOverride('CidrBlock', context.privateAppCCider)
    privateSubnetAppC.addPropertyOverride('availabilityZone', 'ap-northeast-1c')
    const privateSubnetAppD = mainVpc.privateSubnets[1].node.defaultChild as aws_ec2.CfnSubnet
    privateSubnetAppD.addPropertyOverride('CidrBlock', context.privateAppDCider)
    privateSubnetAppD.addPropertyOverride('availabilityZone', 'ap-northeast-1d')
    const privateSubnetDbC = mainVpc.privateSubnets[2].node.defaultChild as aws_ec2.CfnSubnet
    privateSubnetDbC.addPropertyOverride('CidrBlock', context.privateDbCCider)
    privateSubnetDbC.addPropertyOverride('availabilityZone', 'ap-northeast-1c')
    const privateSubnetDbD = mainVpc.privateSubnets[3].node.defaultChild as aws_ec2.CfnSubnet
    privateSubnetDbD.addPropertyOverride('CidrBlock', context.privateDbDCider)
    privateSubnetDbD.addPropertyOverride('availabilityZone', 'ap-northeast-1d')

    // create VPC flow log
    const flowLogBucket = new aws_s3.Bucket(this, 'Bucket', {
      bucketName: context.serviceName+"-vpc-flow-log"
    });
    const flowLog = new aws_ec2.FlowLog(this, 'FlowLog', {
      resourceType: aws_ec2.FlowLogResourceType.fromVpc(mainVpc),
      destination: aws_ec2.FlowLogDestination.toS3(flowLogBucket)
    });

    this.mainVpc = mainVpc
    this.publicSubnetC = publicSubnetC
    this.publicSubnetD = publicSubnetD
    this.privateSubnetAppC = privateSubnetAppC
    this.privateSubnetAppD = privateSubnetAppD
    this.privateSubnetDbC = privateSubnetDbC
    this.privateSubnetDbD = privateSubnetDbD
  }
}

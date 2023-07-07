import { aws_ec2, aws_s3, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class NetworkStack extends Stack {
  public readonly mainVpc: aws_ec2.Vpc;
  public readonly pubSubC: aws_ec2.Subnet;
  public readonly pubSubD: aws_ec2.Subnet;
  public readonly priSubCApp: aws_ec2.Subnet;
  public readonly priSubDApp: aws_ec2.Subnet;
  public readonly priSubCDb: aws_ec2.Subnet;
  public readonly priSubDDb: aws_ec2.Subnet;

  constructor(scope: Construct, id: string, props: NetworkStackProps) {
    super(scope, id, props);

    const mainVpc = new aws_ec2.Vpc(this, 'mainVpc', {
      availabilityZones: ['ap-northeast-1c', 'ap-northeast-1d'],
      ipAddresses: aws_ec2.IpAddresses.cidr(props.envValues.vpcCidr),
      vpcName: props.envValues.serviceName,
      subnetConfiguration: [],
    });
//    const flowLogBucket = new aws_s3.Bucket(this, 'Bucket', {
//      bucketName: props.envValues.serviceName+"-vpc-flow-log"
//    });
//    const flowLog = new aws_ec2.FlowLog(this, 'FlowLog', {
//      resourceType: aws_ec2.FlowLogResourceType.fromVpc(mainVpc),
//      destination: aws_ec2.FlowLogDestination.toS3(flowLogBucket)
//    });

    // Internet GateWay
    const mainVpcIgw = new aws_ec2.CfnInternetGateway(this, 'mainVpcIgw', {});
    const VPCGatewayAttachment = new aws_ec2.CfnVPCGatewayAttachment(this, 'cfnVPCGatewayAttachment', {
      vpcId: mainVpc.vpcId,
      internetGatewayId: mainVpcIgw.attrInternetGatewayId
    });

    // Subnet
    const pubSubC = new aws_ec2.Subnet(this, 'pubSubC', {
      availabilityZone: 'ap-northeast-1c',
      cidrBlock: props.envValues.pubSubCCider,
      vpcId: mainVpc.vpcId,
    });
    const pubSubD = new aws_ec2.Subnet(this, 'pubSubD', {
      availabilityZone: 'ap-northeast-1d',
      cidrBlock: props.envValues.pubSubDCider,
      vpcId: mainVpc.vpcId,
    });

    const priSubCApp = new aws_ec2.Subnet(this, 'priSubCApp', {
      availabilityZone: 'ap-northeast-1c',
      cidrBlock: props.envValues.priSubCAppCider,
      vpcId: mainVpc.vpcId,
    });
    const priSubDApp = new aws_ec2.Subnet(this, 'priSubDApp', {
      availabilityZone: 'ap-northeast-1d',
      cidrBlock: props.envValues.priSubDAppCider,
      vpcId: mainVpc.vpcId,
    });

    const priSubCDb = new aws_ec2.Subnet(this, 'priSubCDb', {
      availabilityZone: 'ap-northeast-1c',
      cidrBlock: props.envValues.priSubCDbCider,
      vpcId: mainVpc.vpcId,
    });
    const priSubDDb = new aws_ec2.Subnet(this, 'priSubDDb', {
      availabilityZone: 'ap-northeast-1d',
      cidrBlock: props.envValues.priSubDDbCider,
      vpcId: mainVpc.vpcId,
    });

    // NAT Gateway
//    const cNatgatewayIp = new aws_ec2.CfnEIP(this, 'cNatgatewayIp', {});
//    const cNatgateway = new aws_ec2.CfnNatGateway(this, 'cNatgateway', {
//      subnetId: pubSubC.subnetId,
//      allocationId: cNatgatewayIp.attrAllocationId,
//    });
//    const dNatgatewayIp = new aws_ec2.CfnEIP(this, 'dNatgatewayIp', {});
//    const dNatgateway = new aws_ec2.CfnNatGateway(this, 'dNatgateway', {
//      subnetId: pubSubD.subnetId,
//      allocationId: dNatgatewayIp.attrAllocationId,
//    });

    // Route table
    pubSubC.addRoute("pubSubCToIgw", {
      routerId: mainVpcIgw.attrInternetGatewayId,
      routerType:aws_ec2.RouterType.GATEWAY,
      destinationCidrBlock: "0.0.0.0/0"
    });
    pubSubD.addRoute("pubSubDToIgw", {
      routerId: mainVpcIgw.attrInternetGatewayId,
      routerType:aws_ec2.RouterType.GATEWAY,
      destinationCidrBlock: "0.0.0.0/0"
    });

//    priSubCApp.addDefaultNatRoute(cNatgateway.logicalId);
//    priSubDApp.addDefaultNatRoute(dNatgateway.logicalId);
//    priSubCDb.addDefaultNatRoute(cNatgateway.logicalId);
//    priSubDDb.addDefaultNatRoute(dNatgateway.logicalId);

    this.mainVpc    = mainVpc;
    this.pubSubC    = pubSubC;
    this.pubSubD    = pubSubD;
    this.priSubCApp = priSubCApp;
    this.priSubDApp = priSubDApp;
    this.priSubCDb  = priSubCDb;
    this.priSubDDb  = priSubDDb;
  }
}

export interface NetworkStackProps extends StackProps {
  envValues: any;
}

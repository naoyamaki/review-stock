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

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const envValues = scope.node.tryGetContext(scope.node.tryGetContext('environment'));

    const mainVpc = new aws_ec2.Vpc(this, 'mainVpc', {
      availabilityZones: ['ap-northeast-1c', 'ap-northeast-1d'],
      ipAddresses: aws_ec2.IpAddresses.cidr(envValues.vpcCidr),
      vpcName: envValues.serviceName,
      subnetConfiguration: [],
    });
    const flowLogBucket = new aws_s3.Bucket(this, 'Bucket', {
      bucketName: envValues.serviceName+"-vpc-flow-log"
    });
    const flowLog = new aws_ec2.FlowLog(this, 'FlowLog', {
      resourceType: aws_ec2.FlowLogResourceType.fromVpc(mainVpc),
      destination: aws_ec2.FlowLogDestination.toS3(flowLogBucket)
    });
    const mainVpcIgw = new aws_ec2.CfnInternetGateway(this, 'mainVpcIgw', {});
    const VPCGatewayAttachment = new aws_ec2.CfnVPCGatewayAttachment(this, 'cfnVPCGatewayAttachment', {
      vpcId: mainVpc.vpcId,
      internetGatewayId: mainVpcIgw.attrInternetGatewayId
  });

    // Subnet
    const pubSubC = new aws_ec2.Subnet(this, 'pubSubC', {
      availabilityZone: 'ap-northeast-1c',
      cidrBlock: envValues.pubSubCCider,
      vpcId: mainVpc.vpcId,
    });
    const pubSubD = new aws_ec2.Subnet(this, 'pubSubD', {
      availabilityZone: 'ap-northeast-1d',
      cidrBlock: envValues.pubSubDCider,
      vpcId: mainVpc.vpcId,
    });
    const priSubCApp = new aws_ec2.Subnet(this, 'priSubCApp', {
      availabilityZone: 'ap-northeast-1c',
      cidrBlock: envValues.priSubCAppCider,
      vpcId: mainVpc.vpcId,
    });
    const priSubDApp = new aws_ec2.Subnet(this, 'priSubDApp', {
      availabilityZone: 'ap-northeast-1d',
      cidrBlock: envValues.priSubDAppCider,
      vpcId: mainVpc.vpcId,
    });
    const priSubCDb = new aws_ec2.Subnet(this, 'priSubCDb', {
      availabilityZone: 'ap-northeast-1c',
      cidrBlock: envValues.priSubCDbCider,
      vpcId: mainVpc.vpcId,
    });
    const priSubDDb = new aws_ec2.Subnet(this, 'priSubDDb', {
      availabilityZone: 'ap-northeast-1d',
      cidrBlock: envValues.priSubDDbCider,
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

    // routetable
    const pubSubRouteTable = new aws_ec2.CfnRouteTable(this, 'pubSubRouteTable', {vpcId: mainVpc.vpcId});
//    const pubSubRoute = new aws_ec2.CfnRoute(this, 'pubSubRoute', {
//      routeTableId: pubSubRouteTable.attrRouteTableId,
//      destinationCidrBlock: '0.0.0.0/0',
//      gatewayId: mainVpcIgw.logicalId,
//    });
//    pubSubRoute.addDependency(mainVpcIgw);
    new aws_ec2.CfnSubnetRouteTableAssociation(this, 'pubSubCRouteTableAssociation', {
      routeTableId: pubSubRouteTable.attrRouteTableId,
      subnetId: pubSubC.subnetId,
    });
    new aws_ec2.CfnSubnetRouteTableAssociation(this, 'pubSubDRouteTableAssociation', {
      routeTableId: pubSubRouteTable.attrRouteTableId,
      subnetId: pubSubD.subnetId,
    });

    const priSubAppCRouteTable = new aws_ec2.CfnRouteTable(this, 'priSubAppCRouteTable', {vpcId: mainVpc.vpcId});
//    const priSubAppCRoute = new aws_ec2.CfnRoute(this, 'priSubAppCRoute', {
//      routeTableId: priSubAppCRouteTable.attrRouteTableId,
//      destinationCidrBlock: '0.0.0.0/0',
//      natGatewayId: cNatgateway.logicalId
//    });
//    priSubAppCRoute.addDependency(cNatgateway);
    new aws_ec2.CfnSubnetRouteTableAssociation(this, 'priSubAppCRouteTableAssociation', {
      routeTableId: priSubAppCRouteTable.attrRouteTableId,
      subnetId: priSubCApp.subnetId,
    });

    const priSubAppDRouteTable = new aws_ec2.CfnRouteTable(this, 'priSubAppDRouteTable', {vpcId: mainVpc.vpcId});
//    const priSubAppDRoute = new aws_ec2.CfnRoute(this, 'priSubAppDRoute', {
//      routeTableId: priSubAppDRouteTable.attrRouteTableId,
//      destinationCidrBlock: '0.0.0.0/0',
//      natGatewayId: dNatgateway.logicalId
//    });
//    priSubAppDRoute.addDependency(dNatgateway);
    new aws_ec2.CfnSubnetRouteTableAssociation(this, 'priSubAppDRouteTableAssociation', {
      routeTableId: priSubAppDRouteTable.attrRouteTableId,
      subnetId: priSubDApp.subnetId,
    });

    this.mainVpc    = mainVpc
    this.pubSubC    = pubSubC
    this.pubSubD    = pubSubD
    this.priSubCApp = priSubCApp
    this.priSubDApp = priSubDApp
    this.priSubCDb  = priSubCDb
    this.priSubDDb  = priSubDDb
  }
}

import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam'
import * as path from 'path';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import { Construct } from 'constructs';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // The code that defines your stack goes here
    // CHANGE: We have created the vpc object from the Vpc class.
    const vpc = new ec2.Vpc(this, 'VPC', {
      cidr: "172.16.0.0/24",
//      flowLogs: {},
      maxAzs: 2,
//      vpcName: "",
      natGateways: 2,
      subnetConfiguration: [{
        cidrMask: 24,
        name: "asterisk",
        subnetType: ec2.SubnetType.PUBLIC
      }]
    });

        // Allow SSH (TCP Port 22) access from anywhere
        const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
          vpc,
          description: 'Allow SSH (TCP port 22) in',
          allowAllOutbound: true
        });
        securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH Access')
    
        const role = new iam.Role(this, 'ec2Role', {
          assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
        })
    
        role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'))
    
        // Use Latest Amazon Linux Image - CPU Type ARM64
        const ami = new ec2.AmazonLinuxImage({
          generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
          cpuType: ec2.AmazonLinuxCpuType.ARM_64
        });
    
        // Create the instance using the Security Group, AMI, and KeyPair defined in the VPC created
        const ec2Instance = new ec2.Instance(this, 'Instance', {
          vpc,
          instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.MICRO),
          machineImage: ami,
          securityGroup: securityGroup,
          // keyName: key.keyPairName,
          role: role
        });
    
        // Create an asset that will be used as part of User Data to run on first load
        const asset = new Asset(this, 'Asset', { path: path.join(__dirname, '../src/config.sh') });
        const localPath = ec2Instance.userData.addS3DownloadCommand({
          bucket: asset.bucket,
          bucketKey: asset.s3ObjectKey,
        });
    
        ec2Instance.userData.addExecuteFileCommand({
          filePath: localPath,
          arguments: '--verbose -y'
        });
        asset.grantRead(ec2Instance.role);
    
        // Create outputs for connecting
        new cdk.CfnOutput(this, 'IP Address', { value: ec2Instance.instancePublicIp });
        // new cdk.CfnOutput(this, 'Key Name', { value: key.keyPairName })
        new cdk.CfnOutput(this, 'Download Key Command', { value: 'aws secretsmanager get-secret-value --secret-id ec2-ssh-key/cdk-keypair/private --query SecretString --output text > cdk-key.pem && chmod 400 cdk-key.pem' })
        new cdk.CfnOutput(this, 'ssh command', { value: 'ssh -i cdk-key.pem -o IdentitiesOnly=yes ec2-user@' + ec2Instance.instancePublicIp })

  }
}

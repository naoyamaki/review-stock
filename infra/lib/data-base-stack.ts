import { Stack, StackProps, Duration, aws_rds, aws_ec2, aws_kms } from 'aws-cdk-lib';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export class DataBaseStack extends Stack {
  constructor(scope: Construct, id: string, props?:StackProps) {
    super(scope, id, props);
    const context = this.node.tryGetContext('environment')
    const myKey = new aws_kms.Key(this, 'MyKey');
    declare const vpc: aws_ec2.Vpc;

    const auroraCluster = new aws_rds.ServerlessCluster(this, 'AnotherCluster', {
      clusterIdentifier: context.serviceName,
      defaultDatabaseName: context.serviceName,
      engine: aws_rds.DatabaseClusterEngine.AURORA_MYSQL,
      parameterGroup: aws_rds.ParameterGroup.fromParameterGroupName(this, 'ParameterGroup', 'default.aurora-mysql8.0'),
      vpc,
      subnetGroup: "",
      securityGroups: [dbsg],
      scaling: {
        autoPause: Duration.minutes(10),
        minCapacity: aws_rds.AuroraCapacityUnit.ACU_1,
        maxCapacity: aws_rds.AuroraCapacityUnit.ACU_2,
      },
      credentials: aws_rds.Credentials.fromGeneratedSecret('postgres', {
        secretName: 'my-cool-name',
        encryptionKey: myKey,
        excludeCharacters: '!&*^#@()',
        replicaRegions: [{ region: 'eu-west-1' }, { region: 'eu-west-2' }],
      }),
      copyTagsToSnapshot: true,
      backupRetention: Duration.days(7),
      storageEncrypted: true,
      storageEncryptionKey: kmsKey,
      deletionProtection: true,

    });

}

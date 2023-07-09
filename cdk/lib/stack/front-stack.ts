import { aws_cloudfront, aws_cloudfront_origins, aws_s3, aws_iam, aws_ec2, Stack, StackProps, aws_elasticloadbalancingv2, Duration, aws_certificatemanager } from 'aws-cdk-lib';
import { IpAddressType } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';

export class FrontStack extends Stack {
  public readonly stackProps: FrontStackProps;
  constructor(scope: Construct, id: string, props: FrontStackProps) {
    super(scope, id, props);

    const CFN_PL_ID = 'pl-31a34658';
    const CFN_ACM_ARN = '';
    const ALB_ACM_ARN = '';

//    const logBucket = new aws_s3.Bucket(this, 'logBucket', {
//      bucketName: props.envValues.serviceName+"-log",
//      blockPublicAccess: aws_s3.BlockPublicAccess.BLOCK_ALL,
//    });

    const albSg = new aws_ec2.SecurityGroup(this, 'albSg', {
      vpc: props.mainVpc,
      securityGroupName: props.envValues.serviceName+"-alb",
    });
    albSg.addIngressRule(
      aws_ec2.Peer.prefixList(CFN_PL_ID),
      aws_ec2.Port.tcp(443)
    );
    const alb = new aws_elasticloadbalancingv2.ApplicationLoadBalancer(this, 'alb', {
      vpc: props.mainVpc,
      internetFacing: true,
      idleTimeout: Duration.seconds(60),
      ipAddressType: IpAddressType.DUAL_STACK,
      loadBalancerName: props.envValues.serviceName,
      securityGroup: albSg,
      vpcSubnets: { subnets: props.mainVpc.publicSubnets },
    });
    const targetGroup = new aws_elasticloadbalancingv2.ApplicationTargetGroup(this, 'targetGroup', {
      vpc: props.mainVpc,
      targetGroupName: props.envValues.serviceName,
      deregistrationDelay: Duration.seconds(60),
      healthCheck: {
        healthyHttpCodes: "200",
        protocol: aws_elasticloadbalancingv2.Protocol.HTTP,
        healthyThresholdCount: 2,
        interval: Duration.seconds(30),
        path: "/healthCheck/",
        timeout: Duration.seconds(2),
        unhealthyThresholdCount: 2
      },
      port: 80,
      protocol: aws_elasticloadbalancingv2.ApplicationProtocol.HTTP,
      protocolVersion: aws_elasticloadbalancingv2.ApplicationProtocolVersion.HTTP1,
      targetType: aws_elasticloadbalancingv2.TargetType.IP
    })
    const listener = alb.addListener('listener', {
      certificates: [{certificateArn: ALB_ACM_ARN}],
      defaultTargetGroups: [targetGroup],
      protocol: aws_elasticloadbalancingv2.ApplicationProtocol.HTTPS,
      port: 443,
      sslPolicy: aws_elasticloadbalancingv2.SslPolicy.RECOMMENDED_TLS,
    });
//    alb.logAccessLogs(logBucket, 'alb/');

    const staticResourceBucket = new aws_s3.Bucket(this, 'staticResourceBucket', {
      bucketName: props.envValues.serviceName+"-static-resource",
      blockPublicAccess: aws_s3.BlockPublicAccess.BLOCK_ALL,
    });

    const cfnOriginAccessControl = new aws_cloudfront.CfnOriginAccessControl(this, 'cfnOriginAccessControl', {
      originAccessControlConfig: {
        name: 'OriginAccessControlForstaticResourceBucket',
        originAccessControlOriginType: 's3',
        signingBehavior: 'always',
        signingProtocol: 'sigv4',
        description: 'Access Control',
      },
    });

    const distribution = new aws_cloudfront.Distribution(this, 'distribution', {
      certificate: aws_certificatemanager.Certificate.fromCertificateArn(this, 'cfnCertificate', CFN_ACM_ARN),
      domainNames: [props.envValues.domainName],
      comment: props.envValues.serviceName,
      defaultRootObject: 'index.html',
//      enableLogging: true,
//      logBucket: logBucket,
//      logFilePrefix: "cloudfront/",
      httpVersion: aws_cloudfront.HttpVersion.HTTP2_AND_3,
      defaultBehavior: {
        allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: aws_cloudfront.CachedMethods.CACHE_GET_HEAD,
        cachePolicy: aws_cloudfront.CachePolicy.CACHING_OPTIMIZED,
        viewerProtocolPolicy: aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        origin: new aws_cloudfront_origins.S3Origin(staticResourceBucket),
      },
      additionalBehaviors: {
        '/api/': {
          allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_ALL,
          cachePolicy: aws_cloudfront.CachePolicy.CACHING_DISABLED,
          viewerProtocolPolicy: aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          origin: new aws_cloudfront_origins.LoadBalancerV2Origin(alb)
        },
      },
    });

    // OAIをOACへ変更
    const cfnDistribution = distribution.node.defaultChild as aws_cloudfront.CfnDistribution;
    cfnDistribution.addPropertyOverride('DistributionConfig.Origins.0.S3OriginConfig.OriginAccessIdentity', '');
    cfnDistribution.addPropertyOverride('DistributionConfig.Origins.0.OriginAccessControlId', cfnOriginAccessControl.attrId);

    const staticResourceBucketPolicyStatement = new aws_iam.PolicyStatement({
      actions: ['s3:GetObject'],
      effect: aws_iam.Effect.ALLOW,
      principals: [new aws_iam.ServicePrincipal('cloudfront.amazonaws.com'),],
      resources: [`${staticResourceBucket.bucketArn}/*`],
    });
    staticResourceBucketPolicyStatement.addCondition('StringEquals', {
      'AWS:SourceArn': `arn:aws:cloudfront::${props.envValues.accountId}:distribution/${distribution.distributionId}`
    })
    staticResourceBucket.addToResourcePolicy(staticResourceBucketPolicyStatement);
  }
}

export interface FrontStackProps extends StackProps {
  mainVpc: aws_ec2.Vpc;
  pubSubC: aws_ec2.Subnet;
  pubSubD: aws_ec2.Subnet;
  envValues: any;
}

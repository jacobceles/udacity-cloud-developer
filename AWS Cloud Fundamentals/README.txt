# AWS Cloud Fundamentals

In this project, I successfully deployed a static website using S3 and CloudFront. The website can be viewed using the following links:

CloudFront domain name: http://di6g18bry97j2.cloudfront.net/
Website endpoint: http://udacity-cloud-developer-project.s3-website-us-east-1.amazonaws.com/
S3 object URL: https://udacity-cloud-developer-project.s3.amazonaws.com/index.html

Screenshots of deployment steps:
1. Create S3 Bucket and upload the website files to it:
![s3 bucket](screenshots/s3 bucket.png)
2. Configure the bucket for website hosting and secure it:
a. Bucket Policy:
![bucket policy](screenshots/bucket policy.png)
b. Static Hosting Setting:
![static hosting setting](screenshots/static hosting setting.png)
3. Speed up content delivery using AWS’s content distribution network service, CloudFront:
![CloudFront Distribution](screenshots/CloudFront Distribution.png)
4. Screenshots of deployed website:
a. Using CloudFront domain name:
![CloudFront domain name](screenshots/CloudFront domain name.png)
b. Using Website endpoint:
![Website endpoint](screenshots/Website endpoint.png)
c. Using S3 object URL:
![S3 object URL](screenshots/S3 object URL.png)
# AWS Cloud Fundamentals

This project demonstrates the deployment of a static website using AWS S3 and CloudFront.

## Website Links

- **CloudFront domain name:** [http://di6g18bry97j2.cloudfront.net/](http://di6g18bry97j2.cloudfront.net/)
- **Website endpoint:** [http://udacity-cloud-developer-project.s3-website-us-east-1.amazonaws.com/](http://udacity-cloud-developer-project.s3-website-us-east-1.amazonaws.com/)
- **S3 object URL:** [https://udacity-cloud-developer-project.s3.amazonaws.com/index.html](https://udacity-cloud-developer-project.s3.amazonaws.com/index.html)

## Deployment Steps

### 1. Create S3 Bucket and Upload Website Files
Upload the website files to the S3 bucket.

![S3 Bucket](screenshots/s3%20bucket.png)

### 2. Configure the Bucket for Website Hosting and Security

- **Bucket Policy:**

  ![Bucket Policy](screenshots/bucket%20policy.png)

- **Static Hosting Setting:**

  ![Static Hosting Setting](screenshots/static%20hosting%20setting.png)

### 3. Speed Up Content Delivery Using CloudFront
Configure CloudFront to distribute your content efficiently.

![CloudFront Distribution](screenshots/CloudFront%20Distribution.png)

### 4. Screenshots of Deployed Website

- **Using CloudFront domain name:**

  ![CloudFront Domain Name](screenshots/CloudFront%20domain%20name.png)

- **Using Website endpoint:**

  ![Website Endpoint](screenshots/Website%20endpoint.png)

- **Using S3 object URL:**

  ![S3 Object URL](screenshots/S3%20object%20URL.png)

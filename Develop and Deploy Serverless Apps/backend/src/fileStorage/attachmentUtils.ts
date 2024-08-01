import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)


const logger = createLogger('s3UrlSigning')

const s3 = new XAWS.S3({
    signatureVersion: 'v4'
  })


  const bucketName = process.env.ATTACHMENT_S3_BUCKET
  const expiration = process.env.SIGNED_URL_EXPIRATION

export async function getUploadUrl(itemId: string) {
    const result = await s3.getSignedUrlPromise('putObject', {
        Bucket: bucketName,
        Key: itemId,
        Expires: Number(expiration)
    })
    logger.info(`Generated signed URL ${result}`)
    return result
}
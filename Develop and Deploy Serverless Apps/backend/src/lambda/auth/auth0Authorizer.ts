import { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'
import axios from 'axios'

const logger = createLogger('auth')

const certToPem = (cert) => {
    cert = cert.match(/.{1,64}/g).join('\n');
    cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
    return cert;
}

const jwksUrl = 'https://dev-h3p8b7a6ypxyqtfw.us.auth0.com/.well-known/jwks.json';

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function getJwk(header):Promise<any>{
  const data = await axios.get(jwksUrl).then( res => res.data)
  // Signing keys
  const jwks = data.keys 

  const keys = jwks.filter(
    key => key.use === 'sig'
    && key.kty === 'RSA'
    && key.kid
    && ((key.x5c && key.x5c.length) || (key.n && key.e))
  ).map( key => {
    return {kid: key.kid, nbf: key.nbf, publicKey: certToPem(key.x5c[0])}
  })
  
  const kid = header.kid
  const signingKey = keys.find(key => key.kid === kid);
  return signingKey
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt
  const signingKey = await getJwk(jwt.header)
  return verify(token, signingKey.publicKey, { algorithms: ['RS256']}) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
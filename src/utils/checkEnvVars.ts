export function checkEnvVars() {
  const requiredEnvVars = [
    'VITE_WEB3_AUTH_CLIENT_ID',
    'VITE_REPUTABLE_API_BASE_URL',
    'VITE_REPUTABLE_HUB_ADDRESS',
    'VITE_REPUTABLE_SIGN_PROTOCOL_ADDRESS',
    'VITE_SIGN_PROTOCOL_SCHEMA_ID',
  ]

  for (const envVar of requiredEnvVars) {
    if (!import.meta.env[envVar]) {
      throw new Error(`You need to provide ${envVar} env variable`)
    }
  }

  // Additional checks for specific format requirements
  if (!/^0x[a-fA-F0-9]{40}$/.test(import.meta.env.VITE_REPUTABLE_HUB_ADDRESS)) {
    throw new Error('VITE_REPUTABLE_HUB_ADDRESS must be a valid Ethereum address')
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(import.meta.env.VITE_REPUTABLE_SIGN_PROTOCOL_ADDRESS)) {
    throw new Error('VITE_REPUTABLE_SIGN_PROTOCOL_ADDRESS must be a valid Ethereum address')
  }

  if (isNaN(Number(import.meta.env.VITE_SIGN_PROTOCOL_SCHEMA_ID))) {
    throw new Error('VITE_SIGN_PROTOCOL_SCHEMA_ID must be a valid number')
  }

  console.log('All required environment variables are present and valid.')
}

import ky from 'ky'

const REPUTABLE_API_BASE_URL = import.meta.env.VITE_REPUTABLE_API_BASE_URL

export const reputableApi = ky.create({ prefixUrl: REPUTABLE_API_BASE_URL })

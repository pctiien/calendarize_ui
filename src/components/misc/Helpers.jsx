import config from '../../Constants'

export function parseJwt(token) {
    if (!token) { return }
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace('-', '+').replace('_', '/')
    return JSON.parse(window.atob(base64))
}
export function getSocialLogin(provider)
{
    return `${config.API_BASE_URL}/auth/oauth2/authorize/${provider}?redirect_uri=${config.OAUTH2_REDIRECT_URL}`
}
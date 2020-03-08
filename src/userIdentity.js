import React, {type Context} from 'react'

let crypto = require('crypto')

export type Identity = {
    key: string
};

export interface IdentityService {
    getIdentity(): Identity
}

export class LocalStoreIdentityService {
    getIdentity() {
        var identityStr = localStorage.getItem('identity')
        if (!identityStr) {
            return this._generateIdentity()
        }

        try {
            let identity = JSON.parse(identityStr)
            return identity
        } catch(e) {
            console.log(e)
            return this._generateIdentity()
        }
    }

    _generateIdentity(): Identity {
        localStorage.setItem('identity', JSON.stringify({
            key: crypto.randomBytes(64).toString('hex')
        }))
        let identityStr = localStorage.getItem('identity')
        if (identityStr) {
            return JSON.parse(identityStr)
        } else {
            return this._generateIdentity()
        }
    }
}

export const IdentityContext: Context<IdentityService> = React.createContext(new LocalStoreIdentityService())

export default IdentityContext

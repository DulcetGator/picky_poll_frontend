import React, { Context } from 'react'
import { Poll } from './api'
let crypto = require('crypto')

type KnownPoll = {
    poll: Poll,
    knownBallots: string[]
}

type Identity = {
    key: string,
    knownPolls: KnownPoll[]
};

export interface IdentityService {
    getKey(): string,
    getKnownPolls(): Poll[],
    getKnownBallots(pollId: string): string[] | null,

    addKnownPoll(poll: Poll): void,
    addKnownBallot(pollId: string, ballotId: string): void,
}

export class LocalStoreIdentityService implements IdentityService {
    _getIdentity(): Identity {
        var identityStr = localStorage.getItem('identity')
        if (!identityStr) {
            return this._generateIdentity()
        }

        try {
            let identity = JSON.parse(identityStr)
            return identity
        } catch(e) {
            console.error(e)
            return this._generateIdentity()
        }
    }

    _generateIdentity(): Identity {
        localStorage.setItem('identity', JSON.stringify({
            key: crypto.randomBytes(64).toString('hex'),
            knownPolls: []
        }))
        let identityStr = localStorage.getItem('identity')
        if (identityStr) {
            return JSON.parse(identityStr)
        } else {
            return this._generateIdentity()
        }
    }

    _setIdentity(identity: Identity): void {
        localStorage.setItem('identity', JSON.stringify(identity))
    }

    getKey(): string {
        return this._getIdentity().key
    }

    getKnownPolls(): Poll[] {
        return this._getIdentity().knownPolls.map(p => p.poll)
    }

    getKnownBallots(pollId: string): string[] | null {
        let polls = this._getIdentity().knownPolls.filter(p => p.poll.id === pollId)
        if (polls.length > 0) {
            return polls[0].knownBallots
        } else {
            return null;
        }
    }

    addKnownPoll(poll: Poll): void {
        let identity = this._getIdentity()
        let desiredIndex = identity.knownPolls.findIndex(p => p.poll.id >= poll.id);
        if (desiredIndex > -1 && identity.knownPolls[desiredIndex].poll.id === poll.id) {
            return;
        } else {
            let newPoll: KnownPoll = {poll: poll, knownBallots: []}
            if (desiredIndex < 0) {
                identity.knownPolls = identity.knownPolls.concat([newPoll])
            } else {
                identity.knownPolls.splice(desiredIndex, 0, newPoll)
            }
            this._setIdentity(identity)
        }
    }

    addKnownBallot(pollId: string, ballotId: string): void {
        let oldIdentity = this._getIdentity()
        let oldPollIndex = oldIdentity.knownPolls.findIndex(p => p.poll.id === pollId)
        let oldPoll = oldIdentity.knownPolls[oldPollIndex]
        let newPoll: KnownPoll = {
            poll: oldPoll.poll,
            knownBallots: oldPoll.knownBallots.concat([ballotId])
        }
        oldIdentity.knownPolls[oldPollIndex]=newPoll
        this._setIdentity(oldIdentity);
    }
}

export const IdentityContext = React.createContext<IdentityService>(new LocalStoreIdentityService())

export default IdentityContext

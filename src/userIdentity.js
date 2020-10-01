import React, {type Context} from 'react'
import { type Poll } from './api'
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
    getKnownBallots(pollId: string): ?string[],

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
            console.log(e)
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

    getKnownBallots(pollId: string): ?string[] {
        let polls = this._getIdentity().knownPolls.filter(p => p.poll.id === pollId)
        if (polls.length > 0) {
            return polls[0].knownBallots
        } else {
            return null;
        }
    }

    addKnownPoll(poll: Poll): void {
        let oldIdentity = this._getIdentity()
        let desiredIndex = oldIdentity.knownPolls.findIndex(p => p.poll.id >= poll.id);
        if (desiredIndex > -1 && oldIdentity.knownPolls[desiredIndex].poll.id === poll.id) {
            return;
        } else {
            let newPoll: KnownPoll = {poll: poll, knownBallots: []}
            var newKnownPolls: KnownPoll[]
            if (desiredIndex < 0) {
                newKnownPolls = oldIdentity.knownPolls.concat([newPoll])
            } else {
                newKnownPolls = oldIdentity.knownPolls.splice(desiredIndex, 0, newPoll)
            }
            let newIdentity: Identity = {
                key: oldIdentity.key,
                knownPolls: newKnownPolls
            }
            this._setIdentity(newIdentity)
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

export const IdentityContext: Context<IdentityService> = React.createContext(new LocalStoreIdentityService())

export default IdentityContext

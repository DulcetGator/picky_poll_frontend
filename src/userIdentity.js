import React, {type Context} from 'react'

let crypto = require('crypto')

type KnownPoll = {
    pollId: string,
    knownBallots: string[]
}

type Identity = {
    key: string,
    knownPolls: KnownPoll[]
};

export interface IdentityService {
    getKey(): string,
    getKnownPolls(): string[],
    getKnownBallots(pollId: string): ?string[],

    addKnownPoll(pollId: string): void,
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

    getKnownPolls(): string[] {
        return this._getIdentity().knownPolls.map(p => p.pollId)
    }

    getKnownBallots(pollId: string): ?string[] {
        let polls = this._getIdentity().knownPolls.filter(p => p.pollId == pollId)
        if (polls.length > 0) {
            return polls[0].knownBallots
        } else {
            return null;
        }
    }

    addKnownPoll(pollId: string): void {
        let oldIdentity = this._getIdentity()
        let desiredIndex = oldIdentity.knownPolls.findIndex(p => p.pollId >= pollId);
        if (desiredIndex > -1 && oldIdentity.knownPolls[desiredIndex].pollId == pollId) {
            return;
        } else {
            let newPoll: KnownPoll = {pollId: pollId, knownBallots: []}
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
        let oldPollIndex = oldIdentity.knownPolls.findIndex(p => p.pollId == pollId)
        let oldPoll = oldIdentity.knownPolls[oldPollIndex]
        let newPoll: KnownPoll = {
            pollId: oldPoll.pollId,
            knownBallots: oldPoll.knownBallots.concat([pollId])
        }
        let newKnownPolls = oldIdentity.knownPolls.splice(oldPollIndex, 1, newPoll)
        this._setIdentity({
            key: oldIdentity.key,
            knownPolls: newKnownPolls
        })
    }
}

export const IdentityContext: Context<IdentityService> = React.createContext(new LocalStoreIdentityService())

export default IdentityContext

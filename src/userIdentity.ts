import React from 'react'
import { Poll } from './api'
let crypto = require('crypto')

export type KnownPoll = {
    poll: Poll,
    isMine: boolean,
    isHidden: boolean,
    knownBallots: string[]
}

type Identity = {
    key: string,
    knownPolls: KnownPoll[]
};

export interface IdentityService {
    getKey(): string,

    getKnownPolls(): KnownPoll[],
    getKnownBallots(pollId: string): string[] | null,

    addKnownPoll(poll: Poll, isMine: boolean): void,
    addKnownBallot(pollId: string, ballotId: string): void,

    hidePoll(pollId: string): void
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

    getKnownPolls(): KnownPoll[] {
        return this._getIdentity().knownPolls
    }

    getKnownBallots(pollId: string): string[] | null {
        let polls = this._getIdentity().knownPolls.filter(p => p.poll.id === pollId)
        if (polls.length > 0) {
            return polls[0].knownBallots
        } else {
            return null;
        }
    }

    addKnownPoll(poll: Poll, isMine: boolean): void {
        let identity = this._getIdentity()
        let desiredIndex = identity.knownPolls.findIndex(p => p.poll.id >= poll.id);
        if (desiredIndex > -1 && identity.knownPolls[desiredIndex].poll.id === poll.id) {
            this.mutateKnownPoll(poll.id, p => p.isHidden = false)
            return;
        } else {
            let newPoll: KnownPoll = {poll, isMine, isHidden: false, knownBallots: []}
            if (desiredIndex < 0) {
                identity.knownPolls = identity.knownPolls.concat([newPoll])
            } else {
                identity.knownPolls.splice(desiredIndex, 0, newPoll)
            }
            this._setIdentity(identity)
        }
    }

    addKnownBallot(pollId: string, ballotId: string): void {
        this.mutateKnownPoll(pollId, p => {
            p.knownBallots = p.knownBallots.concat([ballotId])
        })
    }

    hidePoll(pollId: string): void {
        this.mutateKnownPoll(pollId, p => p.isHidden=true)
    }

    mutateKnownPoll(pollId: string, mutator: (kp: KnownPoll) => void): void {
        const identity = this._getIdentity()
        const pollIndex = identity.knownPolls.findIndex(p => p.poll.id === pollId)
        const poll = identity.knownPolls[pollIndex]
        mutator(poll)
        this._setIdentity(identity);
    }
}

export const IdentityContext = React.createContext<IdentityService>(new LocalStoreIdentityService())

export default IdentityContext

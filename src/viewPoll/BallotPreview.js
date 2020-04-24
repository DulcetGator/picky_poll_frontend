import React, { Component } from "react";
import type { Ballot } from "../api";

type BallotPreviewProps = {
    ballot: Ballot
}

export default function BallotPreview(props: BallotPreviewProps) {
    return <p>{props.ballot.name}</p>
}
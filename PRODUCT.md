# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React + plain JavaScript, a single CSS file, `peerjs` as the only runtime dependency beyond React. Deployed as a static site on Vercel.

## Users

A product team (developers plus a facilitator, often the PM or scrum master) in a remote sprint grooming session. Each person is on their own laptop with the tool open beside a Meet/Zoom call. The job: estimate a backlog item together without anchoring on each other's numbers.

## Product Purpose

Poolthok is a planning-poker tool. People join a room by name, everyone privately picks a story-point card, and the facilitator reveals all cards at once, then clears them for the next item. Success means a round takes seconds, nobody needs an account, and nobody sees a number before the reveal.

## Positioning

No accounts, no backend, no stored data: the facilitator's browser is the room. It disappears when the session ends.

## Operating Context

- Used live during a grooming meeting, round after round, for one item at a time.
- Facilitator creates the room and shares a link (with the room code in the URL hash) in the call chat or Slack.
- Desktop-first; must still work on a phone.

## Capabilities and Constraints

- Roles: member and facilitator. The room creator is a facilitator and can make any member a facilitator too (or remove the role). Facilitators also vote, and only they can Reveal, Hide cards (undo a reveal, votes kept) and start the Next round. Only the creator's browser holds the room.
- Deck: 0.5, 1, 2, 3, 5, 8, 13. No "?" or coffee card.
- Before reveal, others see only whether a person has voted (status colour), never the value.
- On reveal: every card flips to show its value, plus the average and a "Consensus" marker when all votes match.
- Real-time sync is peer-to-peer (WebRTC via PeerJS and its public signaling server). No server storage. Each browser keeps its own name, role, room and vote in sessionStorage so a refresh rejoins the same seat.
- Known limits: the room ends if the facilitator closes their tab for good; some corporate networks block WebRTC.
- UI copy is English.

## Brand Commitments

Name: Poolthok. Minimal in code and in UI.

## Evidence on Hand

None. Do not invent testimonials, team names, or usage stats.

## Product Principles

1. A round is the unit: pick, reveal, next. Nothing competes with it.
2. Hidden until revealed. The interface never leaks a value early.
3. Zero setup: a name and a link are the whole onboarding.
4. Less code, fewer controls. Add nothing a grooming session would not miss.

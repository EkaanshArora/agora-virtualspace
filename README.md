# Agora Virtual Space

A 2D virtual space where user's can move around and voice/video chat with other user's near them.

![screenshot](/screenshot.png)

> Here's a [live demo](https://agora-virtualspace.vercel.app/)

### To run locally:

- Rename `.env.example` to `.env` and fill in the required details
- Execute `pnpm i` (if you don't hav pnpm install with `npm i -g pnpm`)
- Execute `pnpm run dev` to start a server on [localhost:3000](http://localhost:3000)

## Features

| **Feature** | **Description** |
| --- | --- |
| OAuth | Uses NextAuth for authentication |
| Space Management | Create & join rooms |
| Virtual Environment | A 2D enviornment that resembles an office or an event |
| User Avatar | A 2D avatar that the user can move around in the virtual space with the keyboard |
| Data Synchronisation | Sync locations across user |
| Animations | Animate the avatar with a spritesheet |
| Voice Channel | Ability for users to communicate with each other over voice |
| Video Feeds | Display user videos |
| Agora Tokens | Expose an API to secure rooms  |
| Proximity Subscription | Ability to join a voice channel based on location proximity |
| User controls | Ability to mute/unmute local audio/video feeds |
| Mobile Support | Works on mobile devices using gesture handler |
| Deployment (CI/CD) | Deploy the frontend and backend online |

## Future Additions
There's a lot more that can be added.
These aren't things I'm working on right now but would be happy to review PRs:

| **Potential Addition** | **Description** | **Status** |
| --- | --- | --- |
| Customize Environments | Select different environments for different rooms | &check; |
| Multiple sprites | Different avatars for users | _ |
| Spatial Audio | Ability to hear the audio directionally based on user(s) location | _ |
| 3D environments | Add another dimension to move around in 3D space resembling next-gen metaverses | _ |

Built with [Next](https://nextjs.org/), [Agora RTC SDK](https://agora.io/), [React-Three-Fiber](https://github.com/pmndrs/react-three-fiber)

Hosted on [Vercel](https://vercel.com/) with [PlanetScale](https://planetscale.com/)

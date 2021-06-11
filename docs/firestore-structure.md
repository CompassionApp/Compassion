# Firestore Structure

For our matchmaking app, we are following a denormalized storage strategy for our data ([more info](https://firebase.googleblog.com/2013/04/denormalizing-your-data-is-normal.html)), which means we will be trading storage capacity (by having duplicate data) to optimize for read performance.

## `/users`

### User profiles

User information, role, status

`/users/[email]`

## `/requests`

### Requests

All requests should create a document into this path.

`/requests/[request-id]/`

### User requests

Requests specific to the user. If a requester, open and scheduled requests belong here. If a chaperone, accepted and scheduled requests belong here.

`/users/[email]/requests/[request-id]`

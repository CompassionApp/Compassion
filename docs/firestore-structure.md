# Firestore Structure

Firestore is a NoSQL database that stores documents and nests them under _collections_. [You can find the Firestore console by clicking here.](https://console.firebase.google.com/u/0/project/compassionapp-5b812/firestore/data/~2F)

For our matchmaking app, we are following a denormalized storage strategy for our data ([more info](https://firebase.googleblog.com/2013/04/denormalizing-your-data-is-normal.html)), which means we will be trading storage capacity (by having duplicate data) to optimize for read performance.

## `/users`

### User profiles

Contains all user information essential to the app, such as: role, status, timestamps (createdAt, lastLoginAt), name, and settings.

> **Path:** `/users/[email]`

### User requests

Requests specific to the user. If a requester, open and scheduled requests belong here. If a chaperone, accepted and scheduled requests belong here.

> **Path:** `/users/[email]/requests/[request-id]`

### Notifications

Notifications inbox for a user. Contains documents of all notifications sent specifically to that user.

> **Path:** `/users/[email]/notifications/[notification-id]`

## `/requests`

### Requests

All requests should create a document into this path.

> **Path:** `/requests/[request-id]/`

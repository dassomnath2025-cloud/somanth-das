# Firestore Security Specification

## Data Invariants
1. **User Identity Invariant**: A user profile document `/users/{userId}` can only be created or modified by the authenticated user whose `request.auth.uid == userId`.
2. **Author Integrity Invariant**: Pins `/pins/{pinId}` must have `authorId == request.auth.uid`. A user cannot forge a pin under someone else's identity.
3. **Pin Ownership on Delete/Edit**: Only the pin's original author (`resource.data.authorId == request.auth.uid`) or authorized admin can update pin details or delete a pin.
4. **Board Ownership**: Only the board creator (`resource.data.userId == request.auth.uid`) can modify, delete, or add/remove pins in private boards.
5. **Comment Integrity**: In `/pins/{pinId}/comments/{commentId}`, `authorId` must match `request.auth.uid`.
6. **Interaction Engagements**: Likes and saves increments must be non-destructive numeric changes.
7. **Admin Donation Config Invariant**: `/configs/donation` can only be updated if `request.auth.token.email == 'dassomnath2025@gmail.com'` or user profile email matches the admin email. Read is public so that users can view donation QR details.

## The "Dirty Dozen" Payloads
1. **Payload 1 (Identity Spoofing - User)**: Attempt to write to `/users/victim_user_123` with `auth.uid = attacker_456`. -> Result: PERMISSION_DENIED.
2. **Payload 2 (Admin Role Escalation)**: User attempts to set an `isAdmin: true` claim or write to `/admins/{uid}`. -> Result: PERMISSION_DENIED.
3. **Payload 3 (Pin Author Impersonation)**: Unauthenticated user or User B creates a pin with `authorId = "user_A"`. -> Result: PERMISSION_DENIED.
4. **Payload 4 (Pin Tampering)**: User B attempts to overwrite `imageUrl` or `title` of a pin created by User A. -> Result: PERMISSION_DENIED.
5. **Payload 5 (Junk ID Poisoning)**: Write to `/pins/{pinId}` where `pinId` is an invalid 2KB string with illegal characters. -> Result: PERMISSION_DENIED.
6. **Payload 6 (Oversized Payload Denial of Wallet)**: Pin title exceeding max character limits (e.g., > 10,000 characters). -> Result: PERMISSION_DENIED.
7. **Payload 7 (Private Board Snooping)**: User B attempts to read a board marked `isPrivate = true` belonging to User A. -> Result: PERMISSION_DENIED.
8. **Payload 8 (Board Deletion Unauthorized)**: User B attempts to delete User A's board. -> Result: PERMISSION_DENIED.
9. **Payload 9 (Comment Author Spoofing)**: Attacker writes a comment on a pin claiming to be `@somnath` with mismatched `authorId`. -> Result: PERMISSION_DENIED.
10. **Payload 10 (Unauthorized Donation Config Update)**: Non-admin user tries to redirect donation UPI ID to their personal payment address. -> Result: PERMISSION_DENIED.
11. **Payload 11 (Unauthenticated Write)**: Anonymous / unauthenticated request tries to add a pin to the feed. -> Result: PERMISSION_DENIED.
12. **Payload 12 (Blanket Collection Write)**: Arbitrary document creation in an undefined path `/system_secrets/config`. -> Result: PERMISSION_DENIED.

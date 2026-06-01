# Security Specification

## 1. Data Invariants
* A project cannot exist without a valid projectId and ownerId.
* Project ownerId must strictly match request.auth.uid.
* originalImage, filteredImage, adjustments, and texts can be empty strings but must be strings.
* Project title must be string and <= 100 characters.

## 2. Dirty Dozen Payloads
1. Unauthorized user attempting to read another user's project
2. User creating a project with ownerId belonging to another user
3. Update project ownerId to someone else (Immutable logic fail)
4. Update project title with an integer instead of a string
5. Unauthenticated user reading a project
6. Update a project omitting required fields (Shadow Update)
7. Create a project with invalid schema
8. Update a project injecting malicious arbitrary fields
9. Update a project skipping validation helper
10. Attempting to poison projectId with an overly long identifier
11. Update with spoofed createdAt/updatedAt
12. Create with spoofed createdAt

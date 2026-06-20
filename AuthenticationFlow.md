# Authentication & Authorization Architecture

Below are the detailed flows for how authentication (verifying who a user is) and authorization (verifying what a user is allowed to do) work in the Ghatkaari Backend.

## 1. Pre-Signup Verification Flow
This flow ensures that no junk data enters the database. Users must verify their contact details via Redis before the actual MongoDB `User` document is created.

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant Auth Controller
    participant Redis Cache
    participant Resend / SMS
    participant MongoDB

    %% Email Verification
    User->>Frontend: Enters Email
    Frontend->>Auth Controller: POST /send-email-otp
    Auth Controller->>MongoDB: Check if email exists
    Auth Controller->>Redis Cache: Store OTP (5 min expiry)
    Auth Controller->>Resend / SMS: Send OTP to User
    
    User->>Frontend: Enters Email OTP
    Frontend->>Auth Controller: POST /verify-email-otp
    Auth Controller->>Redis Cache: Validate OTP
    Auth Controller->>Redis Cache: Create "Verified Ticket" (30 min expiry)
    Auth Controller-->>Frontend: Success (Email Verified)

    %% Mobile Verification
    User->>Frontend: Enters Mobile
    Frontend->>Auth Controller: POST /send-mobile-otp
    Auth Controller->>Redis Cache: Store OTP (5 min expiry)
    
    User->>Frontend: Enters Mobile OTP
    Frontend->>Auth Controller: POST /verify-mobile-otp
    Auth Controller->>Redis Cache: Validate OTP
    Auth Controller->>Redis Cache: Create "Verified Ticket" (30 min expiry)
    Auth Controller-->>Frontend: Success (Mobile Verified)

    %% Final Signup
    User->>Frontend: Submits Password & Name
    Frontend->>Auth Controller: POST /signup {email, mobile, password, name}
    Auth Controller->>Redis Cache: Check for Email & Mobile "Verified Tickets"
    Auth Controller->>MongoDB: Hash Password & Save User
    Auth Controller->>Redis Cache: Delete Tickets
    Auth Controller-->>Frontend: 201 Created (Signup Complete)
```

## 2. Login & Token Generation Flow
This flow handles generating the JWTs and setting the highly secure `HttpOnly` cookies.

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant Auth Controller
    participant MongoDB
    participant JWT Utility

    User->>Frontend: Enters Email & Password
    Frontend->>Auth Controller: POST /login {email, password}
    
    Auth Controller->>MongoDB: Find User by Email
    Auth Controller->>Auth Controller: Compare Hashed Password
    Auth Controller->>Auth Controller: Check AccountStatus (Active/Suspended)
    
    Auth Controller->>JWT Utility: Request Tokens
    JWT Utility-->>Auth Controller: AccessToken (15m) & RefreshToken (7d)
    
    Auth Controller->>MongoDB: Save RefreshToken in DB
    
    Auth Controller-->>Frontend: 200 OK + Set-Cookie (HttpOnly) + JSON Body
```

## 3. Authorization Flow (Accessing Protected Routes)
This flow demonstrates how the middlewares intercept requests to verify identity and check permissions.

```mermaid
sequenceDiagram
    participant Frontend
    participant Express Router
    participant Authenticate Middleware
    participant Authorize Middleware
    participant Protected Controller
    participant MongoDB

    Frontend->>Express Router: GET /api/v1/admin/dashboard (Sends Cookie/Bearer Token)
    
    %% Authentication Phase
    Express Router->>Authenticate Middleware: Intercept Request
    Authenticate Middleware->>Authenticate Middleware: Extract AccessToken
    Authenticate Middleware->>Authenticate Middleware: Verify JWT Cryptographic Signature
    Authenticate Middleware->>MongoDB: Fetch User by Decoded ID
    Authenticate Middleware->>Authenticate Middleware: Check if AccountStatus is ACTIVE
    Authenticate Middleware->>Express Router: Attach User to `req.user` & Proceed
    
    %% Authorization Phase
    Express Router->>Authorize Middleware: Intercept Request
    Authorize Middleware->>Authorize Middleware: Check if `req.user.role` == 'ADMIN'
    
    alt Role is CUSTOMER (Unauthorized)
        Authorize Middleware-->>Frontend: 403 Forbidden Error
    else Role is ADMIN (Authorized)
        Authorize Middleware->>Protected Controller: Proceed to Route Logic
        Protected Controller-->>Frontend: 200 OK (Admin Dashboard Data)
    end
```

# Real-Time Contact Notifications - Setup Guide

## Overview
Implemented Socket.IO-based real-time notifications for contact form submissions to the Admin Dashboard. When users submit a contact form on the Client side, admins receive instant notifications on the Admin Dashboard.

## Files Modified & Created

### Server Side (Backend)

#### 1. **server.js** - ✅ Updated
- Added `http` module import for Socket.IO server
- Imported `initSocket` from io.js
- Created HTTP server wrapper around Express
- Initialize Socket.IO with `initSocket(server)`
- Changed from `app.listen()` to `server.listen()` for Socket.IO support

#### 2. **config/io.js** - ✅ Updated
- Fixed async/await syntax error
- Proper Socket.IO Server initialization
- Added CORS configuration for multiple origins
- Socket connection event handlers for admin rooms
- `initSocket()` - Initializes Socket.IO
- `getIO()` - Returns Socket.IO instance

#### 3. **controllers/contactController.js** - ✅ Updated
- Added Socket.IO notification on contact submission
- Imports `getIO` from io.js
- Emits 'new-contact' event to admin-room when contact created
- Contact data sent: id, name, email, message, createdAt
- Error handling for Socket.IO failures
- Maintained existing email notification functionality

### Admin Dashboard Side (Frontend)

#### 4. **hooks/useSocket.js** - ✅ Created
- Custom React hook for Socket.IO client connection
- Automatic connection management
- Auto-reconnection with exponential backoff
- Joins 'admin-room' on connection
- Returns: `{ socket, isConnected }`
- Usage:
  ```jsx
  const { socket, isConnected } = useSocket();
  ```

#### 5. **components/NotificationCenter.jsx** - ✅ Created
- Central notification management component
- Displays toast notifications for new contacts
- Shows connection status indicator
- Auto-removes notifications after 6 seconds
- Features:
  - Real-time toast notifications
  - Connection status badge (green/red)
  - Stores last 20 notifications in memory

#### 6. **components/ContactNotification.jsx** - ✅ Created
- Individual notification toast component
- Displays: Name, Email, Message snippet
- Auto-closes after 6 seconds
- Manual close button
- Smooth animations with slideIn effect

#### 7. **pages/Dashboard.jsx** - ✅ Updated
- Integrated NotificationCenter component
- Real-time contact list that updates with new submissions
- Displays existing contacts from database
- Shows connection status
- Fetches contacts on initial load
- Updates table in real-time via Socket.IO

#### 8. **index.css** - ✅ Updated
- Added `slideIn` animation keyframes
- Added `animate-slideIn` utility class
- Used for smooth notification appearance

#### 9. **package.json** - ✅ Updated
- Added `socket.io-client`: ^4.7.2 dependency

#### 10. **.env.example** - ✅ Created
- Configuration template for Socket.IO server URL
- Variable: `VITE_SERVER_URL=http://localhost:5000`

## Setup Instructions

### Step 1: Install Dependencies

**Server:**
```bash
cd Server
npm install socket.io
```

**Admin:**
```bash
cd Admin
npm install
```

### Step 2: Configure Environment Variables

**Admin/.env** (Create from .env.example):
```env
VITE_SERVER_URL=http://localhost:5000
```

### Step 3: Start the Application

**Terminal 1 - Server:**
```bash
cd Server
npm start
```

**Terminal 2 - Admin Dashboard:**
```bash
cd Admin
npm run dev
```

**Terminal 3 - Client (Optional):**
```bash
cd Client
npm run dev
```

## How It Works

### Flow Diagram:
```
Client (ContactForm) 
    ↓
    POST /api/contact
    ↓
Server (contactController)
    ↓
    Save to Database
    Emit 'new-contact' event to 'admin-room'
    ↓
Admin Dashboard (Socket.IO client)
    ↓
    Listen to 'new-contact' event
    Display toast notification + update table
```

### Real-Time Events:

1. **Connection:**
   - Admin connects to Socket.IO server
   - Joins 'admin-room'
   - Connection status shows "Connected"

2. **New Contact:**
   - User submits contact form
   - Server validates and saves to database
   - Server emits 'new-contact' event with contact data
   - Admin sees:
     - Toast notification (6 seconds)
     - Table updates with new contact
     - Connection status confirmed

3. **Disconnection:**
   - Admin loses connection
   - Connection status shows "Disconnected"
   - Auto-reconnect attempts (5 attempts with backoff)

## Testing the Implementation

1. **Start all services** (Server, Admin, Client)

2. **Open Admin Dashboard** (http://localhost:5174)
   - Look for "Connected" status at bottom-right
   - Connection badge should be green

3. **Submit Contact Form** (http://localhost:5173)
   - Fill in Name, Email, Message
   - Click "Send Message"

4. **Verify Notification:**
   - Toast notification appears in Admin Dashboard
   - Table updates with new contact
   - Auto-dismisses after 6 seconds

## Architecture Benefits

✅ **Real-Time Updates** - No page refresh needed
✅ **Scalable** - Socket.IO rooms for multi-admin support
✅ **Reliable** - Email + Real-time notification (dual alerts)
✅ **User-Friendly** - Clear visual feedback
✅ **Connection Management** - Auto-reconnect with backoff
✅ **Error Handling** - Graceful fallback if Socket.IO fails

## Future Enhancements

1. **Persist Notifications** - Store in database
2. **Email Alerts** - Send admin email on new contact
3. **Sound Alert** - Audio notification option
4. **Reply via Dashboard** - Send responses to visitors
5. **Multi-Admin Support** - Multiple admins get notifications
6. **Contact Status** - Mark as read/unread
7. **Search & Filter** - Find specific contacts
8. **Export** - Download contacts as CSV/PDF

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Connection refused | Check server is running on port 5000 |
| No notifications | Verify admin room join event fires |
| CORS errors | Check VITE_SERVER_URL matches server origin |
| Notifications not persisting | They auto-dismiss after 6s (by design) |

## Dependencies Added

- **socket.io** (Server) - Real-time communication
- **socket.io-client** (Admin) - Client Socket.IO library

## Contact Model Structure

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  message: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Socket Events

**Emitted by Server:**
- `new-contact` - Sent to 'admin-room' when new contact created

**Listened by Admin:**
- `new-contact` - Triggers notification and table update
- `connect` - Admin successfully connected
- `disconnect` - Connection lost

# UV Proxy Setup for Pine

## 🎯 Overview

Pine now uses **UV (Ultraviolet) Proxy** from [UV-Static-2.0](https://github.com/rhenryw/UV-Static-2.0) to proxy all external game URLs. This provides:

- ✅ Bypass CORS restrictions
- ✅ Unblock geo-restricted content
- ✅ Secure HTTPS proxying via WISP
- ✅ Better privacy and security

## 📁 Files Structure

```
/public/active/          # UV-Static-2.0 installation
├── uv/
│   ├── uv.bundle.js    # UV core bundle
│   ├── uv.config.js    # UV configuration
│   ├── uv.client.js    # UV client library
│   ├── uv.sw.js        # UV service worker logic
│   └── sw.js           # Service worker entry point
├── prxy/               # BareMux and transport modules
│   ├── baremux/
│   ├── epoxy/
│   └── libcurl/
└── scripts/            # UV helper scripts
```

## 🚀 How It Works

### 1. **Service Worker Registration**

When a user visits a game page:
- UV service worker registers at `/active/uv/service/` scope
- Service worker intercepts fetch requests
- External URLs are proxied through WISP server

### 2. **URL Encoding**

```javascript
// Original URL
https://poki.com/en/g/subway-surfers

// Gets encoded by UV
/active/uv/service/{encoded-url}

// Service worker intercepts and fetches through proxy
```

### 3. **Game Loading Flow**

```
User clicks game
    ↓
UV Service Worker registers
    ↓
UV Client scripts load
    ↓
Game URL encoded
    ↓
iframe src = /active/uv/service/{encoded}
    ↓
Service Worker intercepts
    ↓
Fetches via WISP proxy
    ↓
Game loads in iframe
```

## 🔧 Configuration

### UV Config (`/public/active/uv/uv.config.js`)

```javascript
self.__uv$config = {
  prefix: "/active/uv/service/",        // Service worker scope
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: "/active/uv/uv.handler.js",
  client: "/active/uv/uv.client.js",
  bundle: "/active/uv/uv.bundle.js",
  config: "/active/uv/uv.config.js",
  sw: "/active/uv/uv.sw.js",
};
```

### WISP Server

Currently using: `wss://gointospace.app/wisp/`

To change, edit `/public/active/scripts/prxy.mjs`:
```javascript
let wispUrl = "wss://your-wisp-server.com/wisp/";
```

## 💻 Usage in Code

### Client-side (React/Next.js)

```typescript
import { registerUVServiceWorker, getUVProxyUrl, ensureUVClientReady } from '@/lib/uv-proxy'

// In component
useEffect(() => {
  (async () => {
    // Register service worker
    await registerUVServiceWorker()
    
    // Load UV client scripts
    await ensureUVClientReady()
    
    // Now UV is ready
  })()
}, [])

// Proxy a URL
const proxiedUrl = getUVProxyUrl('https://poki.com/en/g/game')
// Returns: /active/uv/service/{encoded-url}
```

### API Endpoint

For server-side redirects:
```
/api/uv-redirect?url=https://example.com
```

This returns an HTML page that:
1. Loads UV scripts
2. Registers service worker
3. Loads game in iframe through UV

## 🎮 Proxied Routes

### Automatic UV Proxying

All external game URLs are automatically proxied:

| Source | Example URL | Proxied? |
|--------|-------------|----------|
| Poki | `https://poki.com/...` | ✅ Yes |
| PlayGama | `https://playgama.com/...` | ✅ Yes |
| GameDist | `https://gamedistribution.com/...` | ✅ Yes |
| External | Any `https://...` | ✅ Yes |

### Internal Routes (No Proxy)

These routes are NOT proxied:

| Route | Purpose |
|-------|---------|
| `/play/{id}` | Game player page |
| `/api/proxy/...` | Server-side proxy (will be migrated) |
| `/proxy/...` | Server-side proxy (will be migrated) |
| Same-origin URLs | Internal content |

## 🔄 Migration Path

### Old Proxying (Server-side)
```
Client → /api/proxy/... → Server fetches → Client
```

### New Proxying (UV Service Worker)
```
Client → /active/uv/service/... → Service Worker → WISP → Target
```

Benefits:
- ✅ Faster (no server roundtrip)
- ✅ More reliable
- ✅ Better CORS handling
- ✅ Reduced server load

## 🐛 Troubleshooting

### Games Not Loading

1. **Check Service Worker Registration**
```javascript
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Service Workers:', registrations)
})
```

2. **Check UV Scripts Loaded**
```javascript
console.log('UV Config:', window.__uv$config)
console.log('UV Class:', window.Ultraviolet)
```

3. **Check Console for Errors**
Look for:
- `[UV] Service Worker registered`
- `[UV] Proxy ready for games`

### Service Worker Not Registering

- Make sure you're on HTTPS or localhost
- Clear browser cache and service workers
- Check `/active/uv/sw.js` is accessible

### CORS Errors

If you still see CORS errors:
- Service worker may not be intercepting
- Check service worker scope is correct
- Try force refresh (Cmd/Ctrl + Shift + R)

## 📊 Testing

### Test UV Proxy

```bash
# Start dev server
npm run dev

# Open browser to
http://localhost:3000/play/{any-game-id}

# Check console for:
# [UV] Service Worker registered: /active/uv/service/
# [UV] Proxy ready for games
```

### Test Direct UV

Visit: `http://localhost:3000/active/`

This opens the UV browser interface where you can:
- Enter any URL
- Test proxying directly
- Debug issues

## 🔐 Security Notes

- UV proxy runs entirely client-side (in service worker)
- No game content passes through your server
- WISP connection is encrypted (WSS)
- Service worker scope is limited to `/active/uv/service/`

## 🚀 Performance

- First load: ~500ms (service worker registration)
- Subsequent loads: instant (service worker active)
- No server overhead for game content
- Parallel game loading supported

## 📚 Resources

- UV-Static-2.0: https://github.com/rhenryw/UV-Static-2.0
- Ultraviolet: https://github.com/titaniumnetwork-dev/Ultraviolet
- WISP Protocol: https://github.com/MercuryWorkshop/wisp-protocol

## 🔄 Future Improvements

1. **Multiple WISP Servers**: Load balance across multiple servers
2. **Fallback Proxies**: Use server-side proxy if UV fails
3. **Custom WISP Server**: Deploy own WISP server
4. **Proxy Caching**: Cache proxied content for faster loads
5. **Analytics**: Track proxy usage and errors

---

**Note**: UV proxy requires HTTPS in production. Use localhost for development.


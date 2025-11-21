# Responsive Design Testing Guide

## Quick Testing Methods

### 1. Browser DevTools (Easiest Method)

#### Chrome/Edge:
1. Open your app: `http://localhost:5173/my-account`
2. Press `F12` or `Right-click → Inspect`
3. Press `Ctrl+Shift+M` (Windows) or `Cmd+Shift+M` (Mac) to toggle device toolbar
4. Select device presets or enter custom dimensions

#### Firefox:
1. Press `F12` → Click the responsive design icon (or `Ctrl+Shift+M`)
2. Select device presets from dropdown

### 2. Test These Breakpoints

#### Mobile (320px - 767px)
- **iPhone SE**: 375px × 667px
- **iPhone 12/13**: 390px × 844px
- **Samsung Galaxy**: 360px × 800px
- **iPad Mini**: 768px × 1024px

#### Tablet (768px - 1023px)
- **iPad**: 768px × 1024px
- **iPad Pro**: 1024px × 1366px

#### Desktop (1024px+)
- **Laptop**: 1280px × 720px
- **Desktop**: 1920px × 1080px

### 3. What to Check

#### ✅ Navigation
- [ ] Mobile: Horizontal tab navigation at top
- [ ] Desktop: Vertical sidebar navigation on left
- [ ] Tabs are easily tappable (min 44px height)
- [ ] Active tab is clearly highlighted

#### ✅ Account Dashboard
- [ ] Profile card displays properly
- [ ] Statistics grid: 2 columns on mobile, 4 on desktop
- [ ] Text is readable without zooming
- [ ] Buttons are properly sized

#### ✅ Booking History
- [ ] Filters section is accessible
- [ ] Filter inputs stack vertically on mobile
- [ ] Filter inputs are horizontal on desktop
- [ ] Booking cards stack properly
- [ ] Hotel images display correctly
- [ ] All text is readable

#### ✅ Booking Cards
- [ ] Mobile: Image and content stack vertically
- [ ] Desktop: Image on left, content on right
- [ ] Status badges are visible
- [ ] Action buttons are tappable
- [ ] No content overflow

#### ✅ General
- [ ] No horizontal scrolling
- [ ] All interactive elements are tappable (min 44×44px)
- [ ] Text is readable (min 16px font size)
- [ ] Spacing is adequate
- [ ] Images scale properly
- [ ] Forms are usable on mobile

### 4. Test Scenarios

#### Scenario 1: View Account Dashboard
1. Navigate to `/my-account`
2. Check mobile view (375px)
3. Check tablet view (768px)
4. Check desktop view (1280px)
5. Verify statistics grid adapts correctly

#### Scenario 2: View Booking History
1. Click "Booking History" tab
2. Test filter dropdowns on mobile
3. Test date inputs on mobile
4. Verify booking cards display correctly
5. Test scrolling through multiple bookings

#### Scenario 3: Edit Booking
1. Click "Edit" on a booking
2. Verify dialog/modal is mobile-friendly
3. Test form inputs on mobile
4. Verify buttons are accessible

### 5. Common Issues to Watch For

❌ **Horizontal Scrolling**: Should never happen
❌ **Tiny Text**: Minimum 16px font size
❌ **Overlapping Elements**: Check at all breakpoints
❌ **Cut-off Content**: Ensure all content is visible
❌ **Tiny Touch Targets**: Buttons should be at least 44×44px
❌ **Fixed Width Elements**: Should use responsive units (%, rem, etc.)

### 6. Browser Testing

Test in multiple browsers:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (if on Mac)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

### 7. Performance on Mobile

- [ ] Page loads quickly on 3G/4G
- [ ] Images are optimized
- [ ] No layout shifts during load
- [ ] Smooth scrolling

### 8. Accessibility on Mobile

- [ ] All interactive elements are keyboard accessible
- [ ] Focus states are visible
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen reader friendly (if applicable)

## Quick Test Checklist

```
Mobile (375px):
[ ] Navigation tabs visible and tappable
[ ] Dashboard stats in 2 columns
[ ] Booking cards stack vertically
[ ] Filters are accessible
[ ] No horizontal scroll

Tablet (768px):
[ ] Layout adapts appropriately
[ ] Sidebar appears or navigation changes
[ ] Content is well-spaced

Desktop (1280px):
[ ] Full sidebar navigation
[ ] Stats in 4 columns
[ ] Booking cards side-by-side layout
[ ] Optimal use of space
```

## Automated Testing (Optional)

You can also use browser extensions:
- **Responsive Viewer** (Chrome Extension)
- **Window Resizer** (Chrome Extension)
- **Responsive Design Mode** (Built into Firefox)

## Real Device Testing

1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Access from mobile: `http://YOUR_IP:5173/my-account`
3. Test on actual devices for best results

---

**Note**: The current implementation uses Tailwind CSS responsive classes:
- `sm:` - 640px and up
- `md:` - 768px and up  
- `lg:` - 1024px and up
- `xl:` - 1280px and up


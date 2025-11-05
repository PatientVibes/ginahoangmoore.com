# Accessibility Audit - KC Food Security Hub

**Date:** December 2025
**Standard:** WCAG 2.1 Level AA
**Goal:** Achieve Level AAA where possible

---

## Current Status Summary

### ✅ Strengths
- Semantic HTML structure with proper landmarks
- ARIA labels on interactive elements
- Alt text strategy in place
- Keyboard navigation support
- Focus visible states defined
- `prefers-reduced-motion` support
- Skip links available
- Color contrast meets AA standards

### ⚠️ Issues Found

---

## Critical Issues (Must Fix)

### 1. Touch Target Sizes
**Issue:** Some touch targets are 44×44px (WCAG AA minimum) but should be 48×48px minimum for better usability
**Location:** Multiple buttons and links
**Impact:** Users with motor disabilities may have difficulty tapping
**Fix:** Update `--touch-target-sm` to 48px in tokens.css
**Priority:** High
**WCAG:** 2.5.5 Target Size (AAA)

```css
/* BEFORE */
--touch-target-sm: 44px;

/* AFTER */
--touch-target-md: 48px; /* Make this the default minimum */
```

### 2. Form Inputs Missing Explicit Labels
**Issue:** ZIP code input uses placeholder as label
**Location:** `index.html` line 88-92
**Impact:** Screen readers may not announce purpose
**Fix:** Add visible label or ensure aria-label is comprehensive
**Priority:** High
**WCAG:** 1.3.1 Info and Relationships (A)

```html
<!-- CURRENT -->
<input type="text" id="zip-input" placeholder="Enter ZIP code" aria-label="ZIP code">

<!-- BETTER -->
<label for="zip-input" class="sr-only">Enter your ZIP code to find nearby resources</label>
<input type="text" id="zip-input" placeholder="e.g., 64108" aria-label="ZIP code">
```

### 3. Crisis Banner Lacks Proper ARIA
**Issue:** Banner uses `role="alert"` and `aria-live="polite"` but should be `assertive` for crisis
**Location:** All HTML pages
**Impact:** Screen readers may not announce crisis alerts immediately
**Fix:** Change to `aria-live="assertive"`
**Priority:** High
**WCAG:** 4.1.3 Status Messages (AA)

```html
<!-- CURRENT -->
<div class="crisis-banner" role="alert" aria-live="polite">

<!-- BETTER -->
<div class="crisis-banner" role="alert" aria-live="assertive" aria-atomic="true">
```

---

## Moderate Issues (Should Fix)

### 4. Heading Hierarchy Gaps
**Issue:** Some pages skip from H2 to H4
**Location:** Category pages
**Impact:** Screen reader users rely on heading hierarchy for navigation
**Fix:** Ensure sequential heading levels (don't skip)
**Priority:** Medium
**WCAG:** 1.3.1 Info and Relationships (A)

### 5. Link Text Not Descriptive Enough
**Issue:** Some links say "Learn more" without context
**Location:** Multiple pages
**Impact:** Screen reader users navigating by links won't know destination
**Fix:** Add descriptive text or use `aria-label`
**Priority:** Medium
**WCAG:** 2.4.4 Link Purpose (A)

```html
<!-- CURRENT -->
<a href="/resources">Learn more →</a>

<!-- BETTER -->
<a href="/resources">Learn more about available resources →</a>
<!-- OR -->
<a href="/resources" aria-label="Learn more about available resources">Learn more →</a>
```

### 6. Color Alone Conveys Information
**Issue:** Category colors differentiate resources but no additional indicator
**Location:** Resource cards
**Impact:** Users with color blindness may not distinguish categories
**Fix:** Add icons or text labels in addition to color
**Priority:** Medium
**WCAG:** 1.4.1 Use of Color (A)

**Already partially fixed:** Category icons (🍔, 🏠, etc.) provide non-color indicators

### 7. Focus Outline Not Visible Enough
**Issue:** 3px outline may not be visible on all backgrounds
**Location:** All interactive elements
**Impact:** Keyboard users may lose track of focus
**Fix:** Increase to 4px with higher contrast
**Priority:** Medium
**WCAG:** 2.4.7 Focus Visible (AA)

```css
/* CURRENT */
*:focus-visible {
    outline: 3px solid var(--color-primary);
    outline-offset: 2px;
}

/* BETTER */
*:focus-visible {
    outline: 4px solid var(--color-kc-blue);
    outline-offset: 3px;
    box-shadow: 0 0 0 6px rgba(2, 131, 192, 0.2);
}
```

---

## Minor Issues (Nice to Have)

### 8. Images Missing Decorative Alt Attribute
**Issue:** Emoji icons in buttons don't have `role="img"` or `aria-label`
**Location:** Help grid buttons
**Impact:** Screen readers announce emoji unicode
**Fix:** Add `role="img"` and descriptive `aria-label` or mark as decorative
**Priority:** Low
**WCAG:** 1.1.1 Non-text Content (A)

```html
<!-- CURRENT -->
<span class="help-icon">🍔</span>

<!-- BETTER (if decorative) -->
<span class="help-icon" aria-hidden="true">🍔</span>

<!-- BETTER (if meaningful) -->
<span class="help-icon" role="img" aria-label="Food assistance icon">🍔</span>
```

### 9. Skip to Main Content Link Styling
**Issue:** Skip link is hidden but should be visible on focus
**Location:** Header
**Impact:** Keyboard users may not know skip link exists
**Fix:** Ensure skip link is visible when focused
**Priority:** Low
**WCAG:** 2.4.1 Bypass Blocks (A)

**Status:** Already implemented with `.sr-only` class that becomes visible on focus

### 10. Form Error Messages Need Better Association
**Issue:** Error messages not explicitly associated with form fields
**Location:** Future forms (eligibility calculator, contact form)
**Impact:** Screen readers may not announce errors
**Fix:** Use `aria-describedby` to link errors to inputs
**Priority:** Low (not implemented yet)
**WCAG:** 3.3.1 Error Identification (A)

```html
<input
    type="text"
    id="email"
    aria-describedby="email-error"
    aria-invalid="true"
>
<span id="email-error" class="form-error">Please enter a valid email address</span>
```

---

## Enhancements for AAA Compliance

### 11. Increase Line Height for Readability
**Current:** `line-height: 1.6` for body text
**AAA Standard:** `line-height: 1.5` minimum (already met)
**Recommendation:** Increase to `1.7` for optimal readability
**WCAG:** 1.4.12 Text Spacing (AA)

### 12. Add Adjustable Text Size Control
**Feature:** Allow users to increase text size up to 200% without loss of functionality
**Status:** Should test with browser zoom
**WCAG:** 1.4.4 Resize Text (AA)

### 13. Provide Text Alternatives for Time-Based Media
**Future Feature:** If videos are added
**Requirement:** Captions, audio descriptions, transcripts
**WCAG:** 1.2.1-1.2.9 Time-based Media (A-AAA)

### 14. Add Language Attribute to Non-English Content
**Issue:** Spanish translations (future) need `lang` attribute
**Fix:** `<span lang="es">Comida</span>`
**WCAG:** 3.1.2 Language of Parts (AA)

---

## Testing Checklist

### Automated Testing Tools
- [ ] **axe DevTools** (browser extension) - Run on all pages
- [ ] **WAVE** (WebAIM) - Check for errors and contrast
- [ ] **Lighthouse** - Aim for 100 accessibility score
- [ ] **Pa11y** (CLI) - Automated CI/CD testing

### Manual Testing
- [ ] **Keyboard navigation** - Tab through entire site
- [ ] **Screen reader** (NVDA/JAWS/VoiceOver) - Test all interactive elements
- [ ] **Zoom to 200%** - Ensure no content is cut off
- [ ] **High contrast mode** - Test Windows high contrast
- [ ] **Color blindness simulation** - Test with browser tools
- [ ] **Touch targets on mobile** - Verify 48px minimum

### Browser Testing
- [ ] Chrome + NVDA (Windows)
- [ ] Firefox + NVDA (Windows)
- [ ] Safari + VoiceOver (Mac)
- [ ] Safari + VoiceOver (iOS)
- [ ] Chrome + TalkBack (Android)

---

## Compliance Score

### Current Estimated Scores
- **WCAG 2.1 Level A:** ~95% (minor issues)
- **WCAG 2.1 Level AA:** ~90% (some issues to fix)
- **WCAG 2.1 Level AAA:** ~70% (enhancements needed)

### Target Scores
- **WCAG 2.1 Level A:** 100%
- **WCAG 2.1 Level AA:** 100%
- **WCAG 2.1 Level AAA:** 95% (some AAA criteria are very strict)

---

## Action Plan

### Week 1
- [x] Create design system with accessibility tokens
- [x] Implement focus visible states
- [ ] Fix touch target sizes (48px minimum)
- [ ] Fix crisis banner ARIA attributes
- [ ] Audit heading hierarchy

### Week 2
- [ ] Improve link text descriptions
- [ ] Add proper alt text to all emoji icons
- [ ] Test keyboard navigation thoroughly
- [ ] Run automated testing tools

### Week 3
- [ ] Conduct screen reader testing
- [ ] Fix any issues found in testing
- [ ] Document accessibility features in README
- [ ] Add accessibility statement page

### Week 4
- [ ] Final accessibility audit
- [ ] Achieve Lighthouse 100 accessibility score
- [ ] Get external accessibility review (if budget allows)

---

## Resources Used

- **WCAG 2.1 Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **U.S. Web Design System (USWDS):** https://designsystem.digital.gov/
- **WebAIM:** https://webaim.org/
- **A11y Project Checklist:** https://www.a11yproject.com/checklist/
- **Deque axe DevTools:** https://www.deque.com/axe/devtools/

---

## Accessibility Statement (To Add to Site)

> **KC Food Security Hub is committed to ensuring digital accessibility for all users, including those with disabilities.**
>
> We are continuously improving the user experience for everyone and applying relevant accessibility standards. Our goal is to meet WCAG 2.1 Level AA conformance.
>
> **If you have difficulty accessing any content or notice any accessibility barriers, please contact us:**
> Email: [contact email]
> Phone: 211 (United Way helpline)
>
> We welcome feedback and will work to resolve issues within 5 business days.

---

*Last Updated: December 2025*
*Next Audit: January 2026*

# Screenshot Capture Guide for Presentation

This guide explains how to capture professional screenshots for your DBMS lab presentation using either Playwright or Cypress.

## Prerequisites

Your application should be running on `http://localhost:8080` before capturing screenshots.

## Option 1: Using Playwright (Recommended)

### Installation
```bash
npm install -D @playwright/test
npx playwright install
```

### Capture Screenshots
```bash
# Run all screenshot tests
npx playwright test tests/screenshot-capture.spec.ts

# Run with UI mode to see the process
npx playwright test tests/screenshot-capture.spec.ts --ui

# Run specific test
npx playwright test tests/screenshot-capture.spec.ts -g "Main Dashboard"
```

### Screenshots Location
Screenshots will be saved to: `presentation-screenshots/`

---

## Option 2: Using Cypress

### Installation
```bash
npm install -D cypress
npx cypress open
```

### Capture Screenshots
```bash
# Run all screenshot tests (headless)
npx cypress run --spec cypress/e2e/screenshot-capture.cy.ts

# Open Cypress UI
npx cypress open
# Then select the screenshot-capture.cy.ts test
```

### Screenshots Location
Screenshots will be saved to: `cypress/screenshots/screenshot-capture.cy.ts/`

---

## Screenshots Captured

The scripts will capture the following screenshots:

### 1. **01-main-dashboard.png**
- Full page view of the application
- Shows header, form, and student table together

### 2. **02-add-student-form.png**
- Close-up of the "Add New Student" form
- Shows all input fields clearly

### 3. **03-student-table.png**
- Student table with existing data
- Shows ID, Name, Email, Phone, Dept ID, Year, and Actions

### 4. **04-search-filtering.png**
- Search box with query "john" entered
- Shows filtered results in real-time

### 5. **05-edit-modal.png**
- Edit student modal dialog open
- Shows pre-filled form with existing student data

### 6. **06-sql-debugger-panel.png**
- SQL Debugger panel opened from the side
- Shows the panel interface

### 7. **07-sql-queries-logged.png**
- SQL Debugger with actual queries logged
- Shows SELECT queries with timestamps and duration

### 8. **08-filled-form.png**
- Add Student form completely filled out
- Ready to submit

### 9. **09-student-added-success.png**
- Success toast notification after adding student
- Shows updated table with new student

### 10. **10-header-navigation.png**
- Close-up of the header section
- Shows logo, title, and SQL Debugger button

### 11. **11-mobile-view.png**
- Mobile responsive view (375x667)
- Shows how the app adapts to smaller screens

### 12. **12-table-actions.png**
- Close-up of table row actions
- Shows Edit and Delete buttons

---

## Using Screenshots in Presentation

### PowerPoint/Google Slides
1. Insert → Picture → select screenshot
2. Resize to fit slide
3. Add borders or shadows for polish
4. Use "Picture Format" to adjust brightness/contrast if needed

### Recommended Slides with Screenshots

**Slide 9: Key Features Demo**
- Use `01-main-dashboard.png`

**Slide 10: SQL Debugger Panel**
- Use `06-sql-debugger-panel.png` and `07-sql-queries-logged.png`

**Slide 19: Live Demo**
- Create a step-by-step demo slide deck using:
  - `02-add-student-form.png`
  - `04-search-filtering.png`
  - `05-edit-modal.png`
  - `09-student-added-success.png`

**Architecture/UI Slides**
- Use `10-header-navigation.png` for header design
- Use `03-student-table.png` for data display
- Use `11-mobile-view.png` for responsive design

---

## Tips for Best Results

### 1. **Clean Data**
Before capturing:
- Clear browser cache
- Reset to default mock data
- Ensure no console errors

### 2. **Consistent Styling**
- Use the same theme (light/dark) throughout
- Keep zoom level at 100%
- Use consistent window size

### 3. **Image Editing**
After capture, you may want to:
- Crop to focus on specific features
- Add arrows or highlights (use PowerPoint/Keynote tools)
- Add captions or labels
- Blur any sensitive information

### 4. **High Resolution**
- Playwright captures at full resolution by default
- For presentation, 1920x1080 is ideal
- Convert to PNG for best quality

### 5. **Annotations**
Consider adding:
- Red circles around key features
- Arrows pointing to important elements
- Text boxes explaining functionality
- Numbered steps for workflows

---

## Troubleshooting

### Screenshots are blank
- Ensure the app is running at `http://localhost:8080`
- Check if the page loaded completely
- Increase wait times in the test scripts

### Modal not appearing
- Check if the Edit button selector is correct
- Increase wait timeout after click
- Verify modal is not already open

### Tests fail
- Verify all dependencies are installed
- Check if port 8080 is correct
- Clear browser cache
- Update selectors if UI changed

### SQL Debugger empty
- Perform actions that trigger queries first
- Increase wait time for queries to log
- Check if query logger is working in browser console

---

## Advanced: Custom Screenshots

### Capture specific element
```typescript
// Playwright
await page.locator('.custom-selector').screenshot({ 
  path: 'custom-screenshot.png' 
});

// Cypress
cy.get('.custom-selector').screenshot('custom-screenshot');
```

### Capture with device emulation
```typescript
// Playwright - iPhone 13
await page.emulate(devices['iPhone 13']);
await page.screenshot({ path: 'iphone-view.png' });
```

### Capture dark mode
```typescript
// Playwright
await page.emulateMedia({ colorScheme: 'dark' });
await page.screenshot({ path: 'dark-mode.png' });
```

---

## Quick Start Commands

```bash
# Install Playwright (recommended)
npm install -D @playwright/test
npx playwright install

# Run screenshot capture
npx playwright test tests/screenshot-capture.spec.ts

# Screenshots will be in: presentation-screenshots/
```

---

## Presentation Enhancement Checklist

- [ ] Captured all 12 screenshots
- [ ] Reviewed screenshots for quality
- [ ] Added screenshots to presentation slides
- [ ] Added annotations/highlights where needed
- [ ] Cropped and resized for optimal display
- [ ] Tested presentation flow with screenshots
- [ ] Created backup screenshots if needed
- [ ] Prepared live demo as fallback

---

**Note**: Screenshots are for educational/presentation purposes. Ensure you have permission to use them in your project submission.

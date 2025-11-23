// Playwright test script for capturing presentation screenshots
// Run with: npx playwright test tests/screenshot-capture.spec.ts
// Make sure to install: npm install -D @playwright/test

import { test, expect } from '@playwright/test';

test.describe('Student Management System - Screenshot Capture', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:8085');
    await page.waitForLoadState('networkidle');
  });

  test('01 - Main Dashboard View', async ({ page }) => {
    await page.screenshot({ 
      path: 'presentation-screenshots/01-main-dashboard.png',
      fullPage: true 
    });
  });

  test('02 - Add Student Form Focus', async ({ page }) => {
    // Scroll to the form
    await page.locator('text=Add New Student').scrollIntoViewIfNeeded();
    
    // Take screenshot of the form section
    await page.locator('text=Add New Student').screenshot({
      path: 'presentation-screenshots/02-add-student-form.png'
    });
  });

  test('03 - Student Table with Data', async ({ page }) => {
    // Focus on the student table
    await page.locator('text=Students').scrollIntoViewIfNeeded();
    
    await page.locator('text=Students').screenshot({
      path: 'presentation-screenshots/03-student-table.png'
    });
  });

  test('04 - Search Functionality', async ({ page }) => {
    const timestamp = new Date().getTime();
    // Add a student to search for
    await page.getByLabel('First Name *').fill('Search');
    await page.getByLabel('Last Name *').fill('Student');
    await page.getByLabel('Email *').fill(`search.student.${timestamp}@university.edu`);
    await page.locator('button:has-text("Add Student")').click();
    await page.waitForTimeout(500);

    // Click and type in search box
    const searchBox = page.getByPlaceholder('Search students...');
    await searchBox.click();
    await searchBox.fill('search');
    
    // Wait for filter results
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: 'presentation-screenshots/04-search-filtering.png',
      fullPage: true 
    });
  });

  test('05 - Edit Student Modal', async ({ page }) => {
    const timestamp = new Date().getTime();
    // Add a student to edit
    await page.getByLabel('First Name *').fill('Edit');
    await page.getByLabel('Last Name *').fill('Student');
    await page.getByLabel('Email *').fill(`edit.student.${timestamp}@university.edu`);
    await page.locator('button:has-text("Add Student")').click();
    await page.waitForTimeout(500);

    // Click the first edit button
    await page.locator('button[aria-label="Edit student"]').first().click();
    
    // Wait for modal to appear
    await page.waitForSelector('text=Edit Student');
    
    // Take screenshot
    await page.screenshot({ 
      path: 'presentation-screenshots/05-edit-modal.png',
      fullPage: true 
    });
  });

  test('06 - SQL Debugger Panel', async ({ page }) => {
    // Click SQL Debugger button
    await page.locator('text=SQL Debugger').click();
    
    // Wait for panel to slide in
    await page.waitForTimeout(500);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'presentation-screenshots/06-sql-debugger-panel.png',
      fullPage: true 
    });
  });

  test('07 - SQL Debugger with Queries', async ({ page }) => {
    const timestamp = new Date().getTime();
    // Add a student to generate queries
    await page.getByLabel('First Name *').fill('Query');
    await page.getByLabel('Last Name *').fill('Student');
    await page.getByLabel('Email *').fill(`query.student.${timestamp}@university.edu`);
    await page.locator('button:has-text("Add Student")').click();
    await page.waitForTimeout(300);
    
    // Open SQL Debugger
    await page.locator('text=SQL Debugger').click();
    await page.waitForTimeout(500);
    
    // Take screenshot showing logged queries
    await page.screenshot({ 
      path: 'presentation-screenshots/07-sql-queries-logged.png',
      fullPage: true 
    });
  });

  test('08 - Add Student Process', async ({ page }) => {
    const timestamp = new Date().getTime();
    // Fill in the form
    await page.getByLabel('First Name *').fill('Alice');
    await page.getByLabel('Last Name *').fill('Williams');
    await page.getByLabel('Email *').fill(`alice.williams.${timestamp}@university.edu`);
    await page.getByLabel('Phone').fill('555-0104');
    await page.getByLabel('Department ID').fill('3');
    await page.getByLabel('Enrollment Year').fill('2024');
    
    // Take screenshot before submitting
    await page.screenshot({ 
      path: 'presentation-screenshots/08-filled-form.png',
      fullPage: true 
    });
    
    // Submit the form
    await page.locator('button:has-text("Add Student")').click();
    
    // Wait for success toast
    await page.waitForTimeout(500);
    
    // Take screenshot with success message
    await page.screenshot({ 
      path: 'presentation-screenshots/09-student-added-success.png',
      fullPage: true 
    });
  });

  test('10 - Header Navigation', async ({ page }) => {
    // Focus on header
    await page.locator('header').screenshot({
      path: 'presentation-screenshots/10-header-navigation.png'
    });
  });

  test('11 - Mobile View', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.screenshot({ 
      path: 'presentation-screenshots/11-mobile-view.png',
      fullPage: true 
    });
  });

  test('12 - Table Actions', async ({ page }) => {
    // Hover over action buttons
    const firstRow = page.locator('tbody tr').first();
    await firstRow.locator('button[aria-label="Edit student"]').hover();
    
    await firstRow.screenshot({
      path: 'presentation-screenshots/12-table-actions.png'
    });
  });
});

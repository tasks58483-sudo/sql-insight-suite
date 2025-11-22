// Cypress test script for capturing presentation screenshots
// Run with: npx cypress run --spec cypress/e2e/screenshot-capture.cy.ts
// Make sure to install: npm install -D cypress

describe('Student Management System - Screenshot Capture', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
    cy.wait(1000); // Wait for app to load
  });

  it('01 - Main Dashboard View', () => {
    cy.screenshot('01-main-dashboard', { capture: 'fullPage' });
  });

  it('02 - Add Student Form Focus', () => {
    cy.contains('Add New Student').scrollIntoView();
    cy.contains('Add New Student').parent().screenshot('02-add-student-form');
  });

  it('03 - Student Table with Data', () => {
    cy.contains('Students').scrollIntoView();
    cy.contains('Students').parent().screenshot('03-student-table');
  });

  it('04 - Search Functionality', () => {
    cy.get('input[placeholder="Search students..."]').type('john');
    cy.wait(500);
    cy.screenshot('04-search-filtering', { capture: 'fullPage' });
  });

  it('05 - Edit Student Modal', () => {
    cy.get('button[aria-label="Edit student"]').first().click();
    cy.contains('Edit Student').should('be.visible');
    cy.wait(500);
    cy.screenshot('05-edit-modal', { capture: 'fullPage' });
  });

  it('06 - SQL Debugger Panel', () => {
    cy.contains('SQL Debugger').click();
    cy.wait(500);
    cy.screenshot('06-sql-debugger-panel', { capture: 'fullPage' });
  });

  it('07 - SQL Debugger with Queries', () => {
    cy.get('input[placeholder="Search students..."]').type('jane');
    cy.wait(300);
    cy.contains('SQL Debugger').click();
    cy.wait(500);
    cy.screenshot('07-sql-queries-logged', { capture: 'fullPage' });
  });

  it('08 - Add Student Process', () => {
    cy.get('input[name="firstName"]').type('Alice');
    cy.get('input[name="lastName"]').type('Williams');
    cy.get('input[name="email"]').type('alice.williams@university.edu');
    cy.get('input[name="phone"]').type('555-0104');
    cy.get('input[name="departmentId"]').type('3');
    cy.get('input[name="enrollmentYear"]').type('2024');
    
    cy.screenshot('08-filled-form', { capture: 'fullPage' });
    
    cy.contains('button', 'Add Student').click();
    cy.wait(500);
    cy.screenshot('09-student-added-success', { capture: 'fullPage' });
  });

  it('10 - Header Navigation', () => {
    cy.get('header').screenshot('10-header-navigation');
  });

  it('11 - Mobile View', () => {
    cy.viewport(375, 667);
    cy.screenshot('11-mobile-view', { capture: 'fullPage' });
  });

  it('12 - Table Actions', () => {
    cy.get('tbody tr').first().find('button[aria-label="Edit student"]').trigger('mouseover');
    cy.get('tbody tr').first().screenshot('12-table-actions');
  });
});

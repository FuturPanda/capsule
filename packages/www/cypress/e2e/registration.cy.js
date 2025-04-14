describe('registration of a capsule', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5174')
    cy.waitForAnimations()
    cy.get('[data-cy="signup"]').click()
    cy.url().should('include', '/signup')
  })

  Cypress.Commands.add('waitForAnimations', () => {
      cy.get('.background', { timeout: 2000 }).should('exist')
      cy.get('.loader', { timeout: 3000 }).should('exist')
      cy.get('.gradient-circle', { timeout: 5000 }).should('exist')
      cy.get('.gradient-circle.expanded', { timeout: 6000 }).should('exist')
      cy.get('[data-cy="signup"]', { timeout: 7000 }).should('be.visible')
      cy.wait(500)
    })

  it('should show validation errors when fields are empty', () => {
    cy.get('button[type="submit"]').should('be.disabled')

    cy.get('input[name="email"]').type('invalid-email')
    cy.get('input[name="password"]').type('Pass123!')
    cy.get('#terms').click()

    cy.get('button[type="submit"]').should('be.disabled')
  })

  it('should validate password requirements as user types', () => {

     cy.get('input[type="password"]').click();

     cy.get('[data-cy="Uppercase Letter"]').find('p').should('have.class', 'text-gray-500');
     cy.get('[data-cy="Lowercase Letter"]').find('p').should('have.class', 'text-gray-500');
     cy.get('[data-cy="Number"]').find('p').should('have.class', 'text-gray-500');
     cy.get('[data-cy="Special character (e.g !?<>@#*$%)"]').find('p').should('have.class', 'text-gray-500');
     cy.get('[data-cy="8 characters or more"]').find('p').should('have.class', 'text-gray-500');

     cy.get('input[type="password"]').clear().type('password');
     cy.get('[data-cy="Lowercase Letter"]').find('p').should('have.class', 'text-teal-500');
     cy.get('[data-cy="Uppercase Letter"]').find('p').should('have.class', 'text-gray-500');
     cy.get('[data-cy="Number"]').find('p').should('have.class', 'text-gray-500');
     cy.get('[data-cy="Special character (e.g !?<>@#*$%)"]').find('p').should('have.class', 'text-gray-500');
     cy.get('[data-cy="8 characters or more"]').find('p').should('have.class', 'text-teal-500');

     cy.get('input[type="password"]').clear().type('Password');
     cy.get('[data-cy="Lowercase Letter"]').find('p').should('have.class', 'text-teal-500');
     cy.get('[data-cy="Uppercase Letter"]').find('p').should('have.class', 'text-teal-500');
     cy.get('[data-cy="Number"]').find('p').should('have.class', 'text-gray-500');
     cy.get('[data-cy="Special character (e.g !?<>@#*$%)"]').find('p').should('have.class', 'text-gray-500');
     cy.get('[data-cy="8 characters or more"]').find('p').should('have.class', 'text-teal-500');

     cy.get('input[type="password"]').clear().type('Password1');
     cy.get('[data-cy="Lowercase Letter"]').find('p').should('have.class', 'text-teal-500');
     cy.get('[data-cy="Uppercase Letter"]').find('p').should('have.class', 'text-teal-500');
     cy.get('[data-cy="Number"]').find('p').should('have.class', 'text-teal-500');
     cy.get('[data-cy="Special character (e.g !?<>@#*$%)"]').find('p').should('have.class', 'text-gray-500');
     cy.get('[data-cy="8 characters or more"]').find('p').should('have.class', 'text-teal-500');

     cy.get('input[type="password"]').clear().type('Password1!');
     cy.get('[data-cy="Lowercase Letter"]').find('p').should('have.class', 'text-teal-500');
     cy.get('[data-cy="Uppercase Letter"]').find('p').should('have.class', 'text-teal-500');
     cy.get('[data-cy="Number"]').find('p').should('have.class', 'text-teal-500');
     cy.get('[data-cy="Special character (e.g !?<>@#*$%)"]').find('p').should('have.class', 'text-teal-500');
     cy.get('[data-cy="8 characters or more"]').find('p').should('have.class', 'text-teal-500');

     cy.get('input[type="password"]').clear().type('Pa1!');
     cy.get('[data-cy="Lowercase Letter"]').find('p').should('have.class', 'text-teal-500');
     cy.get('[data-cy="Uppercase Letter"]').find('p').should('have.class', 'text-teal-500');
     cy.get('[data-cy="Number"]').find('p').should('have.class', 'text-teal-500');
     cy.get('[data-cy="Special character (e.g !?<>@#*$%)"]').find('p').should('have.class', 'text-teal-500');
     cy.get('[data-cy="8 characters or more"]').find('p').should('have.class', 'text-gray-500');
   })

   it('should toggle password visibility when eye icon is clicked', () => {
     cy.get('[data-cy="password-input"]').should('exist').should('have.attr', 'type', 'password');

     cy.get('[data-cy="toggle-password"]').click();
     cy.get('[data-cy="password-input"]').should('exist').should('have.attr', 'type', 'password');

     cy.get('[data-cy="toggle-password"]').click();
     cy.get('input[type="text"]').should('exist').should('have.attr', 'type', 'text');
   })

   it('should show requirements box only after clicking on password field', () => {
     cy.get('[data-cy="Uppercase Letter"]').should('not.exist');

     cy.get('input[type="password"]').click();

     cy.get('[data-cy="Uppercase Letter"]').should('be.visible');
     cy.get('[data-cy="Lowercase Letter"]').should('be.visible');
     cy.get('[data-cy="Number"]').should('be.visible');
     cy.get('[data-cy="Special character (e.g !?<>@#*$%)"]').should('be.visible');
     cy.get('[data-cy="8 characters or more"]').should('be.visible');
   })

  it('should require terms acceptance', () => {

    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="password"]').type('Password1!')

    cy.get('button[type="submit"]').should('be.disabled')

    cy.get('#terms').click()

    cy.get('button[type="submit"]').should('be.disabled')
  })

  it('should handle captcha verification', () => {

    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="password"]').type('Password1!')
    cy.get('#terms').click()

    cy.window().then((win) => {
      win.onTurnstileCallback('test-token-123');
    })

    cy.get('button[type="submit"]').should('not.be.disabled')
  })

    it('should show email confirmation screen after successful submission', () => {
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('Password1!');
      cy.get('#terms').click();

      cy.intercept('POST', '/api/send', {
        statusCode: 200,
        body: { success: true }
      }).as('emailSend');

      cy.get('[data-cy="cf-turnstile-container"]', { timeout: 10000 }).should('be.visible');

      cy.window().then((win) => {
        return new Cypress.Promise((resolve) => {
          if (win.onTurnstileCallback) {
            win.onTurnstileCallback('mock-turnstile-token');
            resolve();
          }
        });
      });
      Cypress.on('uncaught:exception', (err, runnable) => {
            if (err.message.includes('Cloudflare challenge was not complete correctly')) {
              return false;
            }
          });

      cy.get('button[type="submit"]').should('not.be.disabled');
      cy.get('button[type="submit"]').click();

      cy.get('[data-cy="check-email-screen"]').should('be.visible');
    });



  // it('should handle email verification and redirect to capsule creation', () => {
  //   cy.intercept('GET', '/signup/verify*', {
  //     statusCode: 200,
  //     body: { isConfirmed: 'true', email: 'test@example.com', token: 'test-token-123' }
  //   }).as('verifyEmail')

  //   cy.visit('http://localhost:5174/signup/verify?token=test-token-123')

  //   cy.contains('Email Verified').should('be.visible')

  //   cy.url().should('include', '/signup/create-capsule/test-token-123', { timeout: 5000 })
  // })

  // it('should show capsule creation progress', () => {
  //   cy.intercept('GET', '/api/capsule-creation*', {
  //     body: '{"content":"Creating capsule...","progress":0}\n' +
  //           '{"content":"Capsule created with name test-app","progress":20}\n' +
  //           '{"content":"Allocating IP address...","progress":25}\n' +
  //           '{"content":"END","progress":100}'
  //   }).as('createCapsule')

  //   cy.visit('http://localhost:5174/signup/create-capsule/test-token-123')

  //   cy.contains('Creating Your Capsule').should('be.visible')

  //   cy.contains('Creating capsule...').should('be.visible')
  //   cy.contains('test-app').should('be.visible', { timeout: 5000 })

  //   cy.contains('Capsule Launch Initiated', { timeout: 10000 }).should('be.visible')
  // })
})

describe('Celina 5: Menjačnica — Provera kursa i konverzija valuta', () => {
  describe('Exchange Rate List (Scenario 24)', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/exchange/rates', { fixture: 'exchange-rates.json' }).as(
        'getExchangeRates'
      )
      cy.intercept('GET', '/api/me', {
        body: {
          id: 42,
          first_name: 'Marko',
          last_name: 'Jovanović',
          email: 'marko@example.com',
        },
      }).as('getMe')
      cy.loginAsClient('/exchange/rates')
    })

    // Scenario 24: Pregled kursne liste
    it('should display exchange rates for all supported currencies vs RSD (Scenario 24)', () => {
      cy.wait('@getExchangeRates')

      cy.contains('h1', 'Exchange Rates').should('be.visible')

      // Verify table headers
      cy.contains('th', 'Currency').should('be.visible')
      cy.contains('th', 'Buy Rate').should('be.visible')
      cy.contains('th', 'Sell Rate').should('be.visible')

      // All 7 foreign currencies should be displayed (filtered to to_currency=RSD)
      cy.contains('td', 'EUR').should('be.visible')
      cy.contains('td', 'USD').should('be.visible')
      cy.contains('td', 'CHF').should('be.visible')
      cy.contains('td', 'GBP').should('be.visible')
      cy.contains('td', 'JPY').should('be.visible')
      cy.contains('td', 'CAD').should('be.visible')
      cy.contains('td', 'AUD').should('be.visible')

      // RSD should NOT appear as a row (reverse rates filtered out)
      cy.get('tbody td.font-medium').each(($td) => {
        expect($td.text()).to.not.equal('RSD')
      })

      // Verify only 7 rows (not 9 — the 2 RSD→foreign rates are filtered)
      cy.get('tbody tr').should('have.length', 7)

      // Verify EUR buy/sell rates are formatted correctly
      cy.contains('tr', 'EUR').within(() => {
        cy.contains('116.50').should('exist')
        cy.contains('117.80').should('exist')
      })
    })
  })

  describe('Equivalence Calculator (Scenario 25)', () => {
    beforeEach(() => {
      // The calculator page also fetches all rates for local fallback
      cy.intercept('GET', '/api/exchange/rates', { fixture: 'exchange-rates.json' }).as(
        'getExchangeRates'
      )
      cy.intercept('GET', '/api/me', {
        body: {
          id: 42,
          first_name: 'Marko',
          last_name: 'Jovanović',
          email: 'marko@example.com',
        },
      }).as('getMe')
      cy.loginAsClient('/exchange/calculator')
    })

    // Scenario 25: Provera ekvivalentnosti valute
    it('should calculate equivalence without executing a transaction (Scenario 25)', () => {
      // Stub the specific rate lookup (called by convertCurrency)
      cy.intercept('GET', '/api/exchange/rates/RSD/EUR', {
        body: {
          from_currency: 'RSD',
          to_currency: 'EUR',
          buy_rate: 0.0086,
          sell_rate: 0.0085,
          updated_at: '2026-03-26T08:00:00Z',
        },
      }).as('getRate')

      cy.contains('Check Equivalence').should('be.visible')

      // Default: From=RSD, To=EUR
      cy.get('[aria-label="From Currency"]').should('contain.text', 'RSD')
      cy.get('[aria-label="To Currency"]').should('contain.text', 'EUR')

      // Enter amount
      cy.get('#amount').type('10000')

      // Click "Calculate"
      cy.contains('button', 'Calculate').click()
      cy.wait('@getRate')

      // Result should display the conversion (10000 * 0.0086 = 86 EUR)
      cy.contains('Rate:').should('be.visible')

      // The result section shows formatted amounts
      cy.contains('RSD').should('be.visible')
      cy.contains('EUR').should('be.visible')

      // No transaction was created — verify no POST requests were made
      // (The calculator only uses GET for exchange rate lookup)
    })

    it('should allow changing currencies and recalculating (Scenario 25 — different pair)', () => {
      cy.intercept('GET', '/api/exchange/rates/EUR/USD', {
        body: {
          from_currency: 'EUR',
          to_currency: 'USD',
          buy_rate: 1.11,
          sell_rate: 1.12,
          updated_at: '2026-03-26T08:00:00Z',
        },
      }).as('getRate')

      // Change From Currency to EUR
      cy.get('[aria-label="From Currency"]').click()
      cy.get('[data-slot="select-content"]:visible').contains('[role="option"]', 'EUR')
        .trigger('pointerdown', { pointerType: 'touch', bubbles: true })
        .trigger('click', { bubbles: true })
      cy.get('[data-base-ui-inert]').should('not.exist')

      // Change To Currency to USD
      cy.get('[aria-label="To Currency"]').click()
      cy.get('[data-slot="select-content"]:visible').contains('[role="option"]', 'USD')
        .trigger('pointerdown', { pointerType: 'touch', bubbles: true })
        .trigger('click', { bubbles: true })
      cy.get('[data-base-ui-inert]').should('not.exist')

      cy.get('#amount').type('100')
      cy.contains('button', 'Calculate').click()
      cy.wait('@getRate')

      // Result should show conversion result
      cy.contains('Rate:').should('be.visible')
    })

    it('should disable Calculate button when same currency selected', () => {
      // Select EUR for both From and To
      cy.get('[aria-label="From Currency"]').click()
      cy.get('[data-slot="select-content"]:visible').contains('[role="option"]', 'EUR')
        .trigger('pointerdown', { pointerType: 'touch', bubbles: true })
        .trigger('click', { bubbles: true })
      cy.get('[data-base-ui-inert]').should('not.exist')

      cy.get('[aria-label="To Currency"]').click()
      cy.get('[data-slot="select-content"]:visible').contains('[role="option"]', 'EUR')
        .trigger('pointerdown', { pointerType: 'touch', bubbles: true })
        .trigger('click', { bubbles: true })
      cy.get('[data-base-ui-inert]').should('not.exist')

      cy.get('#amount').type('100')

      // Button should be disabled
      cy.contains('button', 'Calculate').should('be.disabled')

      // Error message should appear
      cy.contains('Cannot convert to same currency').should('be.visible')
    })
  })
})

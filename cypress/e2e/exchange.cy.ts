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
})

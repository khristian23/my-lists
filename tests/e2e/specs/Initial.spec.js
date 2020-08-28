describe('Initial structure', () => {
  it('renders header, main and footer sections', () => {
    cy.visit('/')
    cy.get('header.page-header').should('be.visible')
    cy.get('footer.page-footer').should('be.visible')
    cy.get('section.page-content').should('be.visible')
  })
})

describe('Initial state', () => {
  it('starts with zero items', () => {
    cy.visit('/')
    cy.get('.lists').find('.li-custom').should('have.length', 0)
  })
})

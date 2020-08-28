import List from '@/storage/List'
import storage from '@/storage/storage'

describe('Lists Maintain', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('should show main title', () => {
        cy.get('header').contains('.title', 'My Lists')
    })

    it('should show anonymous user', () => {
        cy.get('header').find('ui5-avatar[icon=employee]').should('be.visible')
    })

    it('should show create button in toolbar', () => {
        cy.get('footer').within(() => {
            cy.get('ui5-button[icon=add]').contains('Create')
        })
    })

    describe('Create new List', () => {
        it('saves a new List', () => {
            cy.get('ui5-button[icon=add]').click()
            cy.url().should('include', 'list/new')
            cy.get('.page-content').within(($form) => {
                cy.get('.name').shadow().find('input').type('My test list name')
                cy.get('.description').shadow().find('input').type('My test list description')
            })
            cy.get('ui5-button[icon=save]').click()

            const listsViewUrlSuffix = '/#/'
            cy.url().should('eq', Cypress.config().baseUrl + listsViewUrlSuffix)
        })
    })
})

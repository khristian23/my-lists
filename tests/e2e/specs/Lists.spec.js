import List from '@/storage/List'
import storage from '@/storage/storage'

describe('Lists Maintain', () => {
    before(() => {
        cy.clearLocalStorageCache();
        cy.visit('/')
    })

    beforeEach(() => {
        cy.restoreLocalStorageCache();
    });
    
    afterEach(() => {
        cy.saveLocalStorageCache();
    });

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
        it('should navigate to create List view', () => {
            cy.get('ui5-button[icon=add]').click()
            cy.url().should('include', 'list/new')
        })

        it('should fill out and navigate to lists view on save', () => {
            cy.get('.page-content').within(($form) => {
                cy.get('.name').shadow().find('input').type('My test list name')
                cy.get('.description').shadow().find('input').type('My test list description')
            })
            cy.get('ui5-button[icon=save]').click()
            const listsViewUrlSuffix = '/#/'
            cy.url().should('eq', Cypress.config().baseUrl + listsViewUrlSuffix)
        })

        it('should see one list', () => {
            cy.get('.lists').find('.li-custom').should('have.length', 1)
        })
    })

    describe('Edit existent list', () => {
        it('should navigate to edit list view', () => {
            cy.get('ui5-button[icon=edit]').click()
            cy.url().should('match', /list\/\d+$/)
        })

        it('should navigate back to the lists view', () => {
            cy.get('ui5-button[icon=nav-back]').click()

            const listsViewUrlSuffix = '/#/'
            cy.url().should('eq', Cypress.config().baseUrl + listsViewUrlSuffix)

            cy.get('.lists').find('.li-custom').should('have.length', 1)
        })

        it ('should edit list name', () => {
            cy.get('ui5-button[icon=edit]').first().click()
            cy.get('.page-content').within(($form) => {
                cy.get('.name').shadow().find('input').type('New list name')
            })

            cy.get('ui5-button[icon=save]').click()
            cy.get('.li-custom').first().find('.li-title').contains('New list name')
        })
    })
})

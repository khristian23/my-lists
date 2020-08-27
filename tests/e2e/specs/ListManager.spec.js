import List from '@/storage/List'
import storage from '@/storage/storage'

describe('List Manager', () => {
    beforeEach(function () {
        cy.fixture('lists.json').as('listsJSON')
        console.log(this)
        cy.get('@listsJSON').then(data => {
            cy.log(data)
            cy.stub(storage, 'getLists').returns(data.map(list => new List(list)))
            cy.visit('/')
        })
    })

    it('should show main title', () => {
        cy.get('header').contains('.title', 'My Lists')
    })

    it('should show anonymous user', () => {
        cy.get('header').get('ui5-avatar[icon=employee]')
    })

    it('should show create button in toolbar', () => {
        cy.get('footer').within(() => {
            cy.get('ui5-button[icon=add]').contains('Create')
        })
    })

    it('should render mocked list', () => {
        
    })
})
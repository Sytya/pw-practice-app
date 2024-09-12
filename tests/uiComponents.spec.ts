import {test, expect} from '@playwright/test'
import { UnsubscriptionError } from 'rxjs'

test.beforeEach( async ({page}) => {
    await page.goto('http://localhost:4200/')
})

test.describe ('test suiite 1', () => {
    test.beforeEach(async ({page}) => {
        await page.getByText ('Forms'). click()
        await page.getByText ('Form Layouts').click()
    })

    test('input fields', async ({page}) => {
        const usingTheGridEmailInput = page.locator ('nb-card', {hasText: "Using the Grid"}).getByRole ('textbox', {name: "Email"})

        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test2@test.com', {delay:500}) //simulation of the keyboard with delay:500 between letters

        //generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@test.com')
        
        //locator assertion 
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')
    })

    test('radio buttons', async ({page}) => {
        const usingTheGridRadioButton = page.locator ('nb-card', {hasText: "Using the Grid"}).getByRole ('textbox', {name: "Email"})
        const radioButton = page
    })

})


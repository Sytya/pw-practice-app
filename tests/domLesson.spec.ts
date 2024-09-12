import { Testability } from '@angular/core';
import {test, expect} from '@playwright/test'


// test.beforeEach(async ({page}) => {
//     await page.goto('http://localhost:4200/')
//     await page.getByText ('Forms'). click()
//     await page.getByText ('Form Layouts').click()
// })

test('Locator syntax rule', async ({page}) => {
    //by tag name
    await page.locator ('input').first().click();

    //by ID
   // await page.locator ('#inputEmail').click()

    //by class id
    page.locator ('.shape-rectangle')

    //by attribute
    page.locator ('[placeholder="Email"]')

    //by Class value
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    //by combine different attributes
    page.locator ('input[placeholder="Email"]')

    //by XPath
    page.locator('//*[@id="inputEmail"]')

    //by partial text match
    page.locator(':text("Using")')

    //by exact text match
    page.locator(':text("Using the Grid")')

})


test('Using user facing locators', async ({page}) => {
//by role
await page.getByRole('textbox', {name: "Email"}).first().click()
await page.getByRole('button', {name: "Sign in"}).first().click()
//by label
await page.getByLabel('Email').first().click()
//by placeholder
await page. getByPlaceholder('Jane Doe').click()
//by text
await page.getByText('Using the Grid').click()
//by methods (not using user facing)
await page.getByTestId('SignIn').click()
//by title
await page.getByTitle('IoT Dashboard').click()
})


test('Using child elements', async ({page}) => {
//separationg locator by "space" in your string locator    
await page.locator('nb-card nb-radio :text-is("Option 1")').click()
//in chain one by one 
await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()
//combination of Playwright locator and user-facing locator
await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()
//list preferable approach(try to awoid this approach) because there is can be changes in the ordering of the elements
await page.locator('nb-card').nth(3).getByRole('button').click()
})    

test('Using parent elents', async ({page}) => {
await page.locator('nb-card', {hasText: "Using the Grid"}/*Filtering by text of the patert*/).getByRole('textbox', {name: "Email"}).click()
await page.locator('nb-card',{has: page.locator('#inputEmail1')}/*Filtering by locator of the patert*/).getByRole('textbox', {name: "Email"}).click()

//filter() - using only with locator() NOT with getByRole()
await page.locator('nb-card').filter({hasText: "Basic form"}/*Filtering by using filter() with text*/).getByRole('textbox', {name: "Email"}).click()
await page.locator('nb-card').filter({has: page.locator('.status-danger')}/*Filtering by using filter() with locator of the patert*/).getByRole('textbox', {name: "Password"}).click()
await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign In"}).getByRole('textbox', {name: "Email"}).click()
//If we need go up in the DOM we need to use XPath
await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click()
})

test('Reusing the locators', async ({page}) => {
    //normal const    
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    //reusing const
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    const passwordField = basicForm.getByRole('textbox', { name: "Password" })

    await emailField.fill('test@test.com')
    await passwordField.fill('Password123')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click()
    
    await expect(emailField).toHaveValue('test@test.com')
})

test('Extracting the values', async ({page}) => {
    //how to get a single text value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonText = await basicForm.locator('button').textContent()
    await expect(buttonText).toEqual('Submit')

    //all text buttom 
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonsLabels).toContain('Option 1') //if you need to find in the object one of the value use this

    //Input Values
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()//use this method
    expect(emailValue).toEqual('test@test.com')

    //Get value of the attribute
    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')


})

test('Assertions', async ({page}) => {
    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')

    //General assertions
    const value = 5
    expect(value).toEqual(5)

    const text = await basicFormButton.textContent()
    expect(text).toEqual("Submit")

    //Locator assertions
    await expect(basicFormButton).toHaveText('Submit')

    //Soft assertions
    await expect.soft(basicFormButton).toHaveText('Submit5')
    await basicFormButton.click()
})


test.beforeEach(async ({page}, tesInfo) => {//timeout for suite
    await page.goto('http://www.uitestingplayground.com/ajax')
    await page.getByText("Button Triggering AJAX Request").click()
    tesInfo.setTimeout(tesInfo.timeout + 2000)//timeout for suite
})

test('Auto waiting', async ({page}) => {
    const successButton = page.locator('.bg-success')
    await successButton.click()

    // const text = await successButton.textContent()
    // await successButton.waitFor({state: "attached"})
    // const text = await successButton.allTextContents()

   // expect(text).toContain("Data loaded with AJAX get request.")

    await expect(successButton).toHaveText("Data loaded with AJAX get request.", {timeout: 20000}) //toHaveText() - have timeout 5000 so we are overwriting it with 20000
})

test('Alternative waits', async ({page}) => {
    const successButton = page.locator('.bg-success')
    
    //wait for element
    //await page.waitForSelector('.bg-success')

    //wait for particular response from API (Using tetwork tab)
    //await page.waitForResponse('http://www.uitestingplayground.com/ajaxdata')

    //waiting for networkcalls to be completed (NOT RECOMENDED)
    await page.waitForLoadState('networkidle')


    const text = await successButton.allTextContents()
    expect(text).toContain("Data loaded with AJAX get request.")

})

test.only('Timeouts', async ({page}) => {
    test.setTimeout(10000)//timeout for test
    test.slow()
    const successButton = page.locator('.bg-success')
    await successButton.click({timeout: 16000})//timeout for command
})

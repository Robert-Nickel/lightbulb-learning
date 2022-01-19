describe('Login', () => {
    beforeEach(() => {
        cy.visit("https://lightbulb-learning.io")
    })

    it('logs in via GitHub', () => {
        cy.clearCookies()

        const password = Cypress.env('password')
        return cy.task('GitHubSocialLogin', {
            username: "testing-lightbulb-learning-on-prod",
            password: password,
            loginUrl: "https://lightbulb-learning.io/oauth",
            logs: false,
            getAllBrowserCookies: true,
            loginSelector: ".container > button",
            headless: false,
            postLoginSelector: "#oauth-title"
        }).then(({ cookies, lsd, ssd }) => {
            cy.log(cookies)

            cookies.forEach(cookie => {
                if (cookie) {
                    cy.setCookie(cookie.name, cookie.value, {
                        domain: cookie.domain,
                        expiry: cookie.expires,
                        httpOnly: cookie.httpOnly,
                        path: cookie.path,
                        secure: cookie.secure
                    })

                    Cypress.Cookies.defaults({
                        preserve: cookie.name
                    })
                }
            })

            // ssd contains session storage data (window.sessionStorage)
            // lsd contains local storage data (window.localStorage)
            cy.window().then(window => {
                Object.keys(ssd).forEach(key => window.sessionStorage.setItem(key, ssd[key]))
                Object.keys(lsd).forEach(key => window.localStorage.setItem(key, lsd[key]))
            })
        })
    })
    // it('does something very smart', () => {
    //     cy.get('.container > button').click()
    //     cy.get('#login_field').type("testing-lightbulb-learning-on-prod")
    //     cy.get('#password').type("6ReyXnnSMABG6PYGCutaYfK9zNBca5Vt")
    //     cy.get('.btn').click()
    // })
})



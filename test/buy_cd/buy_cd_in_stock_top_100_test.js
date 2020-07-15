const assert = require('assert');
const buy = require('../../buy_cd');

describe("Buy CD - In Stock", () => {

    const text = `
    GIVEN\ta CD that's not in the Top 100 and we have it in stock, and the customer's card payment will be accepted\t
    WHEN\tThe customer buys that CD\t
    THEN\tOne copy is deducted from CD's stock\t
    AND\tThe customer's card is charged our price for that CD\t
    AND\tThe charts are notified of the sale\t
    `;

    const examples = [
        {
            inputs: {
                cdTitle: "So",
                cdArtist: "Peter Gabriel",
                chartPosition: 100,
                stock: 10,
                ourPrice: 9.99,
                ccNumber: "1234234534564567",
                ccExpires: "10/21",
                ccSecurityCode: "817",
                paymentAccepted: true,
                lowestCompetitorPrice: 7.99
            },
            outputs: {
                endStock: 9,
                charged: 7.99,
                chartNotification: "sales: 1, album: Peter Gabriel - So"
            }
        },
        {
            inputs: {
                cdTitle: "Lionheart",
                cdArtist: "Kate Bush",
                chartPosition: 87,
                stock: 5,
                ourPrice: 8.99,
                ccNumber: "1234234534564567",
                ccExpires: "10/21",
                ccSecurityCode: "817",
                paymentAccepted: true,
                lowestCompetitorPrice: 8.99
            },
            outputs: {
                endStock: 4,
                charged: 8.99,
                chartNotification: "sales: 1, album: Kate Bush - Lionheart"
            }
        }
    ];

    examples.forEach(function ({inputs, outputs}) {
        // mock param values
        let chartsParams = [];
        let chargeParams = [];

        // Given

        let cd = {artist: inputs.cdArtist, title: inputs.cdTitle, price: inputs.ourPrice, stock: inputs.stock};
        const creditCard = {number: inputs.ccNumber, expires: inputs.ccExpires, securityCode: inputs.ccSecurityCode};
        const charge = function(creditCard, amount) {
            chargeParams = arguments;
            return inputs.paymentAccepted;
        };
        const charts = {
            notify: function() { chartsParams = arguments },
            position: function() { return inputs.chartPosition }
        };

        const intel = function(){ return inputs.lowestCompetitorPrice };

        // When

        cd = buy(cd, creditCard, charge, charts, intel);

        // Then

        it("The customer's card is charged £1 less than the lowest price from competitors found for that CD", () => {
            assert.deepEqual(chargeParams[0], creditCard);
            assert.equal(chargeParams[1], outputs.charged);
        });

    });
});

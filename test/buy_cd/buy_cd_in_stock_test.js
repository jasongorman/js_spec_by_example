const assert = require('assert');
const buy = require('../../buy_cd');

describe("Buy CD - In Stock, Top 100", () => {

    const examples = [
        {
            inputs: {
                cdTitle: "So",
                cdArtist: "Peter Gabriel",
                chartPosition: 101,
                stock: 10,
                ourPrice: 9.99,
                ccNumber: "1234234534564567",
                ccExpires: "10/21",
                ccSecurityCode: "817",
                paymentAccepted: true
            },
            outputs: {
                endStock: 9,
                charged: 9.99,
                chartNotification: "sales: 1, album: Peter Gabriel - So"
            }
        },
        {
            inputs: {
                cdTitle: "Lionheart",
                cdArtist: "Kate Bush",
                chartPosition: 279,
                stock: 5,
                ourPrice: 8.99,
                ccNumber: "1234234534564567",
                ccExpires: "10/21",
                ccSecurityCode: "817",
                paymentAccepted: true
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

        let cd = {artist: inputs.cdArtist, title: inputs.cdTitle, price: inputs.ourPrice, stock: inputs.stock};
        const creditCard = {
            number: inputs.ccNumber,
            expires: inputs.ccExpires,
            securityCode: inputs.ccSecurityCode
        };
        const charge = function (creditCard, amount) {
            chargeParams = arguments;
            return inputs.paymentAccepted;
        };
        const charts = {
            notify: function () {
                chartsParams = arguments
            },
            position: function () {
                return inputs.chartPosition
            }
        };

        cd = buy(cd, creditCard, charge, charts, null);

        it("One copy is deducted from CD's stock", () => {
            assert.equal(cd.stock, outputs.endStock)
        });

        it("The customer's card is charged our price for that CD", () => {
            assert.deepEqual(chargeParams[0], creditCard);
            assert.equal(chargeParams[1], outputs.charged);
        });

        it("The charts are notified of the sale", () => {
            assert.equal(chartsParams[0], outputs.chartNotification);
        });
    });
});

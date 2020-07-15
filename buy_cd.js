function buy(cd, creditCard, charge, charts, intel) {
    const chartPosition = charts.position(cd.artist, cd.title);
    let price = cd.price;

    if(chartPosition <= 100)
        price = intel(cd.artist, cd.title);

    charge(creditCard, price);

    charts.notify("sales: 1, album: " + cd.artist + " - " + cd.title);
    return {stock: cd.stock - 1};
}

module.exports = buy;
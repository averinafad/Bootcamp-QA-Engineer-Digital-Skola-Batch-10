const{Builder, By, until} = require('selenium-webdriver');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome');
// const firefox = require('selenium-webdriver/firefox');

describe('Sauce Demo Test',function(){
    let driver;

    //Test Hook/Annotation 1 for Visit SauceDemo
    before(async function () {
        console.log(`Ini mulai buka web saucedemo:)`)
        //kalau pakai chrome
        options = new chrome.Options();
        options.addArguments("--headless");
        // driver = await new Builder(). forBrowser('chrome').build();
        driver = await new Builder(). forBrowser('chrome').setChromeOptions(options).build();

        // //kalau pakai firefox
        // options = new firefox.Options();
        // options.addArguments("--headless");
        // // driver = await new Builder(). forBrowser('firefox').build();
        // driver = await new Builder(). forBrowser('firefox').setFirefoxOptions(options).build();

        await driver.get('https://www.saucedemo.com');
    });

    //Test Hook/Annotation 2
    after(async function () {
        console.log(`Ini udah beres ya jalanin testnya:)`)
        await driver.sleep(5000);
        await driver.quit();
    });
    
    it('Validasi Berhasil Visit SauceDemo & Validasi Berhasil Login',async function(){     
        //Validasi Tittle
        const title = await driver.getTitle();
        assert.strictEqual(title, 'Swag Labs');

        //Inputs untuk Login
        let inputUsername = await driver.findElement(By.css('[data-test="username"]'));
        let inputPassword = await driver.findElement(By.xpath('//*[@data-test="password"]'));
        let buttonlogin = await driver.findElement(By.className('submit-button btn_action'));
        await inputUsername.sendKeys('standard_user');
        await inputPassword.sendKeys('secret_sauce');
        await buttonlogin.click();

        //Validasi Berhasil Login
        let buttonCart = await driver.wait(
            until.elementLocated(By.xpath('//*[@data-test="shopping-cart-link"]')),
            5000 
        );
        await buttonCart.isDisplayed();

        //Validasi Teks Logo
        let textAppLogo = await driver.findElement(By.className('app_logo'))
        let logotext = await textAppLogo.getText()
        assert.strictEqual(logotext,'Swag Labs')

        // await driver.sleep(3000);
        // await driver.quit();
    })

    it('Sorting Z to A',async function(){
        // Pilih dropdown dan pilih "Name (Z to A)"
        const sortDropdown = await driver.findElement(By.className('product_sort_container'));
        // await sortDropdown.sendKeys('Name (Z to A)');
        await sortDropdown.findElement(By.css('option[value="za"]')).click();


        // Tunggu hasil sorting tampil
        await driver.sleep(3000);

        // Ambil semua nama produk
        const productElements = await driver.findElements(By.className('inventory_item_name'));
        const productNames = [];
        for (let el of productElements) {
            const name = await el.getText();
            productNames.push(name);
        }

        // Bandingkan urutan Z to A
        const expectedSorted = [...productNames].sort().reverse();
        assert.deepStrictEqual(productNames, expectedSorted, 'Produk tidak terurut Z ke A');
        
        
        await driver.sleep(5000);
        // await driver.quit();
    })

    it('Sorting Harga dari Rendah ke Tinggi', async function () {
        // Pilih dropdown dan pilih "Price (low to high)"
        const sortDropdown = await driver.findElement(By.className('product_sort_container'));
        // await sortDropdown.sendKeys('Price (low to high)');
        await sortDropdown.findElement(By.css('option[value="lohi"]')).click();

        
        // Tunggu hasil sorting tampil
        await driver.sleep(1000);

        // Ambil semua elemen harga produk
        const priceElements = await driver.findElements(By.className('inventory_item_price'));
        const priceValues = [];
        for (let el of priceElements) {
            const text = await el.getText(); // Contoh: "$7.99"
            const price = parseFloat(text.replace('$', '')); //melakukan konversi ke number
            priceValues.push(price);
        }

        // Bandingkan apakah sudah terurut dari rendah ke tinggi
        const expectedSortedPrices = [...priceValues].sort((a, b) => a - b);
        assert.deepStrictEqual(priceValues, expectedSortedPrices, 'Harga tidak terurut dari rendah ke tinggi');

        // await driver.sleep(5000);
        // await driver.quit();
    });
})
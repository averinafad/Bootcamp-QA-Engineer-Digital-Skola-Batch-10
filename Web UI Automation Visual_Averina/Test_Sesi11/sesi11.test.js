import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';
import chrome from 'selenium-webdriver/chrome.js';
// const firefox = require('selenium-webdriver/firefox');
import PageLogin from '../Pages/page_login.js'
import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

describe('Sauce Demo Test', function () {
    let driver;

    //Test Hook/Annotation 1 for Visit SauceDemo
    before(async function () {
        console.log(`Ini mulai buka web saucedemo:)`)
        //kalau pakai chrome
        let options = new chrome.Options();
        // options.addArguments("--headless");
       driver = await new Builder(). forBrowser('chrome').build();
        // driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

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
        if (driver){
            await driver.sleep(5000);
            await driver.quit();
        }
    });

    it('Cek Visual Login Page', async function () {
        //Validasi Tittle
        const title = await driver.getTitle();
        assert.strictEqual(title, 'Swag Labs');

        //full screenshoot keadaan login page sekarang, current.png
        let screenshot = await driver.takeScreenshot();
        let imgBuffer = Buffer.from(screenshot, "base64");
        fs.writeFileSync("current.png",imgBuffer);

        //ambil baseline untuk komparasinya
        //jika belum ada baseline, jadikan current.png sebagai baseline
        if (!fs.existsSync("baseline.png")) {
            fs.copyFileSync("current.png", "baseline.png");
            console.log("Baseline image saved.");
        }

        //compare baseline.png dan current.png apakah sama
        let img1 = PNG.sync.read(fs.readFileSync("baseline.png"));
        let img2 = PNG.sync.read(fs.readFileSync("current.png"));
        let { width, height } = img1;
        let diff = new PNG({ width, height });
        let numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1});
        fs.writeFileSync("diff.png", PNG.sync.write(diff));

        if (numDiffPixels > 0) {
            console.log(`Visual differences found! Pixels different: ${numDiffPixels}`);
        } else {
            console.log("No visual differences found.");
        }
    })

    it('Validasi Berhasil Visit SauceDemo & Validasi Berhasil Login', async function () {
        //Validasi Tittle
        const title = await driver.getTitle();
        assert.strictEqual(title, 'Swag Labs');

        //Inputs untuk Login
        let inputUsername = await driver.findElement(PageLogin.inputUsername);
        let inputPassword = await driver.findElement(PageLogin.inputPassword);
        let buttonlogin = await driver.findElement(PageLogin.buttonlogin);

        // Partial screenshot sebelum halaman berubah
        await driver.executeScript("arguments[0].scrollIntoView(true);", inputUsername);
        await driver.sleep(500);
        let ss_inputusername = await inputUsername.takeScreenshot();
        fs.writeFileSync("inputusername.png", Buffer.from(ss_inputusername, "base64"));

        //Logic Test
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
        assert.strictEqual(logotext, 'Swag Labs')

        //full screenshoot after berhasil login
        let ss_full = await driver.takeScreenshot();
        fs.writeFileSync("full_screenshot_menu_utama.png", Buffer.from(ss_full, "base64"));

        // await driver.sleep(3000);
        // await driver.quit();
    })

    it('Validasi Gagal Login Karena Salah Password', async function () {
        //Inputs untuk Login
        let inputUsername = await driver.findElement(PageLogin.inputUsername);
        let inputPassword = await driver.findElement(PageLogin.inputPassword);
        let buttonlogin = await driver.findElement(PageLogin.buttonlogin);

        //Logic Test
        await inputUsername.sendKeys('standard_user');
        await inputPassword.sendKeys('secretsauce');
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
        assert.strictEqual(logotext, 'Swag Labs')

        // await driver.sleep(3000);
        // await driver.quit();
    })

    it('Sorting Z to A', async function () {
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
        
        // let priceElements = await driver.findelements(By.className('inventory_item_price'));
        // for (let element of priceElements){
        //     let priceText = await element.getText()
        //     let price parseFLoat(priceText.replace('$',''));
        //     priceValues.push(price);
        }
        let lowestPrice = Math.min(...prices);
        if (lowestPrice === 7.99){
            console.log('Pass : Harga Terendah benar 7.99');
        }else{
            console.log('FAiled')
        }


        }
        // await driver.sleep(5000);
        // await driver.quit();
    });
})
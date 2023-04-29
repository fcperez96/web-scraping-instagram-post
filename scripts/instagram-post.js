const puppeteer = require('puppeteer');
const XLSX = require('xlsx');

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://www.instagram.com/p/CrgzChMOMfF/');
    
    await page.waitForSelector('a[href="/p/CrgzChMOMfF/liked_by/"] > span > span');
    const likes = await page.$eval(
        'a[href="/p/CrgzChMOMfF/liked_by/"] > span > span',
        (element) => element.innerText
    );

    await page.waitForSelector('time[class="_aaqe"]');
    const date = await page.$eval(
        'time[class="_aaqe"]',
        (element) => element.getAttribute('datetime')
    );

    await page.waitForSelector('h1[class="_aacl _aaco _aacu _aacx _aad7 _aade"]');
    const postDescription = await page.$eval(
        'h1[class="_aacl _aaco _aacu _aacx _aad7 _aade"]',
        (element) => element.innerText
    );

    const data = [
        ['Likes', 'Date', 'Post description'],
        [likes, date, postDescription]
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, 'data.xlsx');

    console.log('Data saved to data.xlsx');

    await browser.close();
})();
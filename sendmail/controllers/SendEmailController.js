'use strict';
const nodemailer = require('nodemailer');
// async..await is not allowed in global scope, must use a wrapper
//async function main() {
const reserveEmail = async (req, res, next) => {
    // สร้างออปเจ็ค transporter เพื่อกำหนดการเชื่อมต่อ SMTP และใช้ตอนส่งเมล
    let name = req.body.name;
    let item = req.body.item;
    let email = req.body.email;
    let invoice = req.body.invoice;
    let price = req.body.price;
    let product = req.body.product;
    let detail = req.body.detail;
    let storename = req.body.storename;
    let date = req.body.date;
    let tel = req.body.tel;
    let totalprice = price * item;

    let html = `<html>`
    html += `<head>`;
    html += `<style>`;
    html += `/* heading */
    h1 { font: bold 100% sans-serif; letter-spacing: 0.5em; text-align: center; text-transform: uppercase; }    
    /* table */    
    table { font-size: 75%; table-layout: fixed; width: 100%; }
    table { border-collapse: separate; border-spacing: 2px; }
    th, td { border-width: 1px; padding: 0.5em; position: relative; text-align: left; }
    th, td { border-radius: 0.25em; border-style: solid; }
    th { background: #EEE; border-color: #BBB; }
    td { border-color: #DDD; }    
    /* page */    
    html { font: 16px/1 'Open Sans', sans-serif; overflow: auto; padding: 0.5in; }
    html { background: #999; cursor: default; }    
    body { box-sizing: border-box; height: 11in; margin: 0 auto; overflow: hidden; padding: 0.5in; width: 8.5in; }
    body { background: #FFF; border-radius: 1px; box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5); }    
    /* header */    
    header { margin: 0 0 3em; }
    header:after { clear: both; content: ""; display: table; }    
    header h1 { background: #000; border-radius: 0.25em; color: #FFF; margin: 0 0 1em; padding: 0.5em 0; }
    header address { float: left; font-size: 75%; font-style: normal; line-height: 1.25; margin: 0 1em 1em 0; }
    header address p { margin: 0 0 0.25em; }
    header span, header img { display: block; float: right; }
    header span { margin: 0 0 1em 1em; max-height: 25%; max-width: 60%; position: relative; }
    header img { max-height: 100%; max-width: 100%; }
    header input { cursor: pointer; -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)"; height: 100%; left: 0; opacity: 0; position: absolute; top: 0; width: 100%; }    
    /* article */    
    article, article address, table.meta, table.inventory { margin: 0 0 3em; }
    article:after { clear: both; content: ""; display: table; }
    article h1 { clip: rect(0 0 0 0); position: absolute; }    
    article address { float: left; font-size: 125%; font-weight: bold; }    
    /* table meta & balance */    
    table.meta, table.balance { float: right; width: 36%; }
    table.meta:after, table.balance:after { clear: both; content: ""; display: table; }    
    /* table meta */    
    table.meta th { width: 40%; }
    table.meta td { width: 60%; }    
    /* table items */    
    table.inventory { clear: both; width: 100%; }
    table.inventory th { font-weight: bold; text-align: center; }    
    table.inventory td:nth-child(1) { width: 26%; }
    table.inventory td:nth-child(2) { width: 38%; }
    table.inventory td:nth-child(3) { text-align: right; width: 12%; }
    table.inventory td:nth-child(4) { text-align: right; width: 12%; }
    table.inventory td:nth-child(5) { text-align: right; width: 12%; }    
    /* table balance */    
    table.balance th, table.balance td { width: 50%; }
    table.balance td { text-align: right; }    
    /* aside */    
    aside h1 { border: none; border-width: 0 0 1px; margin: 0 0 1em; }
    aside h1 { border-color: #999; border-bottom-style: solid; }    
    `;
    html += `</style>`;
    html += `</head>`;
    html += `<body>`
    html += `<header>`;
    html += `<h1>Invoice</h1>
    <address contenteditable>
        <p> ${name} </p>
        <p> ${tel} </p>
    </adress>
    `;
    html += `</header>`;
    html += `<article>
    <address>
        <p>${storename}</p>
    </address>
    <table class="meta">
        <tr>
            <th><span>คำสั่งซื้อ #</span></th>
            <td><span>${invoice}</span></td>
        </tr>
        <tr>
            <th><span>วันที่</span></th>
            <td><span>${date}</span></td>
        </tr>
        <tr>
            <th><span>จำนวนเงิน</span></th>
            <td><span id="prefix">$</span><span>${totalprice}</span></td>
        </tr>
    </table>
    <table class="inventory">
        <thead>
            <tr>
                <th><span>สินค้า</span></th>
                <th><span>รายละเอียด</span></th>
                <th><span>ราคา</span></th>
                <th><span>จำนวน</span></th>
                <th><span>รวม</span></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><span>${product}</span></td>
                <td><span>${detail}</span></td>
                <td><span data-prefix>$</span><span>${price}</span></td>
                <td><span>${item}</span></td>
                <td><span data-prefix>$</span><span>${totalprice}</span></td>
            </tr>
        </tbody>
    </table>
    <table class="balance">
        <tr>
            <th><span>ยอดชำระ</span></th>
            <td><span data-prefix>$</span><span>${totalprice}</span></td>
        </tr>
    </table>
</article>    
    `
    html += `</body>`;
    html += `<html>`;
    // console.log(html);
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: { // ข้อมูลการเข้าสู่ระบบ
            user: 'villageinsight@gmail.com', // email user ของเรา
            pass: 'Village2020' // email password
        }
    });
    // เริ่มทำการส่งอีเมล
    const mailOptions = {
        from: 'Village Insight <villageinsight@gmail.com>', // อีเมลผู้ส่ง
        to: email, // อีเมลผู้รับ สามารถกำหนดได้มากกว่า 1 อีเมล โดยขั้นด้วย ,(Comma)
        subject: 'รายละเอียดจองสินค้า', // หัวข้ออีเมล
        text: 'ท่านได้ทำการจองตามรายละเอียด', // plain text body
        html: html // html body
    };
    transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            var responce = {};
            responce.message = "Send mail Error #01"; //+"-"+user.userPrincipalName+"-"+password;
            responce.status = 500;
            res.json(responce);
        } else {
            console.log("Message sent: " + response.message);
            var responce = {};
            responce.message = "Success"; //+"-"+user.userPrincipalName+"-"+password;
            responce.status = 200;
            res.json(responce);
        }
        transporter.close();
    });
}
const billPayment = async (req, res, next) => {
    let name = req.body.name;
    let item = req.body.item;
    let email = req.body.email;
    let invoice = req.body.invoice;
    let price = req.body.price;
    let product = req.body.product;
    let detail = req.body.detail;
    let storename = req.body.storename;
    let date = req.body.date;
    let tel = req.body.tel;
    let totalprice = price * item;

    let html = `<html>`
    html += `<head>`;
    html += `<style>`;
    html += `/* heading */
    h1 { font: bold 100% sans-serif; letter-spacing: 0.5em; text-align: center; text-transform: uppercase; }    
    /* table */    
    table { font-size: 75%; table-layout: fixed; width: 100%; }
    table { border-collapse: separate; border-spacing: 2px; }
    th, td { border-width: 1px; padding: 0.5em; position: relative; text-align: left; }
    th, td { border-radius: 0.25em; border-style: solid; }
    th { background: #EEE; border-color: #BBB; }
    td { border-color: #DDD; }    
    /* page */    
    html { font: 16px/1 'Open Sans', sans-serif; overflow: auto; padding: 0.5in; }
    html { background: #999; cursor: default; }    
    body { box-sizing: border-box; height: 11in; margin: 0 auto; overflow: hidden; padding: 0.5in; width: 8.5in; }
    body { background: #FFF; border-radius: 1px; box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5); }    
    /* header */    
    header { margin: 0 0 3em; }
    header:after { clear: both; content: ""; display: table; }    
    header h1 { background: #000; border-radius: 0.25em; color: #FFF; margin: 0 0 1em; padding: 0.5em 0; }
    header address { float: left; font-size: 75%; font-style: normal; line-height: 1.25; margin: 0 1em 1em 0; }
    header address p { margin: 0 0 0.25em; }
    header span, header img { display: block; float: right; }
    header span { margin: 0 0 1em 1em; max-height: 25%; max-width: 60%; position: relative; }
    header img { max-height: 100%; max-width: 100%; }
    header input { cursor: pointer; -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)"; height: 100%; left: 0; opacity: 0; position: absolute; top: 0; width: 100%; }    
    /* article */    
    article, article address, table.meta, table.inventory { margin: 0 0 3em; }
    article:after { clear: both; content: ""; display: table; }
    article h1 { clip: rect(0 0 0 0); position: absolute; }    
    article address { float: left; font-size: 125%; font-weight: bold; }    
    /* table meta & balance */    
    table.meta, table.balance { float: right; width: 36%; }
    table.meta:after, table.balance:after { clear: both; content: ""; display: table; }    
    /* table meta */    
    table.meta th { width: 40%; }
    table.meta td { width: 60%; }    
    /* table items */    
    table.inventory { clear: both; width: 100%; }
    table.inventory th { font-weight: bold; text-align: center; }    
    table.inventory td:nth-child(1) { width: 26%; }
    table.inventory td:nth-child(2) { width: 38%; }
    table.inventory td:nth-child(3) { text-align: right; width: 12%; }
    table.inventory td:nth-child(4) { text-align: right; width: 12%; }
    table.inventory td:nth-child(5) { text-align: right; width: 12%; }    
    /* table balance */    
    table.balance th, table.balance td { width: 50%; }
    table.balance td { text-align: right; }    
    /* aside */    
    aside h1 { border: none; border-width: 0 0 1px; margin: 0 0 1em; }
    aside h1 { border-color: #999; border-bottom-style: solid; }    
    `;
    html += `</style>`;
    html += `</head>`;
    html += `<body>`
    html += `<header>`;
    html += `<h1>Invoice</h1>
    <address contenteditable>
        <p> ${name} </p>
        <p> ${tel} </p>
    </adress>
    `;
    html += `</header>`;
    html += `<article>
    <address>
        <p>${storename}</p>
    </address>
    <table class="meta">
        <tr>
            <th><span>คำสั่งซื้อ #</span></th>
            <td><span>${invoice}</span></td>
        </tr>
        <tr>
            <th><span>วันที่</span></th>
            <td><span>${date}</span></td>
        </tr>
        <tr>
            <th><span>จำนวนเงิน</span></th>
            <td><span id="prefix">$</span><span>${totalprice}</span></td>
        </tr>
    </table>
    <table class="inventory">
        <thead>
            <tr>
                <th><span>สินค้า</span></th>
                <th><span>รายละเอียด</span></th>
                <th><span>ราคา</span></th>
                <th><span>จำนวน</span></th>
                <th><span>รวม</span></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><span>${product}</span></td>
                <td><span>${detail}</span></td>
                <td><span data-prefix>$</span><span>${price}</span></td>
                <td><span>${item}</span></td>
                <td><span data-prefix>$</span><span>${totalprice}</span></td>
            </tr>
        </tbody>
    </table>
    <table class="balance">
        <tr>
            <th><span>ยอดชำระ</span></th>
            <td><span data-prefix>$</span><span>${totalprice}</span></td>
        </tr>
    </table>
</article>    
    `
    html += `</body>`;
    html += `<html>`;
    // console.log(html);
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: { // ข้อมูลการเข้าสู่ระบบ
            user: 'villageinsight@gmail.com', // email user ของเรา
            pass: 'Village2020' // email password
        }
    });
    // เริ่มทำการส่งอีเมล
    const mailOptions = {
        from: 'Village Insight <villageinsight@gmail.com>', // อีเมลผู้ส่ง
        to: email, // อีเมลผู้รับ สามารถกำหนดได้มากกว่า 1 อีเมล โดยขั้นด้วย ,(Comma)
        subject: 'รายละเอียดจองสินค้า', // หัวข้ออีเมล
        text: 'ท่านได้ทำการจองตามรายละเอียด', // plain text body
        html: html // html body
    };
    transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            var responce = {};
            responce.message = "Send mail Error #01"; //+"-"+user.userPrincipalName+"-"+password;
            responce.status = 500;
            res.json(responce);
        } else {
            console.log("Message sent: " + response.message);
            var responce = {};
            responce.message = "Success"; //+"-"+user.userPrincipalName+"-"+password;
            responce.status = 200;
            res.json(responce);
        }
        transporter.close();
    });
}
module.exports = { reserveEmail, billPayment };
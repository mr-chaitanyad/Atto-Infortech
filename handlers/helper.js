exports.errorDetailsForControllers = (err, errMsg, errPath, payload, currentUser, type, projectPath) => {
  err.errMsg = errMsg;
  err.errPath = errPath;
  err.payload = payload;
  err.currentUser = currentUser;
  err.type = type || "";
  err.projectPath = projectPath;

  return err;

};

exports.errorDetails = (message, code, status, type, stack, errMsg, errPath, payload, currentUser, projectPath) => {
  return {
    message,
    code,
    status,
    type,
    stackHighlighted: stack,
    controllerMsg: errMsg,
    path: errPath,
    payload,
    currentUser,
    projectPath
  }
};

exports.htmlToPDFSearchedProduct = (products) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="utf-8">
    <title>Invoice receipt</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="http://netdna.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" rel="stylesheet">
    <style type="text/css">

    .receipt-content .logo a:hover {
      text-decoration: none;
      color: #7793C4;
    }

    .receipt-content .invoice-wrapper {
      background: #FFF;
      border: 1px solid #CDD3E2;
      box-shadow: 0px 0px 1px #CCC;
      padding: 40px 40px 60px;
      margin-top: 40px;
      border-radius: 4px;
    }

    .receipt-content .invoice-wrapper .payment-details span {
      color: #A9B0BB;
      display: block;
    }
    .receipt-content .invoice-wrapper .payment-details a {
      display: inline-block;
      margin-top: 5px;
    }

    .receipt-content .invoice-wrapper .line-items .print a {
      display: inline-block;
      border: 1px solid #9CB5D6;
      padding: 13px 13px;
      border-radius: 5px;
      color: #708DC0;
      font-size: 13px;
      -webkit-transition: all 0.2s linear;
      -moz-transition: all 0.2s linear;
      -ms-transition: all 0.2s linear;
      -o-transition: all 0.2s linear;
      transition: all 0.2s linear;
    }

    .receipt-content .invoice-wrapper .line-items .print a:hover {
      text-decoration: none;
      border-color: #333;
      color: #333;
    }

    .receipt-content {
      background: #ECEEF4;
    }
    @media (min-width: 1200px) {
      .receipt-content .container {width: 900px; }
    }

    .receipt-content .logo {
      text-align: center;
      margin-top: 50px;
    }

    .receipt-content .logo a {
      font-family: Myriad Pro, Lato, Helvetica Neue, Arial;
      font-size: 36px;
      letter-spacing: .1px;
      color: #555;
      font-weight: 300;
      -webkit-transition: all 0.2s linear;
      -moz-transition: all 0.2s linear;
      -ms-transition: all 0.2s linear;
      -o-transition: all 0.2s linear;
      transition: all 0.2s linear;
    }

    .receipt-content .invoice-wrapper .intro {
      line-height: 25px;
      color: #444;
    }

    .receipt-content .invoice-wrapper .payment-info {
      margin-top: 9px;
      padding-top: 15px;
    }

    .receipt-content .invoice-wrapper .payment-info span {
      color: #A9B0BB;
    }

    .receipt-content .invoice-wrapper .payment-info strong {
      display: block;
      color: #444;
      margin-top: 3px;
    }

    @media (max-width: 767px) {
      .receipt-content .invoice-wrapper .payment-info .text-right {
      text-align: left;
      margin-top: 20px; }
    }
    .receipt-content .invoice-wrapper .payment-details {
      border-top: 2px solid #EBECEE;
      margin-top: 30px;
      padding-top: 20px;
      line-height: 22px;
    }


    @media (max-width: 767px) {
      .receipt-content .invoice-wrapper .payment-details .text-right {
      text-align: left;
      margin-top: 20px; }
    }
    .receipt-content .invoice-wrapper .line-items {
      margin-top: 40px;
    }
    .receipt-content .invoice-wrapper .line-items .headers {
      color: #A9B0BB;
      font-size: 13px;
      letter-spacing: .3px;
      border-bottom: 2px solid #EBECEE;
      padding-bottom: 4px;
    }
    .receipt-content .invoice-wrapper .line-items .items {
      margin-top: 8px;
      border-bottom: 2px solid #EBECEE;
      padding-bottom: 8px;
    }
    .receipt-content .invoice-wrapper .line-items .items .item {
      padding: 10px 0;
      color: #696969;
      font-size: 15px;
    }
    @media (max-width: 767px) {
      .receipt-content .invoice-wrapper .line-items .items .item {
      font-size: 13px; }
    }
    .receipt-content .invoice-wrapper .line-items .items .item .amount {
      letter-spacing: 0.1px;
      color: #84868A;
      font-size: 16px;
    }
    @media (max-width: 767px) {
      .receipt-content .invoice-wrapper .line-items .items .item .amount {
      font-size: 13px; }
    }

    .receipt-content .invoice-wrapper .line-items .total {
      margin-top: 30px;
    }

    .receipt-content .invoice-wrapper .line-items .total .extra-notes {
      float: left;
      width: 40%;
      text-align: left;
      font-size: 13px;
      color: #7A7A7A;
      line-height: 20px;
    }

    @media (max-width: 767px) {
      .receipt-content .invoice-wrapper .line-items .total .extra-notes {
      width: 100%;
      margin-bottom: 30px;
      float: none; }
    }

    .receipt-content .invoice-wrapper .line-items .total .extra-notes strong {
      display: block;
      margin-bottom: 5px;
      color: #454545;
    }

    .receipt-content .invoice-wrapper .line-items .total .field {
      margin-bottom: 7px;
      font-size: 14px;
      color: #555;
    }

    .receipt-content .invoice-wrapper .line-items .total .field.grand-total {
      margin-top: 10px;
      font-size: 16px;
      font-weight: 500;
    }

    .receipt-content .invoice-wrapper .line-items .total .field.grand-total span {
      color: #20A720;
      font-size: 16px;
    }

    .receipt-content .invoice-wrapper .line-items .total .field span {
      display: inline-block;
      margin-left: 20px;
      min-width: 85px;
      color: #84868A;
      font-size: 15px;
    }

    .receipt-content .invoice-wrapper .line-items .print {
      margin-top: 50px;
      text-align: center;
    }



    .receipt-content .invoice-wrapper .line-items .print a i {
      margin-right: 3px;
      font-size: 14px;
    }

    .receipt-content .footer {
      margin-top: 40px;
      margin-bottom: 110px;
      text-align: center;
      font-size: 12px;
      color: #969CAD;
    }
        </style>
    </head>
    <body>


    <div class="receipt-content">
        <div class="container bootstrap snippets bootdey">
        <div class="row">
          <div class="col-md-12">
            <div class="invoice-wrapper">

              <div class="payment-details">
                <div class="row">
                  <div class="col-sm-6">
                    <strong>
                      Searched Products
                    </strong>
                  </div>
                </div>
              </div>

              <div class="line-items">
                <div class="headers clearfix">
                  <div class="row">
                    <div class="col-xs-1">#</div>
                    <div class="col-xs-4">PRODUCTS</div>
                    <div class="col-xs-2">WAREHOUSE</div>
                    <div class="col-xs-2">QTY</div>
                  </div>
                </div>
                <div class="items">
                  ${products.map((product, i) => `
                    <div class="row item">
                      <div class="col-xs-1 desc">
                        ${i + 1}
                      </div>
                      <div class="col-xs-4 desc">
                        ${product.product_id.name}
                      </div>
                      <div class="col-xs-2 qty">
                        ${product.warehouse_id.name}
                      </div>
                      <div class="col-xs-2 qty">
                        ${product.qty}
                      </div>
                    </div>
                  `).join("")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
    <script src="http://netdna.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
    <script type="text/javascript">
    </script>
    </body>
    </html>
  `;
};

exports.htmlToPDFSingleProduct = (spares, productName) => {
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>MTT</title>
    <meta name="author" content="MIS" />
    <style type="text/css">
      * {
        margin: 0;
        padding: 0;
        text-indent: 0;
      }

      p {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 16.5pt;
        margin: 0pt;
      }

      h1 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 23pt;
      }

      .s1 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 29.5pt;
      }

      .s2 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 15pt;
      }

      .s3 {
        color: black;
        font-family: "Berlin Sans FB", sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 11.5pt;
      }

      h2 {
        color: black;
        font-family: Arial, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 19.5pt;
      }

      .s4 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 13pt;
      }

      .s5 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 11.5pt;
      }

      .s6 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 10pt;
      }

      .s7 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 11pt;
      }

      .s8 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 10pt;
      }

      .s9 {
        color: black;
        font-family: "Baskerville Old Face", serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 13pt;
      }

      .s10 {
        color: black;
        font-family: "Brush Script MT";
        font-style: italic;
        font-weight: normal;
        text-decoration: none;
        font-size: 13pt;
      }

      .s11 {
        color: black;
        font-family: Arial, sans-serif;
        font-style: italic;
        font-weight: normal;
        text-decoration: none;
        font-size: 14pt;
      }

      .s12 {
        color: black;
        font-family: "Arial Rounded MT Bold", sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 13pt;
      }

      .s13 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 11.5pt;
      }

      .s14 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 9.5pt;
      }

      .s15 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 11pt;
      }

      .s16 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 10pt;
      }

      .s17 {
        color: black;
        font-family: Arial, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 13pt;
      }

      .s18 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: italic;
        font-weight: bold;
        text-decoration: none;
        font-size: 11.5pt;
      }

      .s19 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: italic;
        font-weight: bold;
        text-decoration: none;
        font-size: 15pt;
      }

      .s20 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: italic;
        font-weight: normal;
        text-decoration: none;
        font-size: 10pt;
      }

      .s21 {
        color: #953634;
        font-family: "Times New Roman", serif;
        font-style: italic;
        font-weight: bold;
        text-decoration: underline;
        font-size: 13pt;
      }

      .s22 {
        color: #953634;
        font-family: "Times New Roman", serif;
        font-style: italic;
        font-weight: bold;
        text-decoration: none;
        font-size: 13pt;
      }

      .s23 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: underline;
        font-size: 11.5pt;
      }

      .s24 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: italic;
        font-weight: bold;
        text-decoration: underline;
        font-size: 11.5pt;
      }

      .s25 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 8pt;
      }

      .s26 {
        color: black;
        font-family: Arial, sans-serif;
        font-style: italic;
        font-weight: normal;
        text-decoration: none;
        font-size: 11.5pt;
      }

      .s27 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: italic;
        font-weight: bold;
        text-decoration: none;
        font-size: 8pt;
      }

      table,
      tbody {
        vertical-align: top;
        overflow: visible;
      }
    </style>
  </head>

  <body>
    <table style="border-collapse:collapse;margin-left:6.58pt;width:100%" cellspacing="0">

      <tr style="height:25pt">
        <td
          style="width:554pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt"
          colspan="5" bgcolor="#D6D100">
          <p class="s4"
            style="padding-top: 3pt;padding-left: 165pt;padding-right: 163pt;text-indent: 0pt;text-align: center;">${productName}</p>
        </td>
      </tr>
      <tr style="height:20pt">
        <td
          style="width:299pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
          <p class="s7"
            style="padding-left: 10pt;padding-right: 8pt;text-indent: 0pt;line-height: 19pt;text-align: center;">ITEM NAME
          </p>
        </td>
        <td
          style="width:58pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
          <p class="s5"
            style="padding-left: 9pt;padding-right: 7pt;text-indent: 0pt;line-height: 19pt;text-align: center;">STOCK</p>
        </td>
      </tr>
      ${spares.map(spare => `
        <tr style="height:16pt">
          <td
            style="width:299pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
            <p class="s14"
              style="padding-left: 10pt;padding-right: 9pt;text-indent: 0pt;line-height: 15pt;text-align: center;">${spare.name}</p>
          </td>
          <td
            style="width:58pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
            <p class="s6" style="padding-left: 1pt;text-indent: 0pt;line-height: 15pt;text-align: center;">${spare.total_qty} qty</p>
          </td>
        </tr>
      `).join("")}
    </table>
    <p style="text-indent: 0pt;text-align: left;"><br /></p>
    <p style="padding-left: 11pt;text-indent: 0pt;line-height: 9pt;text-align: left;" />
  </body>

  </html>
  `;
};

exports.htmlToPDFSingleProductClientType = (spares, productName) => {
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>MTT</title>
    <meta name="author" content="MIS" />
    <style type="text/css">
      * {
        margin: 0;
        padding: 0;
        text-indent: 0;
      }

      p {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 16.5pt;
        margin: 0pt;
      }

      h1 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 23pt;
      }

      .s1 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 29.5pt;
      }

      .s2 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 15pt;
      }

      .s3 {
        color: black;
        font-family: "Berlin Sans FB", sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 11.5pt;
      }

      h2 {
        color: black;
        font-family: Arial, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 19.5pt;
      }

      .s4 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 13pt;
      }

      .s5 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 11.5pt;
      }

      .s6 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 10pt;
      }

      .s7 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 11pt;
      }

      .s8 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 10pt;
      }

      .s9 {
        color: black;
        font-family: "Baskerville Old Face", serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 13pt;
      }

      .s10 {
        color: black;
        font-family: "Brush Script MT";
        font-style: italic;
        font-weight: normal;
        text-decoration: none;
        font-size: 13pt;
      }

      .s11 {
        color: black;
        font-family: Arial, sans-serif;
        font-style: italic;
        font-weight: normal;
        text-decoration: none;
        font-size: 14pt;
      }

      .s12 {
        color: black;
        font-family: "Arial Rounded MT Bold", sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 13pt;
      }

      .s13 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 11.5pt;
      }

      .s14 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 9.5pt;
      }

      .s15 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 11pt;
      }

      .s16 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 10pt;
      }

      .s17 {
        color: black;
        font-family: Arial, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 13pt;
      }

      .s18 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: italic;
        font-weight: bold;
        text-decoration: none;
        font-size: 11.5pt;
      }

      .s19 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: italic;
        font-weight: bold;
        text-decoration: none;
        font-size: 15pt;
      }

      .s20 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: italic;
        font-weight: normal;
        text-decoration: none;
        font-size: 10pt;
      }

      .s21 {
        color: #953634;
        font-family: "Times New Roman", serif;
        font-style: italic;
        font-weight: bold;
        text-decoration: underline;
        font-size: 13pt;
      }

      .s22 {
        color: #953634;
        font-family: "Times New Roman", serif;
        font-style: italic;
        font-weight: bold;
        text-decoration: none;
        font-size: 13pt;
      }

      .s23 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: underline;
        font-size: 11.5pt;
      }

      .s24 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: italic;
        font-weight: bold;
        text-decoration: underline;
        font-size: 11.5pt;
      }

      .s25 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 8pt;
      }

      .s26 {
        color: black;
        font-family: Arial, sans-serif;
        font-style: italic;
        font-weight: normal;
        text-decoration: none;
        font-size: 11.5pt;
      }

      .s27 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: italic;
        font-weight: bold;
        text-decoration: none;
        font-size: 8pt;
      }

      table,
      tbody {
        vertical-align: top;
        overflow: visible;
      }
    </style>
  </head>

  <body>
    <table style="border-collapse:collapse;margin-left:6.58pt;width:100%" cellspacing="0">

      <tr style="height:25pt">
        <td
          style="width:554pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt" colspan="5" bgcolor="#D6D100">
          <p class="s4"
            style="padding-top: 3pt;padding-left: 165pt;padding-right: 163pt;text-indent: 0pt;text-align: center;">${productName}</p>
        </td>
      </tr>
      <tr style="height:20pt">
        <td
          style="width:299pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
          <p class="s7"
            style="padding-left: 10pt;padding-right: 8pt;text-indent: 0pt;line-height: 19pt;text-align: center;">ITEM NAME
          </p>
        </td>
        <td
          style="width:58pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
          <p class="s5"
            style="padding-left: 9pt;padding-right: 7pt;text-indent: 0pt;line-height: 19pt;text-align: center;">STOCK</p>
        </td>
      </tr>
      ${spares.map(spare => `
        <tr style="height:16pt">
          <td
            style="width:299pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
            <p class="s14"
              style="padding-left: 10pt;padding-right: 9pt;text-indent: 0pt;line-height: 15pt;text-align: center;">${spare.name}</p>
          </td>
          <td style="width:58pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" bgcolor=${spare.total_qty != 0 ? "#32CD32" : "#FFF"}>
            <p class="s6" style="padding-left: 1pt;text-indent: 0pt;line-height: 15pt;text-align: center">${spare.total_qty != 0 ? '✔ Available' : 0}</p>
          </td>
        </tr>
      `).join("")}
    </table>
    <p style="text-indent: 0pt;text-align: left;"><br /></p>
    <p style="padding-left: 11pt;text-indent: 0pt;line-height: 9pt;text-align: left;" />
  </body>

  </html>
  `;
};

exports.htmlToPDFAllProduct = (products) => {
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>MTT</title>
    <meta name="author" content="MIS" />
    <style type="text/css">
      * {
        margin: 0;
        padding: 0;
        text-indent: 0;
      }

      p {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 16.5pt;
        margin: 0pt;
      }

      h1 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 23pt;
      }

      .s1 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 29.5pt;
      }

      .s2 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 15pt;
      }

      .s3 {
        color: black;
        font-family: "Berlin Sans FB", sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 11.5pt;
      }

      h2 {
        color: black;
        font-family: Arial, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 19.5pt;
      }

      .s4 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 13pt;
      }

      .s5 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 11.5pt;
      }

      .s6 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 10pt;
      }

      .s7 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 11pt;
      }

      .s8 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 10pt;
      }

      .s9 {
        color: black;
        font-family: "Baskerville Old Face", serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 13pt;
      }

      .s10 {
        color: black;
        font-family: "Brush Script MT";
        font-style: italic;
        font-weight: normal;
        text-decoration: none;
        font-size: 13pt;
      }

      .s11 {
        color: black;
        font-family: Arial, sans-serif;
        font-style: italic;
        font-weight: normal;
        text-decoration: none;
        font-size: 14pt;
      }

      .s12 {
        color: black;
        font-family: "Arial Rounded MT Bold", sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 13pt;
      }

      .s13 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 11.5pt;
      }

      .s14 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 9.5pt;
      }

      .s15 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 11pt;
      }

      .s16 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 10pt;
      }

      .s17 {
        color: black;
        font-family: Arial, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 13pt;
      }

      .s18 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: italic;
        font-weight: bold;
        text-decoration: none;
        font-size: 11.5pt;
      }

      .s19 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: italic;
        font-weight: bold;
        text-decoration: none;
        font-size: 15pt;
      }

      .s20 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: italic;
        font-weight: normal;
        text-decoration: none;
        font-size: 10pt;
      }

      .s21 {
        color: #953634;
        font-family: "Times New Roman", serif;
        font-style: italic;
        font-weight: bold;
        text-decoration: underline;
        font-size: 13pt;
      }

      .s22 {
        color: #953634;
        font-family: "Times New Roman", serif;
        font-style: italic;
        font-weight: bold;
        text-decoration: none;
        font-size: 13pt;
      }

      .s23 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: underline;
        font-size: 11.5pt;
      }

      .s24 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: italic;
        font-weight: bold;
        text-decoration: underline;
        font-size: 11.5pt;
      }

      .s25 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 8pt;
      }

      .s26 {
        color: black;
        font-family: Arial, sans-serif;
        font-style: italic;
        font-weight: normal;
        text-decoration: none;
        font-size: 11.5pt;
      }

      .s27 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: italic;
        font-weight: bold;
        text-decoration: none;
        font-size: 8pt;
      }

      table,
      tbody {
        vertical-align: top;
        overflow: visible;
      }
    </style>
  </head>

  <body>
    <table style="border-collapse:collapse;margin-left:6.58pt;width:100%" cellspacing="0">
      ${products.map(product => `
        <tr style="height:25pt">
          <td
            style="width:554pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt" colspan="5" bgcolor="#D6D100">
            <p class="s4"
              style="padding-top: 3pt;padding-left: 165pt;padding-right: 163pt;text-indent: 0pt;text-align: center;">${product.name}</p>
          </td>
        </tr>
        <tr style="height:20pt">
          <td
            style="width:299pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
            <p class="s7"
              style="padding-left: 10pt;padding-right: 8pt;text-indent: 0pt;line-height: 19pt;text-align: center;">ITEM NAME
            </p>
          </td>
          <td
            style="width:58pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
            <p class="s5"
              style="padding-left: 9pt;padding-right: 7pt;text-indent: 0pt;line-height: 19pt;text-align: center;">STOCK</p>
          </td>
        </tr>
        ${product.categories.map(category => category.map(product => `
          <tr style="height:16pt">
            <td
              style="width:299pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
              <p class="s14"
                style="padding-left: 10pt;padding-right: 9pt;text-indent: 0pt;line-height: 15pt;text-align: center;">${product.name}</p>
            </td>
            <td style="width:58pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
              <p class="s6" style="padding-left: 1pt;text-indent: 0pt;line-height: 15pt;text-align: center">${product.total_qty}</p>
            </td>
          </tr>
        `).join("")).join("")}

      `).join("")}
    </table>
    <p style="text-indent: 0pt;text-align: left;"><br /></p>
    <p style="padding-left: 11pt;text-indent: 0pt;line-height: 9pt;text-align: left;" />
  </body>

  </html>
  `;
};

exports.htmlToPDFAllClientProduct = (products) => {
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>MTT</title>
    <meta name="author" content="MIS" />
    <style type="text/css">
      * {
        margin: 0;
        padding: 0;
        text-indent: 0;
      }

      p {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 16.5pt;
        margin: 0pt;
      }

      h1 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 23pt;
      }

      .s1 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 29.5pt;
      }

      .s2 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 15pt;
      }

      .s3 {
        color: black;
        font-family: "Berlin Sans FB", sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 11.5pt;
      }

      h2 {
        color: black;
        font-family: Arial, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 19.5pt;
      }

      .s4 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 13pt;
      }

      .s5 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 11.5pt;
      }

      .s6 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 10pt;
      }

      .s7 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 11pt;
      }

      .s8 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 10pt;
      }

      .s9 {
        color: black;
        font-family: "Baskerville Old Face", serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 13pt;
      }

      .s10 {
        color: black;
        font-family: "Brush Script MT";
        font-style: italic;
        font-weight: normal;
        text-decoration: none;
        font-size: 13pt;
      }

      .s11 {
        color: black;
        font-family: Arial, sans-serif;
        font-style: italic;
        font-weight: normal;
        text-decoration: none;
        font-size: 14pt;
      }

      .s12 {
        color: black;
        font-family: "Arial Rounded MT Bold", sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 13pt;
      }

      .s13 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 11.5pt;
      }

      .s14 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 9.5pt;
      }

      .s15 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 11pt;
      }

      .s16 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 10pt;
      }

      .s17 {
        color: black;
        font-family: Arial, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 13pt;
      }

      .s18 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: italic;
        font-weight: bold;
        text-decoration: none;
        font-size: 11.5pt;
      }

      .s19 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: italic;
        font-weight: bold;
        text-decoration: none;
        font-size: 15pt;
      }

      .s20 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: italic;
        font-weight: normal;
        text-decoration: none;
        font-size: 10pt;
      }

      .s21 {
        color: #953634;
        font-family: "Times New Roman", serif;
        font-style: italic;
        font-weight: bold;
        text-decoration: underline;
        font-size: 13pt;
      }

      .s22 {
        color: #953634;
        font-family: "Times New Roman", serif;
        font-style: italic;
        font-weight: bold;
        text-decoration: none;
        font-size: 13pt;
      }

      .s23 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: underline;
        font-size: 11.5pt;
      }

      .s24 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: italic;
        font-weight: bold;
        text-decoration: underline;
        font-size: 11.5pt;
      }

      .s25 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 8pt;
      }

      .s26 {
        color: black;
        font-family: Arial, sans-serif;
        font-style: italic;
        font-weight: normal;
        text-decoration: none;
        font-size: 11.5pt;
      }

      .s27 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: italic;
        font-weight: bold;
        text-decoration: none;
        font-size: 8pt;
      }

      table,
      tbody {
        vertical-align: top;
        overflow: visible;
      }
    </style>
  </head>

  <body>
    <table style="border-collapse:collapse;margin-left:6.58pt;width:100%" cellspacing="0">
      ${products.map(product => `
        <tr style="height:25pt">
          <td
            style="width:554pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt" colspan="5" bgcolor="#D6D100">
            <p class="s4"
              style="padding-top: 3pt;padding-left: 165pt;padding-right: 163pt;text-indent: 0pt;text-align: center;">${product.name}</p>
          </td>
        </tr>
        <tr style="height:20pt">
          <td
            style="width:299pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
            <p class="s7"
              style="padding-left: 10pt;padding-right: 8pt;text-indent: 0pt;line-height: 19pt;text-align: center;">ITEM NAME
            </p>
          </td>
          <td
            style="width:58pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
            <p class="s5"
              style="padding-left: 9pt;padding-right: 7pt;text-indent: 0pt;line-height: 19pt;text-align: center;">STOCK</p>
          </td>
        </tr>
        ${product.categories.map(category => category.map(product => `
          <tr style="height:16pt">
            <td
              style="width:299pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
              <p class="s14"
                style="padding-left: 10pt;padding-right: 9pt;text-indent: 0pt;line-height: 15pt;text-align: center;">${product.name}</p>
            </td>
            <td style="width:58pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" bgcolor=${product.total_qty != 0 ? "#32CD32" : "#FFF"}>
              <p class="s6" style="padding-left: 1pt;text-indent: 0pt;line-height: 15pt;text-align: center">${product.total_qty != 0 ? "Available" : 0}</p>
            </td>
          </tr>
        `).join("")).join("")}

      `).join("")}
    </table>
    <p style="text-indent: 0pt;text-align: left;"><br /></p>
    <p style="padding-left: 11pt;text-indent: 0pt;line-height: 9pt;text-align: left;" />
  </body>

  </html>
  `;
};
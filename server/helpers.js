// In case we want to try server-side rendering
const template = () => {
  return `
    <!doctype html>
    <html lang="en">
      <head>
        <title>Balance</title>
        <base href="/">
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" type="image/png" href="assets/favicon.png" />
        <script src="https://js.stripe.com/v3/"></script>
      </head>
      <body>
        <div id="app"></div>

        <script
          type="text/javascript"
          src="bundle.js"
          charset="utf-8">
        </script>
      </body>
    </html>
  `;
};

module.exports = {
  template
};

/*
<script id="stripe-js" src="https://js.stripe.com/v3/" async></script>
 
*/
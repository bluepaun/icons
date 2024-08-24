console.log('build start');
const sharp = require('sharp');
const fs = require('fs');

Array(47).fill().forEach((_, idx) => {
  const url = `./좋았쓰콘/image-${idx}.jpg`;
  const tourl =`./좋았쓰콘/images/image-${idx}-resize.jpg` ;
  /*
  sharp(url)
    .resize(800, 400, {
      fit: 'contain',
      background: {r:255, g:255, b:255}
    })
    .toFile(tourl, (err, info) => {console.log(err, info)});
  */
  
  const html = 
  `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title></title>

  <meta property="og:type" content="website">
  <meta property="og:image" content="${tourl.replace(/^.*\/images/, 'images')}">
</head>
<body>
</body>
</html>
  `;

  console.log(html);
  const filename = `./좋았쓰콘/idx-${idx}.html`;

  fs.writeFile(filename, html, (err) => {
      if (err) {
          console.error(err);
      } else {
          console.log(`Text saved to ${filename}`);
      }
  });
  
});

console.log('build end');
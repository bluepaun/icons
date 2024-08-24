console.log('build start');
const sharp = require('sharp');
const fs = require('fs');

const d = "희귀페페콘";

const filePath = `./${d}`;
let cnt = 0;
fs.readdirSync(filePath).forEach(file => {
  console.log(file);
  if(file.includes('.jpg')) {
    cnt++;
  }
});

console.log(cnt);

if(fs.existsSync(`${filePath}/images`) === false) {
  fs.mkdirSync(`${filePath}/images`);
}

Array(cnt).fill().forEach((_, idx) => {
  const url = `./${d}/image-${idx}.jpg`;
  const tourl =`./${d}/images/image-${idx}-resize.jpg` ;

  sharp(url)
    .resize(800, 400, {
      fit: 'contain',
      background: {r:255, g:255, b:255}
    })
    .toFile(tourl, (err, info) => {console.log(err, info)});
  
  const html = 
  `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>-</title>
  <meta property="og:type" content="website">
  <meta property="og:image" content="${tourl.replace(/^.*\/images/, 'images')}">
</head>
<body>
  <script>
    const l = location.protocol + "//" + location.host + location.pathname + "/..";
    window.location.replace(l);
  </script>
</body>
</html>
  `;

  //console.log(html);
  const filename = `./${d}/idx-${idx}.html`;

  fs.writeFile(filename, html, (err) => {
      if (err) {
          console.error(err);
      } else {
          console.log(`Text saved to ${filename}`);
      }
  });
  
});

const indexhtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta property="og:type" content="website">
  <meta property="og:image" content="images/image-0-resize.jpg">
  <title>${d}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap');
    body,html {
      margin:0;
      background-color: #023047;
      font-family: "Noto Sans KR", sans-serif;
      font-optical-sizing: auto;
      font-style: normal;
    }
    header, a{
      color: white;
      text-align: center;
    }
    main {
      display: flex;
      flex-wrap: wrap;
      gap:1em;
      justify-content: center;
      padding-top: 1em;
    }
    main div {
      width: 100px;
      height: 100px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <header>
    <h1>${d}</h1>
    <a href="..">Home</a>
  </header>
  <main>
  </main>
  
  <script>
    const main = document.getElementsByTagName('main')[0];
    Array(${cnt}).fill().forEach((_, idx) => {
      const div = document.createElement('div');
      div.style = \`background: url("image-\${idx}.jpg") no-repeat center; background-size: cover\`;
      div.setAttribute('data-link', \`\${location.protocol}\/\/\${location.host}\${location.pathname}idx-\${idx}\`);
      div.addEventListener('click', (e) => {
        const t = e.target;
        const l = t.getAttribute('data-link');
        navigator.clipboard.writeText(l)
      })
      main.appendChild(div);
    });
  </script>
</body>
</html>
`

const filename = `./${d}/index.html`;

fs.writeFileSync(filename, indexhtml, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log(`Text saved to ${filename}`);
    }
});

const homePath = './index.html';
let data = fs.readFileSync(homePath, 'utf-8');
if (!data.match(new RegExp(`"${d}"`))) {
  data = data.replace(/ +\<\/style\>/,`   a[href="${d}"] {
      background: url("${d}/image-0.jpg") no-repeat center;
      background-size: cover;
    }
  </style>`);

  data = data.replace(/ +\<\/main\>/, `    <a href="${d}"></a>
  </main>`);

  //console.log(data);
  
  fs.writeFileSync(homePath, data, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log(`Text saved to ${homePath}`);
    }
  });
} else {

}

console.log('build end');
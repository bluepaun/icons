console.log('build start');
const sharp = require('sharp');
const fs = require('fs');

const list = [
  '고양이나나콘',
  '무도콘',
  '슬픈고양이콘',
  '아로나콘',
  '좋았쓰콘',
  '좋았쓰콘2',
  '희귀페페콘',
  '주식콘',
  '페페콘',
  '명방콘',
  '켈시콘',
  '랄로콘',
  '서양잼민이콘',
  '혁명콘',
  '둘리콘',
];
const start = list.length - 1;
//const end = list.length;
const end = list.length;

const countItems = (d) => {
  const filePath = `./${d}`;
  let cnt = 0;
  fs.readdirSync(filePath).forEach((file) => {
    console.log(file);
    if (file.includes('.jpg')) {
      cnt++;
    }
  });
  console.log(cnt);
  return cnt;
};

const makeConIndex = (d, icon_name, cnt) => {
  const indexhtml = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta property="og:type" content="website">
    <meta property="og:image" content="image-0.jpg">
    <title>${icon_name}</title>
    <link rel="stylesheet" href="../style.css">
    <link rel="stylesheet" href="../style-con.css">
    <script type="module" src="../app.js" defer></script>
  </head>
  <body>
    <header>
      <h1>${icon_name}</h1>
      <a href="..">Home</a>
    </header>
    <main>
    </main>
  </body>
  </html>
  `;

  const filename = `./${d}/index.html`;

  fs.writeFileSync(filename, indexhtml, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Text saved to ${filename}`);
    }
  });

  const cntFilename = `./${d}/cnt.json`;
  fs.writeFileSync(cntFilename, '' + cnt, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Text saved to ${filename}`);
    }
  });
};

const makeConSite = (d, cnt) => {
  const filePath = `./${d}`;
  if (fs.existsSync(`${filePath}/images`) === false) {
    fs.mkdirSync(`${filePath}/images`);
  }
  Array(cnt)
    .fill()
    .forEach((_, idx) => {
      const url = `./${d}/image-${idx}.jpg`;
      const tourl = `./${d}/images/image-${idx}-resize.jpg`;

      sharp(url)
        .resize(800, 400, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255 },
        })
        .toFile(tourl, (err, info) => {
          console.log(err, info);
        });

      const html = `<!DOCTYPE html>
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
};

const editMainIndex = (d, icon_name) => {
  const homePath = './index.html';

  let data = fs.readFileSync(homePath, 'utf-8');
  if (data.match(new RegExp(`"${d}"`))) {
    return;
  }

  data = data.replace(
    / +\<\/style\>/,
    `   a[href="${d}"] {
      background: url("${d}/image-0.jpg") no-repeat center;
      background-size: cover;
    }
  </style>`
  );

  data = data.replace(
    / +\<\/main\>/,
    `    <div>
      <a href="${d}"></a>
      <h5>${icon_name}</h5>
    </div>
  </main>
`
  );

  //console.log(data);

  fs.writeFileSync(homePath, data, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Text saved to ${homePath}`);
    }
  });
};

list
  .map((e, idx) => [idx + 1, e])
  .slice(start, end)
  .forEach(([d, icon_name]) => {
    const cnt = countItems(d);
    makeConIndex(d, icon_name, cnt);
    makeConSite(d, cnt);
    editMainIndex(d, icon_name);
  });

console.log('build end');

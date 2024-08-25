async function setCanvasImage(path) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");

    img.onload = function () {
      c.width = this.naturalWidth;
      c.height = this.naturalHeight;
      ctx.drawImage(this, 0, 0);
      c.toBlob((blob) => {
        resolve(blob);
      }, "image/png");
    };
    img.src = path;
  });
}
const cnt = await fetch(`${location.protocol}//${location.host}${location.pathname}cnt.json`).then((res) => res.json());

const main = document.getElementsByTagName('main')[0];
Array(cnt).fill().forEach((_, idx) => {
  const div = document.createElement('div');
  div.style = `background: url("image-${idx}.jpg") no-repeat center; background-size: cover`;
  div.setAttribute('data-link', `${location.protocol}//${location.host}${location.pathname}image-${idx}.jpg`);
  div.addEventListener('click', (e) => {
    const t = e.target;
    const l = t.getAttribute('data-link');
    setCanvasImage(l)
      .then((blob) => {
        const clipboardItems = [
          new ClipboardItem( {
            "image/png":blob
          })
        ];
        navigator.clipboard.write(clipboardItems)
          .then(() => console.log('copy success'))
          .catch((err) => console.log('copy failed', err));
      });
  })
  main.appendChild(div);
});
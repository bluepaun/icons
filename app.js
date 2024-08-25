const body = document.getElementsByTagName('body')[0];

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
  div.setAttribute('data-site', `${location.protocol}//${location.host}${location.pathname}idx-${idx}`);
  div.addEventListener('click', (e) => {
    const t = e.target;
    const l = t.getAttribute('data-link');
    const s = t.getAttribute('data-site');
    setCanvasImage(l)
      .then((blob) => {
        const clipboardItems = [
          new ClipboardItem( {
            "image/png":blob
          }),
          new ClipboardItem({
            "text/plain": new Blob([s], { type: "text/plain" })
          })
        ];
        navigator.clipboard.write(clipboardItems)
          .then(() => console.log('copy success'))
          .catch(err => {
              //navigator.clipboard.writeText(s)
              console.log (err);
              let alert = document.getElementById('alert');
              if (!alert) {
                alert = document.createElement('div');
                alert.id = 'alert';

                const span = document.createElement('span');
                alert.appendChild(span);

                const close = document.createElement('button');
                close.addEventListener('click', (e) => {
                  const t = e.target;
                  const p = document.getElementById('alert');
                  body.removeChild(p);
                });
                close.innerText = 'close';
                alert.appendChild(close);
                
                body.appendChild(alert);
              }

              const span = alert.getElementsByTagName('span')[0];
              if (err.name === 'NotAllowedError') {
                // Permission denied
                //alert('Permission denied. Please allow access to the clipboard.');
                span.innerText = 'Permission denied. Please allow access to the clipboard.';
              } else if (err.name === 'NotSupportedError') {
                // Clipboard API not supported
                //alert('Clipboard API is not supported by your browser.');
                span.innerText = 'Clipboard API is not supported by your browser.';
              } else {
                span.innerText = 'Unknown err occured.';
              }
            });
      });
  })
  main.appendChild(div);
});
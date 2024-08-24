import requests
from bs4 import BeautifulSoup
import re
from os import listdir, remove
from os.path import isfile, join

def icons():
  url = "https://www.dogdrip.net/sticker?sort_index=popular&page=7&sticker_srl=213748343"
  print(f"Scrapping... : {url}")
  res = requests.get(url,
                    headers={
                      "User-Agent":
                      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                    })
  soup = BeautifulSoup(res.content, "html.parser")
  divs = soup.find_all("div", class_="stk_img_v")
  new_urls = []
  for idx, div in enumerate(divs, start=0):
    style = div['style']
    pattern = r"url\((.+jpg)\)"
    match = re.search(pattern=pattern, string=style)
    print(match)
    if not match:
      continue
    img_url = match.group(1)
    if img_url.startswith('./'):
        new_url = img_url.replace('./', 'https://www.dogdrip.net/sticker/')
    else:
        new_url = url

    print(new_url)
    if not new_url.startswith('https'): 
        print("url failed")
        continue
    new_urls.append(new_url)
    
  for idx, new_url in enumerate(new_urls):
    response = requests.get(new_url)
    if response.status_code == 200:
        with open(f'image-{idx}.jpg', 'wb') as f:
            f.write(response.content)
        print("Image saved successfully")
    else:
        print("Failed to save image")


if __name__ == "__main__":
  path = './'
  onlyfiles = [f for f in listdir(path) if isfile(join(path, f))]
  print(onlyfiles)
  for filename in onlyfiles:
     if 'jpg' in filename:
      remove(join(path, filename))

  icons()




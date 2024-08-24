import requests
from bs4 import BeautifulSoup
import re

class Scrapper:
  def __init__(self, parser):
    self.parser = parser
    
  def job_search(self, keyword):
    return self.parser(keyword)

def icons():
  url = "https://dccon.dcinside.com/hot/1/title/%EC%A2%8B%EC%95%98%EC%93%B0#138029"
  print(f"Scrapping... : {url}")
  res = requests.get(url,
                    headers={
                      "User-Agent":
                      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                    })
  soup = BeautifulSoup(res.content, "html.parser")
  print(soup.find("ul", class_="dccon_list"))

def icons2():
  url = "https://www.dogdrip.net/sticker?sort_index=popular_week&sticker_srl=562615355"
  print(f"Scrapping... : {url}")
  res = requests.get(url,
                    headers={
                      "User-Agent":
                      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                    })
  soup = BeautifulSoup(res.content, "html.parser")
  divs = soup.find_all("div", class_="stk_img_v")
  for idx, div in enumerate(divs, start=0):
    style = div['style']
    pattern = r"url\((.+)\)"
    match = re.search(pattern=pattern, string=style)
    print(match)
    img_url = match.group(1)
    if img_url.startswith('./'):
        new_url = img_url.replace('./', 'https://www.dogdrip.net/sticker/')
    else:
        new_url = url

    print(new_url)
    if not new_url.startswith('https'): 
        print("url failed")
        continue
    
    response = requests.get(new_url)
    if response.status_code == 200:
        with open(f'image-{idx}.jpg', 'wb') as f:
            f.write(response.content)
        print("Image saved successfully")
    else:
        print("Failed to save image")


    
def berlinsstartup_parser(keyword):
  url = f"https://berlinstartupjobs.com/skill-areas/{keyword}"
  print(f"Scrapping... : {url}")
  res = requests.get(url,
                    headers={
                      "User-Agent":
                      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                    })
  soup = BeautifulSoup(res.content, "html.parser")

  jobs_ul = soup.find("ul", class_="jobs-list-items")
  jobs_li = jobs_ul.find_all("li")
  job_datas = []
  for job in jobs_li:
    header = job.find("h4", class_="bjs-jlid__h")
    header_anchor = header.find("a")
    title = header_anchor.get_text()
    link = header_anchor["href"]
    
    company_anchor = job.find("a", class_="bjs-jlid__b")
    company = company_anchor.get_text()

    description_div = job.find("div", class_="bjs-jlid__description")
    description = description_div.get_text()

    job_data = {
      "title": title,
      "company": company,
      "description" : description.strip(),
      "link" : link
    }

    job_datas.append(job_data)
  
  return job_datas

def web3_parser(keyword):
  url = f"https://web3.career/{keyword}-jobs"
  print(f"Scrapping... : {url}")
  res = requests.get(url=url)
  soup = BeautifulSoup(res.content, "html.parser")
  job_tbody =  soup.find("tbody", class_="tbody")
  job_trs = job_tbody.find_all("tr")

  job_datas = []
  for job_tr in job_trs:
    if job_tr.get("id") != None and "sponsor" in job_tr.get("id"):
      print(f"skip sponsor {job_tr["id"]}")
      continue
    title = job_tr.find("h2").get_text()

    company = job_tr.find("h3").get_text()

    badges_spans = job_tr.find_all("span", class_="my-badge")
    description = ""
    for badges_span in badges_spans:
      description = f"{description}, {badges_span.find("a").text}"

    link = job_tr.find("a", {"data-turbo-frame" : "job"})["href"]
    link = f"https://web3.career{link}"

    job_data = {
      "title": title,
      "company": company,
      "description" : description.strip(),
      "link" : link,
    }

    job_datas.append(job_data)

  return job_datas

def weworkremotely_parser(keyword):
  url = f"https://weworkremotely.com/remote-jobs/search?utf8=%E2%9C%93&term={keyword}"
  print(f"Scrapping ... : {url}")

  res = requests.get(url)
  soup = BeautifulSoup(res.content, "html.parser")
  articles  = soup.find_all("article")
  job_datas = []
  for article in articles:
    lis = article.find_all("li")[:-1]

    for li in lis:
      title = li.find("span", class_="title").get_text()
      companys = li.find_all("span", class_="company")
      company = companys[0].get_text()
      description = ", ".join([x.get_text() for x in companys[1:]])
      print(title, company, description)

      link = li.find("a")["href"]
      link = f"https://weworkremotely.com{link}"

      job_data = {
        "title" : title,
        "company" : company,
        "description": description,
        "link" : link
      }
      job_datas.append(job_data)
  
  return job_datas
  

if __name__ == "__main__":
    icons2()




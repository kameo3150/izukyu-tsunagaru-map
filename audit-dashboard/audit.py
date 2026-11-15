#!/usr/bin/env python3
"""Read-only checks of the public Dog & Izu pages and links; writes a versioned report."""
import concurrent.futures
import datetime as dt
import json
import os
from pathlib import Path
import re
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser

ROOT="https://kameo3150.github.io/izukyu-tsunagaru-map/"
API="https://api.github.com/repos/kameo3150/izukyu-tsunagaru-map/git/trees/main?recursive=1"
OUT=Path("audit-dashboard/data/history.json")
HEADERS={"User-Agent":"DogIzuAudit/1.0 (+github-pages-site-audit)", "Accept":"application/vnd.github+json"}
class Links(HTMLParser):
    def __init__(self): super().__init__(); self.hrefs=[]
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if tag in ("a","script","img","link"):
            key="href" if tag in ("a","link") else "src"
            if attrs.get(key): self.hrefs.append(attrs[key])

class PageMeta(HTMLParser):
    def __init__(self):
        super().__init__()
        self.current=None
        self.title=[]
        self.headings=[]
        self.current_heading=[]
        self.a8_links=[]
        self.booking_links=[]
        self.anchors=0
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if tag in ("title","h1","h2"): self.current=tag; self.current_heading=[]
        if tag=="a":
            self.anchors+=1
            href=attrs.get("href","")
            if "px.a8.net" in href or "a8mat=" in href: self.a8_links.append(href)
            if any(x in href for x in ("jalan.net","rakuten.co.jp","booking.com")):self.booking_links.append(href)
    def handle_data(self,data):
        if self.current: self.current_heading.append(data.strip())
    def handle_endtag(self,tag):
        if tag==self.current:
            val=" ".join(x for x in self.current_heading if x).strip()
            if tag=="title": self.title.append(val)
            elif val: self.headings.append({"level":tag,"text":val[:120]})
            self.current=None

def fetch(url,method="GET",timeout=15):
    req=urllib.request.Request(url,headers=HEADERS,method=method)
    with urllib.request.urlopen(req,timeout=timeout) as r:
        b=r.read(1500000) if method=="GET" else b""
        return r.status,b,r.geturl()

def check(u):
    try:
        status,_,dest=fetch(u,timeout=12)
        return {"url":u,"status":"ok" if 200<=status<400 else "broken","http":status,"finalUrl":dest}
    except urllib.error.HTTPError as e:
        return {"url":u,"status":"broken" if e.code in (404,410) else "unknown","http":e.code}
    except Exception as e:
        return {"url":u,"status":"unknown","error":type(e).__name__}

def run():
    now=dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")
    old=[]
    if OUT.exists():
        try:old=json.loads(OUT.read_text(encoding="utf-8")).get("snapshots",[])
        except (ValueError,OSError):pass
    _,raw,_=fetch(API)
    tree=json.loads(raw)
    if tree.get("truncated"):raise RuntimeError("GitHub tree truncated")
    entries=tree.get("tree",[])
    paths={x["path"]:x["sha"] for x in entries if x.get("type")=="blob"}
    pages={p:s for p,s in paths.items() if p=="inu-to-izu/index.html" or re.match(r"^inu-to-[^/]+/index\.html$",p) or re.match(r"^inu-to-izu/(?!renewal/)[^ ]*/index\.html$",p)}
    urls={ROOT+p.removesuffix("index.html"):p for p in pages}
    checks={}
    pageDetails={}
    links=set()
    # Fetch all candidate pages. Page failures must never become "OK".
    for u,p in urls.items():
        r=check(u);checks[u]=r
        if r["status"]=="ok":
            try:
                _,content,_=fetch(u)
                doc=content.decode("utf-8","replace")
                parser=Links();parser.feed(doc)
                meta=PageMeta();meta.feed(doc)
                pageDetails[p]={"title":meta.title[0] if meta.title else None,"headings":meta.headings[:80],"anchors":meta.anchors,"a8LinkCount":len(meta.a8_links),"bookingLinkCount":len(meta.booking_links),"hasGa4MeasurementId":"G-KT9SG4RDYR" in doc}

                for x in parser.hrefs:
                    full=urllib.parse.urljoin(u,x).split("#",1)[0]
                    scheme=urllib.parse.urlsplit(full).scheme
                    if scheme in ("http","https") and (full.startswith(ROOT) or full.startswith("https://www.a8.net/")):
                        links.add(full)
            except Exception as e:
                r["contentRead"]="unknown:"+type(e).__name__
    # Bound the number of network checks and avoid requests to arbitrary external sites.
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        linkresults=list(pool.map(check,sorted(links)[:300]))
    prior=old[-1] if old else None
    oldpages=prior.get("pages",{}) if prior else {}
    diffs=[{"path":p,"change":"added" if p not in oldpages else "changed"} for p,s in pages.items() if oldpages.get(p)!=s]
    diffs += [{"path":p,"change":"removed"} for p in oldpages if p not in pages]
    unresolved=[x for x in linkresults if x["status"]=="broken"]
    unknown=[x for x in linkresults if x["status"]=="unknown"]
    snap={"checkedAt":now,"source":API,"treeSha":tree["sha"],"pages":pages,"pageChecks":checks,"pageDetails":pageDetails,"links":linkresults,"diffs":diffs,"summary":{"pagesListed":len(pages),"pageHttpOK":sum(x["status"]=="ok" for x in checks.values()),"pageHttpUnknown":sum(x["status"]=="unknown" for x in checks.values()),"pageHttpBroken":sum(x["status"]=="broken" for x in checks.values()),"linksChecked":len(linkresults),"linksBroken":len(unresolved),"linksUnknown":len(unknown),"pagesWithA8Markup":sum(v["a8LinkCount"]>0 for v in pageDetails.values())},"external":{"ga4Events":"unverified","a8Agreement":"unverified","a8Conversions":"unverified"}}
    # Don't create repeated snapshots if a rerun happens during the same UTC day.
    day=now[:10]
    old=[x for x in old if x.get("checkedAt","")[:10]!=day]
    old.append(snap)
    OUT.parent.mkdir(parents=True,exist_ok=True)
    OUT.write_text(json.dumps({"schema":"inu-izu-audit-history-v2","snapshots":old[-52:]},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps({"checkedAt":now,**snap["summary"]},ensure_ascii=False))
if __name__=="__main__":run()

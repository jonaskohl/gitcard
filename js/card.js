(() => {

  if (window.card_preview) {
    parseAndRenderCard(window.card_content);
  } else {
    fetch("/api/v1/card/" + encodeURI(window.card_username)).then(res => {
      if (res.status === 200)
        return res.text();
      else if (res.status === 404)
        throw new Error("No card was found for this user");
      else {
        res.text().then(txt => {
          console.error("Error loading card data.\nResponse body:\n" + txt);
        });
        throw new Error("Unexpected error. See JavaScript console for more information");
      }
    }).then(data => {
      parseAndRenderCard(data);
    }).catch(rej => {
      const DOMcard = document.querySelector("#card");
      const DOMname = DOMcard.querySelector("#card__name");
      const DOMbio = DOMcard.querySelector("#card__bio");
      DOMname.innerText = "Error displaying card";
      DOMbio.innerText = rej.message;
    });
  }

  function parseAndRenderCard(data) {
    const linkformats = {
      "facebook": "https://fb.me/{}",
      "instagram": "https://instagram.com/{}",
      "twitter": "https://twitter.com/{}",
      "github": "https://github.com/{}",
      "telegram": "https://t.me/{}",
      "keybase": "https://keybase.io/{}",
      "deviantart": "https://deviantart.com/{}",
      "tumblr": "https://{}.tumblr.com/",
      "artstation": "https://artstation.com/{}",
      "reddit": "https://reddit.com/user/{}",
      "youtube": "https://youtube.com/channel/{}",
      "vimeo": "https://vimeo.com/{}",
      "mail": "mailto:{}",
      "web": "{}"
    }
    ,     linknames = {
      "facebook": "Facebook",
      "instagram": "Instagram",
      "twitter": "Twitter",
      "github": "GitHub",
      "telegram": "Telegram",
      "keybase": "Keybase",
      "deviantart": "DeviantArt",
      "tumblr": "Tumblr",
      "artstation": "ArtStation",
      "reddit": "Reddit",
      "youtube": "YouTube",
      "vimeo": "Vimeo",
      "mail": "Email",
      "web": "Website"
    }
    ,     keys = [
      "name",
      "pronouns",
      "bio",
      "links",
      "colors"
    ]
    ,     fields = {
      "name": null,
      "pronouns": null,
      "bio": null,
      "links": [],
      "colors": [
        "#000",
        "#fff"
      ]
    }
    ,     lines = data.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
    
    let fieldIndex = 0
      , inLinks = false
      , customColors = false
    while (lines.length > 0) {
      if (fieldIndex >= keys.length)
        break;
      
      const line = lines.shift().trim();

      if (line.length < 1)
        continue;
      
      if (inLinks) {
        if (line === "end;") {
          inLinks = false;
          fieldIndex++;
        } else {
          // current line is a link (format: site@username)
          const linkParts = line.split("@")
              , site = linkParts.shift().toLowerCase()
              , uname = linkParts.join("@");
          if (Object.keys(linkformats).indexOf(site) > -1) {
            fields.links.push({
              "link": linkformats[site].replace(/\{\}/, encodeURI(uname)),
              "site": site,
              "name": linknames[site]
            });
          } else {
            console.warn("Unknown site", site);
          }
        }
      } else {
        if (line === "links:") {
          inLinks = true;
        } else {
          // current line is any other field
          const key = keys[fieldIndex];
          if (key === "pronouns") {
            if (line.toLowerCase() !== "-omit-") {
              let pronouns, pronounLink = "https://pronoun.is/";
              if (line.indexOf(" or ") > -1) {
                pronouns = line.split(" or ");
                const queryPronouns = [];
                for (let i = 1; i < pronouns.length; i++)
                  queryPronouns.push(encodeURIComponent(pronouns[i]));
                const queryString = "?or=" + queryPronouns.join("&or=");
                pronounLink += pronouns[0] + queryString;
              } else {
                pronouns = [line];
                pronounLink += line;
              }

              fields["pronouns"] = {
                "link": pronounLink,
                "text": line
              };
            }
          } else if (key === "colors") {
            if (!customColors) {
              customColors = true;
              fields["colors"] = [];
            }
            fields["colors"].push(line);
          } else {
            fields[key] = line;
          }
          fieldIndex++;
          fieldIndex = Math.min(fieldIndex, keys.length - 1);
        }
      }
    }
    renderCard(fields);
  }

  function renderCard(card) {
    const DOMcard = document.querySelector("#card");
    const DOMname = DOMcard.querySelector("#card__name");
    const DOMpronounsLink = DOMcard.querySelector("#card__pronouns__link");
    const DOMbio = DOMcard.querySelector("#card__bio");
    const DOMlinks = DOMcard.querySelector("#card__links");

    DOMname.appendChild(document.createTextNode(card.name));

    if (card.pronouns !== null) {
      DOMpronounsLink.href = card.pronouns.link;
      DOMpronounsLink.appendChild(document.createTextNode(card.pronouns.text));
    }
    
    card.links.forEach(link => {
      const DOMlink = document.createElement("a");
      DOMlink.href = link.link;
      DOMlink.target = "_blank";
      DOMlink.title = link.name;
      fetch("/img/icons/" + link.site + ".svg").then(r=>r.text()).then(svgdata => {
        DOMlink.innerHTML = svgdata;
      });
      DOMlinks.appendChild(DOMlink);
    });

    DOMbio.appendChild(document.createTextNode(card.bio));
    
    if (card.colors.length > 0) {
      document.documentElement.style.setProperty("--card-foreground-color", card.colors[0]);

      if (card.colors.length > 1)
        document.documentElement.style.setProperty("--card-background-color", card.colors[1]);

      if (card.colors.length > 2)
        document.documentElement.style.setProperty("--card-link-color", card.colors[2]);

      if (card.colors.length > 3)
        document.documentElement.style.setProperty("--card-link-hover-color", card.colors[3]);
    }
  }
})();

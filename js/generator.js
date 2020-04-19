window.addEventListener("DOMContentLoaded", () => {
  const sites = {
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
  };

  function remLinkBtnClick(sender) {
    sender.parentElement.parentElement.removeChild(sender.parentElement);
  }

  const DOMlinktemplate = document.querySelector("#link_entry_template");
  const DOMlinklist = document.querySelector("#link_list");
  const DOMoutput = document.querySelector("#output");
  const DOMpreviewlink = document.querySelector("#preview_link");
  document.querySelector("#add_link_btn").addEventListener("click", ev => {
    const DOMlinkentry = DOMlinktemplate.content.cloneNode(true);
    const DOMlinkentrysite = DOMlinkentry.querySelector(".link_entry_site");
    const DOMlinkentryusername = DOMlinkentry.querySelector(".link_entry_username");
    const DOMremlinkbtn = DOMlinkentry.querySelector(".rem_link_btn");
    Object.keys(sites).forEach(k => {
      const v = sites[k];
      const DOMoption = document.createElement("option");
      DOMoption.value = k;
      DOMoption.innerText = v;
      DOMlinkentrysite.appendChild(DOMoption);
    });
    DOMlinkentrysite.addEventListener("change", updateGeneratedCode);
    DOMlinkentryusername.addEventListener("input", updateGeneratedCode);
    DOMremlinkbtn.addEventListener("click", () => {
      remLinkBtnClick(DOMremlinkbtn);
    })
    DOMlinklist.appendChild(DOMlinkentry);
  });

  function updateGeneratedCode() {
    const code = generateCode();
    DOMoutput.value = code;
    DOMpreviewlink.href = "/preview/" + encodeURI(btoa(JSON.stringify({
      "ts": Math.round((new Date()).getTime() / 1000),
      "content": code
    })));
  }

  function generateCode() {
    const name = document.querySelector("#name").value.trim();
    const pronouns = (document.querySelector("#pronouns").value.trim().length > 0) ? document.querySelector("#pronouns").value : "-omit-";
    const bio = document.querySelector("#bio").value.trim();
    const linksList = [];
    document.querySelectorAll("#link_list>.link_entry").forEach(en => {
      const st = en.querySelector(".link_entry_site").value
              + "@"
              + en.querySelector(".link_entry_username").value;
      linksList.push(st);
    });
    const links = "links:\n" + linksList.join("\n") + "\nend;";
    const colors = [
      document.querySelector("#color_fg").jscolor.toHEXString(),
      document.querySelector("#color_bg").jscolor.toHEXString(),
      document.querySelector("#color_ln").jscolor.toHEXString(),
      document.querySelector("#color_la").jscolor.toHEXString()
    ].join("\n");

    return [
      name,
      pronouns,
      bio,
      links,
      colors
    ].join("\n") + "\n";
  }

  document.querySelector("#name").addEventListener("input", updateGeneratedCode);
  document.querySelector("#pronouns").addEventListener("input", updateGeneratedCode);
  document.querySelector("#bio").addEventListener("input", updateGeneratedCode);
  document.querySelector("#color_fg").jscolor.onFineChange = () => updateGeneratedCode();
  document.querySelector("#color_bg").jscolor.onFineChange = () => updateGeneratedCode();
  document.querySelector("#color_ln").jscolor.onFineChange = () => updateGeneratedCode();
  document.querySelector("#color_la").jscolor.onFineChange = () => updateGeneratedCode();
});

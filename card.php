<?php
  if (empty($_GET["user"]) && empty($_GET["content"])) {
    header("Location: /");
    exit;
  }
  if (@$_GET["preview"] === "true") {
    $data = json_decode(base64_decode($_GET["content"]), true);
    $delta = time() - $data["ts"];
    if ($delta > 600) {
      #header("Location: /");
      var_dump(base64_decode($_GET["content"]));
      exit;
    }
  }
?><!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Gitcard</title>
    <link rel="stylesheet" href="/css/card.min.css">
  </head>
  <body>
<?php if (@$_GET["preview"] === "true") { ?>
<div style="font-weight:bold;text-align:center;margin:4px;border:1px solid #aa4;background:#ffc;padding:0.5em">This is a preview! It will expire after 10 minutes!</div>
<?php } ?>
    <div id="card">
      <div id="card__name"></div>
      <div id="card__pronouns"><a id="card__pronouns__link" target="_blank"></a></div>
      <div id="card__bio"></div>
      <div id="card__links"></div>
      <footer>
        Gitcard version 1.0.1 &bull; Made with <i class="emoji">&#x2764;&#xFE0F;</i> by <a href="/c/jonaskohl">Jonas Kohl</a> &bull; <a href="https://github.com/jonaskohl/gitcard" target="_blank">Source code</a>
      </footer>
    </div>

<?php if (@$_GET["preview"] === "true") { ?>
    <script>
      window.card_preview=true;
      window.card_content=<?= json_encode($data["content"]); ?>;
    </script>
<?php } else { ?>
    <script>
      window.card_preview=false;
      window.card_username=<?= json_encode($_GET["user"]); ?>;
    </script>
<?php } ?>
    <script src="/js/card.min.js"></script>
  </body>
</html>

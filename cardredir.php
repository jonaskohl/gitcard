<?php
if (empty($_POST["username"])) {
  header("Location: /");
} else {
  header("Location: /c/" . $_POST["username"]);
}

# Gitcard

Gitcard is a simple web service that allows GitHub users to create an online "card" which shows a simple profile page with the users name, their pronouns (can be omitted), a short sentence about themselves and their online links.

## <kbd>[See it in action](https://card.jonaskohl.de/c/jonaskohl)</kbd> or <kbd>[Create your own](https://card.jonaskohl.de/)</kbd>

## For developers

If you want to set up your own instance of Gitcard, you'll need the following things:

* Apache webserver with PHP
* `mod_rewrite` enabled on said webserver
* A GitHub account (to create an API key)

Start off by cloning this repo. Then [create a new authorization token](https://github.com/settings/tokens/new) and write it down (or copy it to the clipboard). Then go to the directory where you cloned this repo to and create a new directory called `.env`. Inside of `.env` create a file called `github.php` with the following content:

```php
<?php
define("GITHUB_TOKEN", "<INSERT YOUR TOKEN HERE>");
```

It is also recommended you create another file in `.env` with the name of `.htaccess` and the following content:

```
Deny from all
```

Thats it! You should now be able to use this instance of Gitcard!

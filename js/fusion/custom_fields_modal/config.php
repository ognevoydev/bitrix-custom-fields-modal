<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) {
    die();
}

return array(
    "js" => [
        "./script.js",
    ],
    "css" => [
        "./style.css"
    ],
    "rel" => [
        "popup", "ui", "ui.entity-selector", "ui.entity-editor",
    ],
);

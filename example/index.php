<?php

use Bitrix\Main\Page\Asset;
use Bitrix\Main\UI\Extension;

require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");

Asset::getInstance()->addJs(str_replace($_SERVER["DOCUMENT_ROOT"], "", __DIR__ . "/script.js"));

Extension::load("fusion.custom_fields_modal");

?>

    <div>
        <a class="ui-btn ui-btn-bg-light" onclick="showModal1();">Пример #1</a>
        <a class="ui-btn ui-btn-bg-light" onclick="showModal2();">Пример #2</a>
        <a class="ui-btn ui-btn-bg-light" onclick="showModal3();">Пример #3</a>
        <a class="ui-btn ui-btn-bg-light" onclick="showModal4();">Пример #4</a>
    </div>

<?php

require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>


#!/usr/bin/env php
<?php
$oriColors = [
    'main',
    'main\+adj',
    'main\+rect',
    ['main\+triad', 'compl-rect'],
    'compl-adj',
    'compl',
    'compl\+adj',
    ['compl\+rect', 'main-triad'],
    'main-rect',
    'main-adj',
];

$stepsDown = [
    50 => 0.1,
    100 => 0.2,
    200 => 0.4,
    300 => 0.6,
    400 => 0.8,
    500 => 1,
];
$stepsUp = [
    600 => 0.2,
    700 => 0.4,
    800 => 0.6,
    900 => 0.8,
    950 => 0.9
];


function generateCSS($color, $stepsDown, $stepsUp) {
    $s = '';
    foreach ($stepsDown as $ksd =>$sd) {
        foreach ($stepsDown as $ksd2 =>$sd2) {
            $s.= "--$color-$ksd-$ksd2: hsl(from var(--$color) h calc(s * $sd2) calc(l * $sd));\n";
        }
        foreach ($stepsUp as $ksu =>$su) {
            $s.= "--$color-$ksd-$ksu: hsl(from var(--$color) h calc(s + (100 - s) * $su) calc(l * $sd));\n";
        }
    }
    foreach ($stepsUp as $ksu =>$su) {
        foreach ($stepsDown as $ksd =>$sd) {
            $s.= "--$color-$ksu-$ksd: hsl(from var(--$color) h calc(s * $sd) calc(l + (100 - l) * $su));\n";
        }
        foreach ($stepsUp as $ksu2 =>$su2) {
            $s.= "--$color-$ksu-$ksu2: hsl(from var(--$color) h calc(s + (100 - s) * $su2) calc(l + (100 - l) * $su));\n";
        }
    }
    return $s;
}

function generateTable($colorName, $colorKey, $stepsDown, $stepsUp) {
    $s = '';
    foreach ($stepsDown as $ksd =>$sd) {
        foreach ($stepsDown as $ksd2 =>$sd2) {
            $s.= "<div class='swatch' style='background: var(--$colorKey-$ksd-$ksd2)'><span style='background:rgb(100%,100%,100%,65%);padding:2px;display:inline-block'>$colorName-$ksd-$ksd2</span></div>\n";
        }
        foreach ($stepsUp as $ksu =>$su) {
            $s.= "<div class='swatch' style='background: var(--$colorKey-$ksd-$ksu)'><span style='background:rgb(100%,100%,100%,65%);padding:2px;display:inline-block'>$colorName-$ksd-$ksu</span></div>\n";
        }
    }
    foreach ($stepsUp as $ksu =>$su) {
        foreach ($stepsDown as $ksd =>$sd) {
            $s.= "<div class='swatch' style='background: var(--$colorKey-$ksu-$ksd)'><span style='background:rgb(100%,100%,100%,65%);padding:2px;display:inline-block'>$colorName-$ksu-$ksd</span></div>\n";
        }
        foreach ($stepsUp as $ksu2 =>$su2) {
            $s.= "<div class='swatch' style='background: var(--$colorKey-$ksu-$ksu2)'><span style='background:rgb(100%,100%,100%,65%);padding:2px;display:inline-block'>$colorName-$ksu-$ksu2</span></div>\n";
        }
    }
    return $s;
}


$css = '';
foreach ($oriColors as $color) {
    if (is_array($color)) {
        foreach ($color as $c) {
            $css.=generateCSS($c, $stepsDown, $stepsUp);
        }
    } else {
        $css.=generateCSS($color, $stepsDown, $stepsUp);
    }
}

$table ='';
foreach ($oriColors as $color) {
    if (is_array($color)) {
        $colorName = $color[0]. '<br>' . $color[1];
        $colorKey = $color[0];
    } else {
        $colorName = $colorKey = $color;
    }

    $table.=generateTable($colorName, $colorKey, $stepsDown, $stepsUp);
}

file_put_contents('../assets/css/dyncolors.css', ":root {\n".$css."\n}");
file_put_contents('colors-table.html', '<div style="display:grid;grid-template-columns: repeat(11, 1fr)">'.$table.'</div>');

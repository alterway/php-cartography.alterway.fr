#!/usr/bin/php
<?php

$options = getopt('', array('help', 'file:', 'output:'));
if (!isset($options['file'], $options['output']) || isset($options['help'])) {
    $file = basename(__FILE__);
    die("
Usage:
    php ./{$file} --file=filename.xml --output=fileout.dot
       
Then (example) : 
    graphviz -Tsvg fileout.dot > image.svg
"
    );
}

$filename = $options['file'];

if (!file_exists($filename) || !is_readable($filename)) {
    throw new Exception(sprintf('file "%s" not found or not readable.', $filename));
}

$content = '';
$xml = simplexml_load_file($filename);


//
// Styles
$styles = ''
        . 'graph[splines=true];'
        . 'bgcolor=white; '
        . 'node [fontname=Arial,shape=rectangle, fillcolor=aliceblue, style=filled,color=black]; '
        . 'edge [arrowsize=1, color=black, len=4]; '
;
$registeredStyles = array();
foreach ($xml->styles->children() as $style) {
    $registeredStyles[(string) $style['name']] = $style['attribute'];
}

//
// Content
$parser = function(SimpleXMLElement $node, $parent = null) use (&$parser, $registeredStyles) {

            $content = '';

            // Attributes
            if (strlen($node['name']) > 0) {

                $attributes = '';
                $availables = array('URL', 'description', 'label', 'style');
                foreach ($availables as $key) {
                    if (!isset($node[$key])) {
                        continue;
                        ;
                    }

                    if ($key == 'style') {
                        $attributes .= (!empty($attributes) ? ',' : ' [')
                                . $registeredStyles[(string) $node[$key]];
                        continue;
                    }

                    $attributes .= (!empty($attributes) ? ',' : ' [')
                            . sprintf('%s="%s"', $key, $node[$key]);
                }
                if (strlen($attributes) > 0) {
                    $attributes.= ']';
                }

                $content = sprintf(PHP_EOL . '%1$s %2$s;', $node['name'], $attributes);
            }

            //
            // tree
            if (!is_null($parent)) {
                $content .= sprintf(PHP_EOL . '%1$s -> %2$s;', $parent['name'], $node['name']);
            }

            //
            // Childs
            if ($node->count() > 0) {
                foreach ($node->children() as $child) {
                    $content .= $parser($child, $node);
                }
            }

            $content .= PHP_EOL;
            return $content;
        };


file_put_contents($options['output'], sprintf('digraph G { %s %s }', $styles, $parser($xml->items[0])));

echo sprintf("Done.\nRemember to run GraphViz (for example: neato -Tsvg {$options['output']} > image.svg)\n\n");

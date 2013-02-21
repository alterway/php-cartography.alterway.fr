# PHP Cartography

Open Source tool to get a global vision of the PHP ecosystem

## Installation

1. Clone this project
2. Install graphviz

    ```
    apt-get install graphviz
    ```
    
## Update, add or remove any element

Please modify the file `cartography.xml`

If you want to generate new image, just run the following commands :

    ./builder.php --file=cartography.xml --output=out.dot 

It will create a out.dot file. Then simply use graphviz:

    neato -Tsvg out.dot > web/image.svg \
    && neato -Tjpg out.dot > web/image.jpg

## Licence

Licence [Creative Commons Attribution - Partage dans les Mêmes Conditions 3.0 non transposé.](http://creativecommons.org/licenses/by-sa/3.0/deed.fr).

Toute question complémentaire peut être adressée à : industrialisationPHP[AT]alterway.fr


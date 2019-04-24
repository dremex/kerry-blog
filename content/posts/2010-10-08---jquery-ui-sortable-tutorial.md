---
title: jQuery UI Sortable Tutorial
date: "2010-10-08"
template: "post"
draft: false
slug: "/2010/10/08/jquery-ui-sortable-tutorial/"
category: "Programming"
tags:
  - "Programming"
description: "This tutorial will teach you how to implement Jquery's UI sortable interaction to reorder a list representing a website menu. We'll also discuss how to save the order so you can present the updated object order to the user."
---
This tutorial will teach you how to implement Jquery's UI sortable interaction to reorder a list representing a website menu. We'll also discuss how to save the order so you can present the updated object order to the user.

## Getting Started

First we'll begin by writing the list we'd like to sort. Create a new PHP file with the following:

```html
    <html>
        <head>
            <style type="text/css">
                .menu li {
                    list-style: none;
                    padding: 10px;
                    margin-bottom: 5px;
                    border: 1px solid #000;
                    background-color: #C0C0C0;
                    width: 150px;
                }
            </style>
        </head>

        <body>
            <ul class="menu" id="menu-pages">
                <li id="page_1">Home</li>
                <li id="page_2">Blog</li>
                <li id="page_3">About</li>
                <li id="page_4">Contact</li>
            </ul>
        </body>

    </html>
```

Next we need to include Jquery and Jquery UI so include the following in the head of the page:

```html
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.3/jquery-ui.min.js"><script>
```

## Making the List Sortable

Let's add the Jquery will enable the list to be sorted, in the head add:

```javascript
    $(document).ready(function(){
        $('#menu-pages').sortable();
    });
```

This tells Jquery that any object with a parent object id of "menu-pages" will be sortable.

Try and resort the pages, everything seems to work great right? Not quite; once you refresh the page any changes you have made to the list are lost. We need a way to save the state of our list after for future page loads.

## Save the Sorted State

We'll use PHP, MySQL, and the following sample database to save the updated list order (run the SQL to generate the required database/table/data for this tutorial):

```sql
    CREATE DATABASE `sortable_tutorial`;

    USE `sortable_tutorial`;

    CREATE TABLE IF NOT EXISTS `menu` (
        `id` mediumint(8) NOT NULL AUTO_INCREMENT,
        `order` mediumint(8) NOT NULL,
        `name` varchar(255) NOT NULL,
        PRIMARY KEY (`id`)
    ) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

    INSERT INTO `menu` (`id`, `order`, `name`) VALUES
    (1, 0, 'Home'),
    (2, 0, 'About'),
    (3, 0, 'Blog'),
    (4, 0, 'Contact');
```

Essentially we're adding an "order" column to our menu table and after every list sort we'll make a quick update to this table.

Lets change the sortable() interaction to perform an ajax call to "ajax.php" and pass an updated order for our list:

```javascript
    $("#menu-pages").sortable({
        update: function(event, ui) {
            $.post("ajax.php", { pages: $('#menu-pages').sortable('serialize') } );
        }
    });
```

First we use the sortable "update" argument which is fired after an element is moved to a new location. Inside this function we're making a simple ajax call to our PHP script to pass a serialized version of our list that contains the updated order. Here's what the serialized data looks like:

```php
    page[]=1&page[]=2&page[]=3&page[]=4
```

Next create a PHP file called ajax.php and connect to your MySQL database. We'll start with using parse_str to transform our serialized list data into a nice PHP object to work with:

```php
    parse_str($_POST['pages'], $pageOrder);
```

The $pageOrder array now contains the following (left column = order, right column = record id in database):

```php
    [page] => Array
    (
        [0] => 1
        [1] => 2
        [2] => 3
        [3] => 4
    )
```

It's important to setup the ids for the items in the following manner:

id="page_1" (incrementing the number for additional pages)

This allows parse_str to properly build an array and allows us to keep track of which page corresponds to which database entry.

Next we need to update the menu table to reflect any changes. Using the array we constructed earlier, we now have a nice key value pair that can be used to update each database entry:

```php
    foreach ($pageOrder['page'] as $key => $value) {
        mysql_query("UPDATE menu SET `order` = '$key' WHERE `id` = '$value'") or die(mysql_error());
    }
```

## Display the Sorted List

Now we can use the database to display our list in order. Be sure to include your database connection code at the top of our original file and then update the list code to match the following:

```php
    <ul class="menu" id="menu-pages">
    <?php
    $result = mysql_query("SELECT id, name FROM menu ORDER BY `order` ASC") or die(mysql_error());

    while($row = mysql_fetch_array($result)){
        printf('<li id="page_%s">%s</li>', $row['id'], $row['name']);
    }
    ?>
    </ul>
```

First we pull all of the menu items out of the database sorted by their order.

Next you can see that we're programmatically generating the page id's to use the database row id, this allows us to easily add/remove menu items without changing the display code:

```php
    printf('<li id="page_%s">%s</li>', $row['id'], $row['name']);
```

That's it! Now you can move the items around, refresh the page and your changes will still appear.

Keep in mind that "sortable" can be applied to any container object (such as div's) and isn't limited to only lists.

## Helpful Links

* [Example Source Code](http://www.xmech.net/downloads/Sortable+Tutorial+Files)
* [Jquery UI Sortable Documentation](http://jqueryui.com/demos/sortable/#default)
* [parse_str Manual](http://Manual)
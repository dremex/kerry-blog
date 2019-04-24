---
title: Manipulating XML with PHP
date: "2009-12-07"
template: "post"
draft: false
slug: "/2009/12/07/manipulating-xml-with-php/"
category: "Programming"
tags:
  - "Tutorial"
description: "This article will walk you through the process of parsing an XML document using PHP's SimpleXML extension. We'll make some changes to the XML and then save the modifications."
---
This article will walk you through the process of parsing an XML document using PHP's SimpleXML extension. We'll make some changes to the XML and then save the modifications.

### Intro

If you're reading this I'm going to assume you're familiar with XML so we'll skip the XML introduction and get right into it. We're using SimpleXML because true to it's name, it makes working with an XML document simple. However it has a large draw back that might cause you to use a different parsing method, the problem lies with the entire XML document needing to be loaded into memory before parsing can begin. This isn't a problem with a 100k document however if you're parsing something in 100+MB range... you should probably use different method such as parsing from a stream.

Let's use the following scenario: Twitter is popular with the hip kids these days so lets generate a list of people I follow whom have at least 2,000 people following them. We'll need to add some change data (so any apps that consume our modified data will know how many followers we originally had) and then save our changes to a new XML document.

Lucky for us twitter just so happens to provide the data we need in XML format:

[http://twitter.com/statuses/friends.xml?screen_name=dremex](http://twitter.com/statuses/friends.xml?screen_name=dremex)

Now we have a list of the last 100 people I've followed and we can begin to parse through the document.

### Code Walkthrough

Here's the complete code for this article, go ahead and take a look and then we'll break it down and walk through it:

[http://www.xmech.net/tutorials/twitterFollowersDisplay.php](http://www.xmech.net/tutorials/twitterFollowersDisplay.php)

First we'll start with the bottom of the file and then walk through each class function call:

```php
    $friendList = new TwitterFollowers("http://twitter.com/statuses/friends.xml?screen_name=dremex", 2000);
```

We're going to create a TwitterFollowers object and pass it the url of our friends feed followed by the number of followers we want to check to make sure our friends have.

```php
    function TwitterFollowers($file, $maxFollowersCount) {
        $this->loadXml($file);
        $this->maxFollowersCount = $maxFollowersCount;
        $this->originalFollowers = $this->followerCount();
    }
```

The class constructor takes care of loading our friends feed, assigns a local variable to keep track of how many followers to check for, and sets up a statistic to keep track of our original follower count. Let's go through each step in order:

```php
    function loadXml($file) {
        $this->xml = simplexml_load_file($file);
    }
```

This is the first step in parsing any XML with SimpleXML. There are two methods to load XML data, simplexml_load_file and simplexml_load_string. Pretty self explanitory, file loads from a file and string loads from a string. For our project we're going to use the file loading (or in our case a URL) and load the XML data into our local $xml variable.

As an FYI the syntax for string version of our document would be:

```php
    $this->xml = simplexml_load_string($fileAsString);
```

The next function we're going to look at grabs the number of our current friends:

```php
    function followerCount() {
        return count($this->xml->user);
    }
```

This is where SimpleXML starts to shine with its simplicity. SimpleXML assigns elements to array key value pairs so we can easily iterate over them, more on this later.

Next we want to go ahead and check our friends for their followers count and remove any who don't have at least 2,000:

```php
    $friendList->updateFollowerList();
```

This calls our objects "updateFollowerList" function:

```php
    function updateFollowerList() {
        $this->checkFollowers();
        $this->removeFollowers();
    }
```

Let's take a look at both of these starting with checking follower count:

```php
    function checkFollowers() {
        foreach ($this->xml->user as $user) {
            if ($user->followers_count < $this->maxFollowersCount) {
                array_push($this->toRemove, $user);
            }
        }
    }
```

As I mentioned before, since SimpleXML created an array for us, we can easily iterate over each user record and check to see if they have fewer followers than our $maxFollowersCount variable we setup at the beginning.

It's interesting to include the following code so you can get a feel for how the SimpleXML array is structured. Just above the foreach in the "checkFollowers" function, go ahead and add:

```php}
    echo "
    ";
    print_r($this->xml);
    echo "

    ";
```

Now the SimpleXML array will be displayed in a readable manner. It should look something like this:

[http://www.xmech.net/tutorials/simplexmlFormatExample.html](http://www.xmech.net/tutorials/simplexmlFormatExample.html)

Go ahead and remove the debug info and let's continue on. If the user doesn't have enough followers we'll go ahead an add it to and array of "users to remove" so we can remove the users later. We don't want to remove them now because we would loose our position in the loop and never parse through all of the records.

Next we call the "removeFollowers" function that handles removing friends from the data set:

```php
    function removeFollowers() {
        foreach ($this->toRemove as $user) {
            $oNode = dom_import_simplexml($user);
            $oNode->parentNode->removeChild($oNode);
        }
    }
```

Now we're going to walk through our list of friends to remove and using DOM we'll remove them from our SimpleXML array. Unfortunately SimpleXML has no way to remove elements. First we'll call dom_import_simplexml and pass it our user (a SimpleXML element) and then remove it. Now our $followers array will no longer contain this user.

Next we'll need to add statistics for any changes made to this document:

```php
    $friendList->addChanges();
```

SimpleXML makes adding elements simple:

```php
    function addChanges() {
        $this->xml->addChild('changes');
        $this->xml->changes->addAttribute('before', $this->originalFollowers);
        $this->xml->changes->addAttribute('after', $this->followerCount());
    }
```

First we'll name our new element "changes" and give it a few attributes such as our friend count before and after our changes. The above code will add the following child element to our SimpleXML data at the end of our document:

Now we'll wrap up by saving our modified document:

```php
    $friendList->saveFollowerList("updatedFollowers.xml");
```

Once again SimpleXML makes our life easy:

```php
    function saveFollowerList($file) {
        $this->xml->asXML($file);
    }
```

We simply need to call the "asXML" and feed it a file name and it will save our XML to a file. If no file name is passed it will return the data as a string (handy for debugging).

That's it! However there are a few things that could be done to improve usability.

### Error Handling

Lets and add some error checking to make sure our XML document isn't malformed before we begin parsing. After the opening php tag add the following:

```php
    libxml_use_internal_errors(true);
```

This command will let us handle any errors instead of libxml.

Next replace the "loadXML" function with:

```php
    function loadXml($file) {
        $this->xml = simplexml_load_file($file);
        if (!$this->xml) {
            echo "Failed loading XML:";
            foreach(libxml_get_errors() as $error) {
                echo $error->message;
            }
            exit(1);
        }
    }
```

First we'll check to see if we manage to load any XML data. Since we toggled the internal libxml error to true our $xml variable will be empty if there were errors when SimpleXML tried to load the file. Now we can inform the user that there were errors and then iterate over them using libxml_get_errors().

libxml_get_errors() will provide an error message that contains the following properties: message, line, and column of the error. For our purposes we're just going to use message since it contains the entire error. After printing all of the errors out we'll exit so we don't continue and try to parse through an empty document.

Now modify the followers.xml document so the first three lines are:

Run the script and you'll get the following error:

> "Failed loading XML:
> Opening and ending tag mismatch: user2 line 3 and user expected '>' Premature end of data in tag users line 2"

### Conclusion

Using SimpleXML makes a somewhat difficult task (working with XML) simple enough that some massive changes to a document can be done in only a few short lines.

### Helpful links

*   [http://apiwiki.twitter.com/Twitter-REST-API-Method%3A-statuses%C2%A0friends](http://apiwiki.twitter.com/Twitter-REST-API-Method%3A-statuses%C2%A0friends)
*   [http://php.net/manual/en/book.simplexml.php](http://php.net/manual/en/book.simplexml.php)
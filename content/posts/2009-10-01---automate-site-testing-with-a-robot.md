---
title: Automate site testing with a robot
date: "2009-10-01"
template: "post"
draft: false
slug: "/2009/10/01/automate-site-testing-with-a-robot/"
category: "Programming"
tags:
  - "Tutorial"
description: "We've all been there, you're working on a website and you're constantly testing your changes to make sure you haven't broken anything unexpectedly. This can really become time consuming when you make a code change that could affect multiple features. This process is also susceptible to human error (sometimes you might forget to test a feature or run slightly different tests each time). If only there was a way to take the human out of the equation and make this process faster... wait a minute, we can write a robot to run our tests for us! Let's take a look at how we would accomplish this using PHP."
---
We've all been there, you're working on a website and you're constantly testing your changes to make sure you haven't broken anything unexpectedly. This can really become time consuming when you make a code change that could affect multiple features. This process is also susceptible to human error (sometimes you might forget to test a feature or run slightly different tests each time). If only there was a way to take the human out of the equation and make this process faster... wait a minute, we can write a robot to run our tests for us! Let's take a look at how we would accomplish this using PHP.

The idea of using a robot to run tests for us is nothing new, take a look at some common unit testing methods and you'll get an idea. However if we write our robot in PHP we can easily run it from a development environment without needing to download, install, or modify any existing code.

### Setup The Example Project

Before we can begin we'll need to setup a simple application so our robot has something to test. The example we'll be using is a very rudimentary todo list manager. We want to make sure users can perform the following actions: sign-in, add/remove tasks, and then sign-out. Download this zip file which contains a few php files and unzip it into your document root directory on your local test machine.

The example application is relatively straight forward so you can browse through it if you'd like; however we'll go over most of it as we go through the tutorial. There are a few steps we need to complete before we can start writing our robot. First open the mysql.php file and provide a valid username/password.

```php
    // MySQL database connection settings
    $username = "change";
    $password = "me";
```

Now execute the setup file by visiting it (http://localhost/todo/setup.php) in your browser. If everything went as expected you should see the word "Success" and we can continue on (this will create a database, required tables, and some test data for us to work with).

Now you can play around with the todo app (log in with test/password1, create and delete a task, logout).

(Please note, the application is extremely basic since we're only using it as an example, therefor I've ignored some common practices like hashing passwords, cleaning user input, styles, etc)

### Building Our Robot

With all of the setup out of the way we can finally get started on the fun part! We'll be using cURL to talk with our server and regular expressions to decide if our test passed or failed. You can view the complete script here, don't worry, we'll walk through it step by step.

### Base Robot Class

We'll start by looking at our base robot class, later we'll build our own todo robot class to work specifically with our example and we'll inherit from our base robot class. This way you can easily extend the base robot to build robots for other projects.

Lets start by defining a few variables that will be used to report the status of our tests as well as the variable that our cURL instance will be assigned to:

```php
    class Robot {
        private $passTemplate = ': <span style="color: green;">Pass</span>';
        private $failTemplate = ': <span style="color: red;">Fail</span>';
        private $ch;
```

The class constructor takes care of configuring the bulk of our cURL options however there is one item that needs some attention:

```php
    function __construct() {
        // Sometimes servers are configured with "&amp;" as their url separator.
        // This can break the url strings we construct so we'll change it to use the real "&" character.
        ini_set('arg_separator.output', '&');
        $this->configureCurl();
    }
```

You can find more details about [arg_separator here](http://www.sitepoint.com/blogs/2005/03/21/php-and-standards-arg_separatoroutput/).

```php
    function getResultTemplate($status) {
        if ($status == "passed") {
            return $this->passTemplate;
        } else {
            return $this->failTemplate;
        }
    }
```

The above function will retrieve the formatted pass/fail string we defined earlier so we can output it to display the status of a test.

It's fairly likely that our robot will need to interact with forms to complete some of our tests so we need a way to encode our test strings before they can be sent in a URL as a form post. Lucky for us PHP happens to have a function that will take care of this for us so all we need to do is pass an array containing our test strings. The array key should be the name of the form and the value should be the contents of the form field. You'll see an example of this later on.

```php
    function buildUrlQuery($data) {
        return http_build_query($data);
    }
```

Next we have the cURL configuration function which was called by the robot class constructor. The comments should give you a good idea of what each option does however there are a few that need some extra explanation:

* CURLOPT_USERAGENT: Some websites check the user agent so you might need to mascurade as a web browser.
* CURLOPT_COOKIEFILE: cURL doesn't keep track of cookies by default so if your application uses sessions we need to define a file that cURL can write and load cookies from.
* CURLOPT_FOLLOWLOCATION: This tells cURL to automatically follow any header redirects.
* CURLOPT_RETURNTRANSFER: Normally cURL will respond with a true or false after the request. Setting this option will return the any HTML that the server sent to us as a response to our request.

```php
    function configureCurl() {
        // Open connection
        $this->ch = curl_init();

        // Fake user agent
        //curl_setopt($this->ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.1) Gecko/20061204 Firefox/2.0.0.1");

        // Handle cookies (this allows sessions to work)
        curl_setopt($this->ch, CURLOPT_COOKIEFILE, 'cookies.txt');

        // Automatically follow 302 HTTP redirects
        curl_setopt($this->ch, CURLOPT_FOLLOWLOCATION, 1);

        // Tells cURL to return any HTML instead of a boolean depending on request status
        curl_setopt($this->ch, CURLOPT_RETURNTRANSFER, 1);

        // Use a Post instead of usual Get
        curl_setopt($this->ch, CURLOPT_POST, true);
    }
```

We wrap up the robot base class with the function that actually runs the tests. This includes setting the cURL url to our test url and we'll also set the post data (CURLOPT_POSTFIELDS) that we encoded earlier.

```php
    function runTest($url, $urlFields) {
        // Set the url
        curl_setopt($this->ch, CURLOPT_URL, $url);

        // Assign form post fields from our data set
        curl_setopt($this->ch, CURLOPT_POSTFIELDS, $urlFields);

        // Execute request
        $result = curl_exec($this->ch);

        // Info about the post request
        //$info = curl_getinfo($this->ch);

        return $result;
    }
```

Notice that we return the &#36;result containing HTML thanks to the CURLOPT_RETURNTRANSFER setting which we configured earlier. Later we'll use the $result data in our todo robot class to check and see if the test passed or failed.

Also notice the &#36;info variable containing a large amount of meta information about our request (times, sizes, counts, etc). It's commented out because it's generally not helpful but could come in handy if a request isn't functioning properly.

That's all for the base class, now we can move on to our todo robot class where we create the actual tests that will run against our todo application.

### Todo Robot Class

First we'll go ahead and define our class and inherit from the base class:

```php
    class TodoRobot extends Robot {
```

You'll notice that each test has it's own function so we can call them independently. Lets start with the login test which takes two arguments, a username and password:

```php
    function testLogin($username, $password) {
```

Next construct a string (using our buildUrlQuery function from earlier) that contains the data normally sent to the server by the login form:

```php
    $urlArgs = $this->buildUrlQuery(array("username" => $username, "password" => $password));
```

Now we can build our first test. We need to send the request to the location that the login form is pointing to. Open the index.php page and you'll notice that the form is pointing to login.php

```html
    <form method="post" action="login.php">
```

So we'll configure our test to run against login.php with our encoded arguments:

```php
    $result = $this->runTest("http://localhost/todo/login.php", $urlArgs);
```

Next we need to find out if our test passed or failed. We'll use regular expressions to look for a unique status identifier in the $result HTML. Before we can continue we need to see what will happen if we login. Fire up the todo app and login using valid credentials. Upon a successful login you'll notice the form is replaced with the following:

```html
    <a href="add.php">Add new item</a> | <a href="logout.php">Logout</a>
```

Using this we can look for the words "Add new item" to verify we logged in successfully. Now return the successful test template string so we can print out the status. This approach also covers any failed login attempts (if you were to pass an incorrect username/password combination).

```php
    if (preg_match('/Add\snew\sitem/', $result)) {
            return $this->getResultTemplate("passed");
        } else {
            return $this->getResultTemplate("failed");
        }
    }
```

From here on out the rest of our todo robot consists of different test functions: adding a task, removing a task, and finally logging out. All tests follow the same format as our login test. You can see how easy it is to quickly generate various tests, all you need to do is follow the same steps as we preformed in the login test:

* Perform the action you're trying to test by hand
* Find unique text to match on and decide if your test passed
* Return a passed/failed status message

```php
    function testAddingTask() {
        $urlArgs = $this->buildUrlQuery(array("item" => "Task added by robot!"));
        $result = $this->runTest("http://localhost/todo/addItem.php", $urlArgs);

        if (preg_match('/Item\sadded/', $result)) {
            return $this->getResultTemplate("passed");
        } else {
            return $this->getResultTemplate("failed");
        }
    }

    function testRemovingTask($itemNumber) {
        $urlArgs = $this->buildUrlQuery(array("item" => $itemNumber));
        $result = $this->runTest("http://localhost/todo/remove.php", $urlArgs);

        if (preg_match('/Item\sremoved/', $result)) {
            return $this->getResultTemplate("passed");
        } else {
            return $this->getResultTemplate("failed");
        }
    }

    function testLogout() {
        $result = $this->runTest("http://localhost/todo/logout.php", "");

        if (preg_match('/Logged\sout/', $result)) {
            return $this->getResultTemplate("passed");
        } else {
            return $this->getResultTemplate("failed");
        }
    }
}
```

Finally we can run our first test!

### Running the robot

Instantiate the robot, print some text to the screen so we know which test is running, and run it!

```php
    $todoRobot = new TodoRobot();
    echo "<h3>Login</h3>";
    echo "Correct credentials" . $todoRobot->testLogin("test", "password1");
    echo "<br /><hr>";
```

The rest of the tests:

```php
    echo "<h3>Add Task</h3>";
    echo "Adding task" . $todoRobot->testAddingTask();
    echo "<br /><hr>";
    echo "<h3>Remove Task</h3>";
    echo "Remove task" . $todoRobot->testRemovingTask("1");
    echo "<br /><hr>";
    echo "<h3>Logout</h3>";
    echo "Logout" . $todoRobot->testLogout();
```

Go ahead and run the robot (http://localhost/todo/todoRobot.php) and you should see all of the tests have run and passed!

Now lets take a look at what a failed test would look like. Replace the login test block with the following code:

```php
    echo "<h3>Login</h3>";
    echo "Correct credentials" . $todoRobot->testLogin("test", "password1");
    echo "<br />Wrong username/password" . $todoRobot->testLogin("kerry", "password1");
    echo "<br />Only username" . $todoRobot->testLogin("kerry", "");
    echo "<br /><hr>";
```

Run the robot again and you'll see that our recently added tests have failed. This is to be expected because we didn't pass the correct credentials. You can see how this would be useful because if the tests had passed we'd have a serious issue on our hands.

### Conclusion

Hopefully you can see how beneficial having a robot to automate your testing can be. After you make a large code change you can run your robot and make sure the basic functionality of your website hasn't been changed in any unexpected ways.

### Helpful Links

* [Complete robot file](http://www.xmech.net/tutorials/todoRobotDisplay.php)
* [Todo example application files](http://www.xmech.net/tutorials/todo.zip)
* [cURL library](http://php.net/manual/en/book.curl.php)
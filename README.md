## Test by Pablo Sande

Javascript screening for a fintech company.

`Status: Completed`

### Running the project
First run:

`npm install`

Once completed:

`npm start`

### Instructions

Terms of the Exercise

* Try and stay away from libraries if possible
* You can take as long as you like to complete the exercise, but for an indicative timescale we expect a senior developer can accomplish this in an hour.
* You may use online resources to assist you with specific techniques, syntax etc. but please do not just copy code.

### The Challenge

The aim of the exercise is to demonstrate your problem solving and understanding of JavaScript by implementing something found in every unit testing tool - an "assertEquals" method.

* Fill in the "assertEquals" function such that it will correctly compare the passed "expected" vs "actual" parameters.
* You may add more functions.
* We are big on TDD, so we expect you to complete this test using this approach.
* Credit will be given for approach, correctly identifying "failed" assertEquals, clean, testable code and coding style.
* The set of tests provided isn't exhaustive - there are cases that they don't handle. We expect you to add more tests.

### Expected Result

The following tests should "fail": 02, 03, 04, 07, 08 and 09 - and the failures should be reported using the provided mechanism.
We expect the following output for the lsit of tests we have provided, but we also expect you to add more tests:

* Test 02: Expected "abcdef" found "abc"
* Test 03: Expected type Array but found type Object
* Test 04: Expected array length 2 but found 3
* Test 07: Expected propB.propA[1].propB "b" but found "c"
* Test 08: Expected propB.propC but was not found
* Test 09: Expected type Null but found type Object
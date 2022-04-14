import "./styles.css";

//jshint esnext:true

/**
 * Returns the type of a variable, with extra types for array and null.
 *
 * @param {*} variable
 * @returns {String} Type of variable data.
 */
function internalType(variable) {
  let typeVariable = typeof variable;

  // Below are some exceptions to the typeof mechanism.
  // To circumvent them, we will create some internal types.
  // Read more: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof

  // Type of null is object, creating internal type "null".
  if (variable === null) typeVariable = "null";

  // Type of [] is object, creating internal type "array".
  if (Array.isArray(variable)) typeVariable = "array";

  return typeVariable;
}

/**
 * Utility function to compare two variables. Meant to be used with primitives.
 *
 * @param {*} expected The expected item
 * @param {*} actual The actual item
 * @returns {Object} With values {result: boolean, expected: *, actual: *, path: String}
 */
function comparePrimitive(expected, actual) {
  const result = {
    equal: true,
    expected: expected,
    actual: actual,
    path: ""
  };

  if (expected !== actual) {
    result.equal = false;
  }

  return result;
}

/**
 * Does a deep comparision of an array.
 *
 * @param {Array} expected The expected item
 * @param {Array} actual The actual item
 * @returns {Object} With values {result: boolean, expected: *, actual: *, path: String}
 */
function deepCompareArray(expected, actual) {
  const result = {
    equal: true,
    expected: null,
    actual: null,
    path: null
  };

  // Compare length
  if (expected.length !== actual.length) {
    result.equal = false;
    result.expected = `length ${expected.length}`;
    result.actual = actual.length;
    result.path = "";
    return result;
  }

  for (let i = 0; i < expected.length; i++) {
    const typeExpected = internalType(expected[i]);
    const typeActual = internalType(actual[i]);

    // Compare types
    if (typeExpected !== typeActual) {
      result.equal = false;
      result.expected = `type "${typeExpected}"`;
      result.actual = `type "${typeActual}"`;
      result.path = `[${i}]`;
      return result;
    }

    // Compare array
    if (typeExpected === "array") {
      const resultArray = deepCompareArray(expected[i], actual[i]);
      if (!resultArray.equal) {
        resultArray.path = `[${i}]${resultArray.path}`;
        return resultArray;
      }
    }

    // Compare object
    if (typeExpected === "object") {
      const resultObject = deepCompareObject(expected[i], actual[i]);
      if (!resultObject.equal) {
        resultObject.path = `[${i}]${resultObject.path}`;
        return resultObject;
      }
    }

    // Compare values
    if (
      typeExpected !== "object" &&
      typeExpected !== "array" &&
      expected[i] !== actual[i]
    ) {
      result.equal = false;
      result.expected = expected[i];
      result.actual = actual[i];
      result.path = `[${i}]`;
      return result;
    }
  }

  // If everything matches, the initial truthy object is returned.
  return result;
}

/**
 * Does a deep comparision of an object.
 *
 * @param {Object} expected The expected item
 * @param {Object} actual The actual item
 * @returns {Object} With values {result: boolean, expected: *, actual: *, path: String}
 */
function deepCompareObject(expected, actual) {
  const result = {
    equal: true,
    expected: null,
    actual: null,
    path: null
  };

  for (const key in expected) {
    // Check if key exists in actual
    if (!(key in actual)) {
      result.equal = false;
      result.expected = `key to be present`;
      result.actual = `none`;
      result.path = `.${key}`;
      return result;
    }

    // Compare types
    const typeExpected = internalType(expected[key]);
    const typeActual = internalType(actual[key]);

    if (typeExpected !== typeActual) {
      result.equal = false;
      result.expected = `type "${typeExpected}"`;
      result.actual = `type "${typeActual}"`;
      result.path = `.${key}`;
      return result;
    }

    // Compare array
    if (typeExpected === "array") {
      const resultArray = deepCompareArray(expected[key], actual[key]);
      if (!resultArray.equal) {
        resultArray.path = `.${key}${resultArray.path}`;
        return resultArray;
      }
    }

    // Compare object
    if (typeExpected === "object") {
      const resultObject = deepCompareObject(expected[key], actual[key]);
      if (!resultObject.equal) {
        resultObject.path = `.${key}${resultObject.path}`;
        return resultObject;
      }
    }

    // Compare values
    if (
      typeExpected !== "object" &&
      typeExpected !== "array" &&
      expected[key] !== actual[key]
    ) {
      result.equal = false;
      result.expected = expected[key];
      result.actual = actual[key];
      result.path = `.${key}`;
      return result;
    }
  }

  // If everything matches, the initial truthy object is returned.
  return result;
}

/**
 * Asserts "expected" versus "actual",
 * 'failing' the assertion (via Error) if a difference is found.
 *
 * @param {String} message The comparison message passed by the user
 * @param {*} expected The expected item
 * @param {*} actual The actual item
 */
function assertEquals(message, expected, actual) {
  // Get the types of the objects to be compared.
  const typeExpected = internalType(expected);
  const typeActual = internalType(actual);

  // First, check the type matches.
  if (typeExpected !== typeActual)
    throw new Error(
      `${message}: Expected type "${typeExpected}" but found type "${typeActual}"`
    );

  // Second, check values.
  switch (typeExpected) {
    case "undefined":
    case "boolean":
    case "number":
    case "string":
    case "bigint":
    case "symbol":
    case "null":
      const resultPrimitive = comparePrimitive(expected, actual);
      if (!resultPrimitive.equal)
        throw new Error(
          `${message}: Expected "${resultPrimitive.expected.toString()}" but found "${resultPrimitive.actual.toString()}"`
        );
      break;
    case "array":
      const resultArray = deepCompareArray(expected, actual);
      if (!resultArray.equal)
        throw new Error(
          `${message}: Expected Array${
            resultArray.path
          } ${resultArray.expected.toString()} but found ${resultArray.actual.toString()}`
        );
      break;
    case "object":
      const resultObject = deepCompareObject(expected, actual);
      if (!resultObject.equal)
        throw new Error(
          `${message}: Expected Object${
            resultObject.path
          } ${resultObject.expected.toString()} but found ${resultObject.actual.toString()}`
        );
      return;
    default:
      throw new Error(`${message}: Assertion failed.`);
  }
}

/* -- Test running code:  --- */

/**
 * Runs a "assertEquals" test.
 *
 * @param {String} testCase.message The initial message to pass
 * @param {*} testCase.expected Expected item
 * @param {*} testCase.actual The actual item
 */
function runTest({ message, expected, actual }) {
  try {
    assertEquals(message, expected, actual);
  } catch (error) {
    return error.message;
  }
}

function runAll() {
  const complexObject1 = {
    propA: 1,
    propB: {
      propA: [1, { propA: "a", propB: "b" }, 3],
      propB: 1,
      propC: 2
    }
  };

  const complexObject1Copy = {
    propA: 1,
    propB: {
      propA: [1, { propA: "a", propB: "b" }, 3],
      propB: 1,
      propC: 2
    }
  };

  const complexObject2 = {
    propA: 1,
    propB: {
      propB: 1,
      propA: [1, { propA: "a", propB: "c" }, 3],
      propC: 2
    }
  };

  const complexObject3 = {
    propA: 1,
    propB: {
      propA: [1, { propA: "a", propB: "b" }, 3],
      propB: 1
    }
  };

  const mySymbol = Symbol("foo");

  let testCases = [
    // Exercise tests
    { message: "Test 01", expected: "abc", actual: "abc" },
    { message: "Test 02", expected: "abcdef", actual: "abc" },
    { message: "Test 03", expected: ["a"], actual: { 0: "a" } },
    { message: "Test 04", expected: ["a", "b"], actual: ["a", "b", "c"] },
    { message: "Test 05", expected: ["a", "b", "c"], actual: ["a", "b", "c"] },
    {
      message: "Test 06",
      expected: complexObject1,
      actual: complexObject1Copy
    },
    { message: "Test 07", expected: complexObject1, actual: complexObject2 },
    { message: "Test 08", expected: complexObject1, actual: complexObject3 },
    { message: "Test 09", expected: null, actual: {} },

    // Extra tests
    { message: "Test 10", expected: null, actual: "abc" },
    { message: "Test 11", expected: null, actual: null },
    { message: "Test 12", expected: {}, actual: null },
    { message: "Test 13", expected: [], actual: null },
    { message: "Test 14", expected: [], actual: {} },
    { message: "Test 15", expected: {}, actual: [] },
    { message: "Test 16", expected: mySymbol, actual: Symbol("foo") },
    { message: "Test 17", expected: mySymbol, actual: mySymbol },
    { message: "Test 18", expected: complexObject1, actual: complexObject1 },
    { message: "Test 19", expected: complexObject2, actual: complexObject1 },
    { message: "Test 20", expected: { a: 123 }, actual: { a: undefined } }
  ];

  testCases
    .map(runTest)
    .filter((result) => result !== undefined)
    .forEach(addToList);
}

function addToList(message) {
  let messagesEl = document.getElementById("messages");
  let newListEl = document.createElement("li");
  newListEl.innerHTML = message;
  messagesEl.appendChild(newListEl);
}

runAll();

// Note: I've posted this on Dev

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

// The below code is from one of Brian Holt's Frontend Masters courses. The comments are mine, added to help me better understand the calculator.


// WALKING THROUGH '1 + 2 = 3':

  // BEFORE ANYTHING IS CLICKED:
    // runningTotal = 0
    // previousOperator = null
    // buffer = '0'

  // AFTER HAVING CLICKED '1':
    // runningTotal = 0
    // previousOperator = null
    // buffer = '1'

  // AFTER HAVING CLICKED '1 +':
    // runningTotal = 1
    // previousOperator = +
    // buffer = '0'
    
  // AFTER HAVING CLICKED '1 + 2':
    // runningTotal = 1
    // previousOperator = +
    // buffer = '2'

  // AFTER HAVING CLICKED '1 + 2 =':
    // runningTotal = 0
    // previousOperator = null
    // buffer = '3'

let runningTotal = 0 // numerical total (not seen in UI)
let buffer = '0' // what user is typing in ('buffer' gets stored below in 'screen.innerText' so is effectively what's seen in the UI)
let previousOperator = null // most recent operator pressed // note that 'null' is different than '0'; 'null' is the absence of anything
const screen = document.querySelector('.screen')

document.querySelector('.calc-buttons').addEventListener('click', function(event) { // using event delegation/bubbling here
  buttonClick(event.target.innerText)
})

function buttonClick(value) { 
  if (isNaN(parseInt(value))) { // MDN: 'isNaN()' determines if a value is NaN or not. Because coercion inside 'isNaN()' can be surprising, 'Number.isNaN()' may be preferable
    handleSymbol(value)
  } else {
    handleNumber(value)
  }
  rerender()
}

function handleNumber(value) {
  if (buffer === '0') {
    buffer = value
  } else {
    buffer += value
  }
}

function handleSymbol(value) {
  switch (value) { // using 'switch' statement instead of 'if' statement with a bunch of 'else if'
    case 'C': // i.e., if 'value' is 'C', do what's below
      buffer = '0'
      runningTotal = 0 // yes, this IS here for a reason. E.g., if user pressed '2' and then '+', runningTotal would have '2' stored in it, so if user decided at this point to press 'C' to clear, then runningTotal would need to be set back to 0
      previousOperator = null
      break
    case '=':
      if (previousOperator === null) {
        return // do nothing, and exit this function
      }
      flushOperation(parseInt(buffer))
      previousOperator = null
      buffer = '' + runningTotal // concatenates the empty string and 'runningTotal', thereby storing in 'buffer' 'runningTotal''s value but as a string
      runningTotal = 0
      break
    case '←':
      if (buffer.length === 1) {
        buffer = '0'
      } else {
        buffer = buffer.substring(0, buffer.length - 1)
      }
      break
    default:
      handleMath(value)
      break
  }
}

function handleMath(value) {
  const intBuffer = parseInt(buffer)
  if (runningTotal === 0) {
    runningTotal = intBuffer
  } else {
    flushOperation(intBuffer)
  }

  previousOperator = value

  buffer = '0' // this is the reason '0' appears each time '÷', '×', '-', or '+' is pressed
}

function flushOperation(intBuffer) { // this is a confusing name for this parameter, given that 'intBuffer' is the name of an actual variable and argument above.
  if (previousOperator === '+') {
    runningTotal += intBuffer
  } else if (previousOperator === '-') {
    runningTotal -= intBuffer
  } else if (previousOperator === '×') {
    runningTotal *= intBuffer
  } else {
    runningTotal /= intBuffer
  }
}

function rerender() {
  screen.innerText = buffer
}
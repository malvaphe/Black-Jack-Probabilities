// Readline
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// Deck structure
const deck = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 52];

// How many decks?
readline.question('How many decks do you want to use? ', (quantity) => {
  if (isNaN(parseInt(quantity))) {
    console.log(`Invalid value, using the default number of 8 decks!`);
    quantity = 8;
  } else {
    console.log(`Using ${quantity} decks!`);
  }

  // Guide
  console.log(
    'To insert a new card, write the number (1,2,3,4,5,6,7,8,9,10,11,12,13) and press enter. Write exit to finish.'
  );

  // Create the joint deck
  let decks = [];
  for (let card of deck) {
    decks.push(card * quantity);
  }

  // Give the card a name based on the number
  function giveName(i) {
    let name;
    switch (i) {
      case 0:
        name = 'A';
        break;
      case 10:
        name = 'J';
        break;
      case 11:
        name = 'Q';
        break;
      case 12:
        name = 'K';
        break;
      default:
        name = i + 1;
    }
    return name;
  }

  // Print the probability of each card and the probability of the categories (low (2,3,4,5,6), mid (7,8,9), high (1,10,11,12,13))
  function giveProbs() {
    let probs = [];
    for (let i = 0; i < decks.length - 1; i++) {
      let prob = ((decks[i] / decks[13]) * 100).toFixed(2);
      let name = giveName(i);
      probs.push(parseFloat(prob));
      console.log(`Probability of ${name} is: ${prob}%.`);
    }
    let low = (probs[1] + probs[2] + probs[3] + probs[4] + probs[5]).toFixed(2);
    let lowA = [];
    for (let i = 1; i < 6; i++) {
      lowA.push({ i, p: probs[i] });
    }
    let lowB = [
      giveName(lowA[lowA.map((o) => o.p).indexOf(Math.max(...lowA.map((o) => o.p)))].i),
      Math.max(...lowA.map((o) => o.p))
    ];
    let mid = (probs[6] + probs[7] + probs[8]).toFixed(2);
    let midA = [];
    for (let i = 6; i < 9; i++) {
      midA.push({ i, p: probs[i] });
    }
    let midB = [
      giveName(midA[midA.map((o) => o.p).indexOf(Math.max(...midA.map((o) => o.p)))].i),
      Math.max(...midA.map((o) => o.p))
    ];
    let high = (probs[0] + probs[9] + probs[10] + probs[11] + probs[12]).toFixed(2);
    let highA = [];
    for (let i = 9; i < 13; i++) {
      if (i === 9) {
        highA.push({ i: 0, p: probs[0] });
        highA.push({ i, p: probs[i] });
      } else {
        highA.push({ i, p: probs[i] });
      }
    }
    let highB = [
      giveName(highA[highA.map((o) => o.p).indexOf(Math.max(...highA.map((o) => o.p)))].i),
      Math.max(...highA.map((o) => o.p))
    ];
    console.log(`Probability of low (2,3,4,5,6) is: ${low}%. (Better: ${lowB[0]}: ${lowB[1]}%)`);
    console.log(`Probability of mid (7,8,9) is: ${mid}%. (Better: ${midB[0]}: ${midB[1]}%)`);
    console.log(`Probability of high (A,10,J,Q,K) is: ${high}%. (Better: ${highB[0]}: ${highB[1]}%)`);
  }

  // Read cards recursive
  let readCard = () => {
    readline.question('Insert a card: ', (number) => {
      if (number === 'exit') {
        readline.close();
      } else {
        let card = parseInt(number) - 1;
        if (card >= 0 && card < 13) {
          if (decks[card] > 0) {
            decks[card] -= 1;
            decks[13] -= 1;
            giveProbs();
            readCard();
          } else {
            console.log('There are no more cards with this number!');
            readCard();
          }
        } else {
          console.log('Please enter a valid number.');
          readCard();
        }
      }
    });
  };
  readCard();
});

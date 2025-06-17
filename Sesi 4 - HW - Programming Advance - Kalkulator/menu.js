import { kalkulator } from './rumus.js';
import readline from 'readline';

// Membuat interface untuk input dari terminal
const inputUser = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Minta input dari pengguna
inputUser.question("Masukkan angka pertama\t\t: ", (angka1) => {
  inputUser.question("Masukkan angka kedua\t\t: ", (angka2) => {
    inputUser.question("Masukkan operator (+, -, *, /)\t: ", (operator) => {
      console.log(
        `Hasil\t\t\t\t: ${kalkulator(
          parseFloat(angka1),
          parseFloat(angka2),
          operator
        )}`
      );
      inputUser.close();
    });
  });
});
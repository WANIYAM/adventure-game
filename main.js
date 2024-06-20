#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import figlet from "figlet";
// Class definitions
class Player {
    name;
    fuel = 100;
    constructor(name) {
        this.name = name;
    }
    fuelDecrease() {
        this.fuel -= 25;
    }
    fuelIncrease() {
        this.fuel = 100;
    }
}
class Opponent {
    name;
    fuel;
    constructor(name, difficulty) {
        this.name = name;
        this.fuel = 50 + difficulty * 25; // Adjust fuel based on difficulty
    }
    fuelDecrease() {
        this.fuel -= 25;
    }
}
// Function to handle player actions
async function playerAction(player, opponent) {
    const { opt } = await inquirer.prompt({
        type: "list",
        name: "opt",
        message: "Do you want to attack, drink potion, or defend?",
        choices: ["Attack", "Drink Potion", "Defend"]
    });
    if (opt === "Attack") {
        const num = Math.floor(Math.random() * 2);
        if (num > 0) {
            player.fuelDecrease();
            console.log(chalk.bold.red(`${player.name}'s fuel: ${player.fuel}`));
            console.log(chalk.bold.green(`${opponent.name}'s fuel: ${opponent.fuel}`));
            if (player.fuel <= 0) {
                console.log(chalk.bold.red(`${player.name} has lost the battle`));
                process.exit();
            }
        }
        else {
            opponent.fuelDecrease();
            console.log(chalk.bold.red(`${player.name}'s fuel: ${player.fuel}`));
            console.log(chalk.bold.green(`${opponent.name}'s fuel: ${opponent.fuel}`));
            if (opponent.fuel <= 0) {
                console.log(chalk.bold.green(`${player.name} wins the battle!`));
                player.fuelIncrease(); // Increase player's fuel after winning
                console.log(chalk.bold.yellow(`Your fuel is restored to ${player.fuel}`));
                return true; // Player wins
            }
        }
    }
    else if (opt === "Drink Potion") {
        player.fuelIncrease();
        console.log(chalk.bold.italic.green(`You drank a health potion. Your fuel is ${player.fuel}`));
    }
    else if (opt === "Defend") {
        console.log(chalk.bold.red("You lose. Better luck next time."));
        process.exit();
    }
}
// Main game logic
async function main() {
    console.log(chalk.magenta(figlet.textSync('ADVENTURE GAME', { horizontalLayout: 'full' })));
    const { name } = await inquirer.prompt({
        type: "input",
        name: "name",
        message: "Enter your name"
    });
    const opponents = [
        { name: "Skeleton", difficulty: 1 },
        { name: "Ghoul", difficulty: 2 },
        { name: "Werewolf", difficulty: 3 },
        { name: "Witch", difficulty: 4 },
        { name: "Vampire Lord", difficulty: 5 },
        { name: "Zombie Horde Leader", difficulty: 6 }
    ];
    let level = 0;
    while (level < opponents.length) {
        const { name: opponentName, difficulty } = opponents[level];
        const player = new Player(name);
        const opponent = new Opponent(opponentName, difficulty);
        console.log(chalk.bold.blue(`Welcome ${player.name}! Your opponent is ${opponent.name}.`));
        console.log(chalk.bold.yellow("Let the battle begin!"));
        while (true) {
            const playerWins = await playerAction(player, opponent);
            if (playerWins || player.fuel <= 0 || opponent.fuel <= 0) {
                break;
            }
        }
        if (player.fuel <= 0) {
            console.log(chalk.bold.red(`${player.name} has lost the battle against ${opponent.name}`));
            break; // End game if player loses
        }
        else {
            console.log(chalk.bold.green(`${player.name} defeated ${opponent.name}!`));
            console.log(chalk.bold.yellow("Level Up!"));
            level++; // Move to the next opponent
        }
    }
    console.log(chalk.bold.green("you are victorious! Congratulations!"));
    process.exit();
}
main();

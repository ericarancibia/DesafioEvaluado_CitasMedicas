import express from "express";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import _ from "lodash";
import chalk from "chalk";

const app = express();
const port = process.env.PORT || 3000;

let users = [];

app.get("/", (req, res) => {
    res.send("¡Bienvenido a 'Clínica DENDE Spa'!");
});

app.get("/usuarios", async (req, res) => {
    const { data } = await axios.get("https://randomuser.me/api/");
    const {
        gender,
        name: { first, last },
    } = data.results[0];

    const id = uuidv4().slice(0, 8);
    const timestamp = moment().format("MMMM Do YYYY, hh:mm A");

    users.push({ gender, first, last, id, timestamp });

    let [maleUsers, femaleUsers] = _.partition(users, { gender: "male" });

    // Formato para mostrar datos en página web
    let malePlantillaWeb = "<h1>- LISTADO DE USUARIOS - </h1><h2>Hombres:</h2><ul>";
    let femalePlantillaWeb = "<h2>Mujeres:</h2><ul>";

    // Formato para mostrar datos en consola
    let malePlantillaConsole = "Hombres:\n";
    let femalePlantillaConsole = "Mujeres:\n";

    for (let user of maleUsers) {
        let userInfo = `Nombre: ${user.first} - Apellido: ${user.last} - ID: ${user.id} - TimeStamp: ${user.timestamp}`;
        malePlantillaWeb += `<li>${userInfo}</li>`;
        malePlantillaConsole += `    - ${userInfo}\n`;
    }
    malePlantillaWeb += "</ul>";
    malePlantillaConsole += "\n";

    for (let user of femaleUsers) {
        let userInfo = `Nombre: ${user.first} - Apellido: ${user.last} - ID: ${user.id} - TimeStamp: ${user.timestamp}`;
        femalePlantillaWeb += `<li>${userInfo}</li>`;
        femalePlantillaConsole += `    - ${userInfo}\n`;
    }

    femalePlantillaWeb += "</ul>";
    femalePlantillaConsole += "\n";

    console.log(chalk.blue.bgWhite("- Listado de Usuarios -"));
    console.log(chalk.blue.bgWhite(malePlantillaConsole));
    console.log(chalk.blue.bgWhite(femalePlantillaConsole));

    res.send(`${malePlantillaWeb}${femalePlantillaWeb}`);
});

app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);

app.get("*", (req, res) => {
  res.send("<center><h1>🌵PÁGINA NO ENCONTRADA O NO EXISTE🦖</h1></center>");
});
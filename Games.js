const fsExtra = require("fs-extra");

class Games {
  static games = [];
  static async getGame(id) {
    if (this.games.length === 0) {
      this.games = await fsExtra.readJSON("./db/games.json");
    }
    return this.games.find((game) => game.id === Number(id));
  }
  static async getGames() {
    if (this.games.length === 0) {
      this.games = await fsExtra.readJSON("./db/games.json");
    }
    return this.games;
  }
  static async saveGames(game) {
    const games = await this.getGames();
    if (games.find((g) => g.nome === game.nome)) {
      throw new Error("Game already exists.");
    }
    this.games = [...games, game];
    const maxId = Math.max(...games.map((game) => game.id), 0);
    game.id = maxId + 1;
    await fsExtra.writeJSON("./db/games.json", this.games);
  }
  static async updateGames(game) {
    const games = await this.getGames();
    const index = games.findIndex((g) => g.id === game.id);
    if (index === -1) {
      throw new Error("Game not present.");
    }
    games[index] = game;
    await fsExtra.writeJSON("./db/games.json", games);
  }
  static async deleteGames(game) {
    const games = await this.getGames();
    const index = games.findIndex((g) => g.id === game.id);

    if (index === -1) {
      throw new Error("Game not present.");
    }
    games.splice(index, 1);
    await fsExtra.writeJSON("./db/games.json", games);
  }
}
module.exports = Games;

import Player from './status/player.js';
import Monster from './status/monster.js';
import { battle } from './event/battle.js';

export async function startGame() {
    console.clear();
    const player = new Player();
    let stage = 1;

    while (stage <= 10) {
        const monster = new Monster(stage);
        await battle(stage, player, monster);


        // 스테이지 클리어 및 게임 종료 조건
        stage++;
    }
}
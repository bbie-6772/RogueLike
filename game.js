import Player from './class/player.js';
import Monster from './class/monster.js';
import Rewards from './class/reward.js';
import rewardEvent from './event/reward.js';
import endgame from './event/gameover.js';
import battle from './event/battle.js';
import win from './event/ending.js';

export async function startGame() {
    console.clear();
    const player = new Player();
    let stage = 1;
    let status;

    while (stage <= 10) {
        const monster = new Monster(stage);
        status = await battle(stage, player, monster);
        // 스테이지 클리어 시
        if (status === 'run') {
            player.hp = player.maxHp;
            continue;
        } else if (status) {
            const reward = new Rewards(player, monster, stage);
            await rewardEvent(stage, player, reward);
            stage++;
        } else {
            return await endgame(stage, player);
        }
    }
    return await win(player);
}

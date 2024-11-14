import Player from './class/player.js';
import Monster from './class/monster.js';
import bossMonster from './class/boss-monster.js';
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
    let end = false;
    // 일정 스코어를 넘기면 엔딩
    const maxscore = Math.round(Math.random() * 500) + 2000;

    while (!end) {
        let monster;
        //특정 조건 만족시 시험 생성
        if (stage > 10) {
            monster = new bossMonster();
            // 이외엔 일반 문제집 생성
        } else {
            monster = new Monster(stage);
        }

        status = await battle(stage, player, monster, maxscore);

        // 도주 시
        if (status === 'run') {
            continue;
            // 문제집을 풀었을 시
        } else if (status) {
            const reward = new Rewards(player, monster, stage);
            await rewardEvent(stage, player, reward, maxscore);
            stage++;
            //엔딩 조건
            end = player.score > maxscore;
            // 죽었을 시
        } else {
            return await endgame(stage, player);
        }
    }
    return await win(player);
}

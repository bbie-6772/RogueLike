import Player from './class/player.js';
import Monster from './class/monster.js';
import bossMonster from './class/boss-monster.js';
import Rewards from './class/reward.js';
import rewardEvent from './event/reward.js';
import endgame from './event/gameover.js';
import battle from './event/battle.js';
import win from './event/ending.js';

export default async function startGame() {
    console.clear();
    // 플레이어 생성
    const player = new Player();
    // 일정 스코어를 넘기면 엔딩
    const maxscore = Math.round(Math.random() * 500) + 2000;
    // 스테이지, 전투결과, 엔딩 여부  생성
    let stage = 1;
    let status;
    let end = false;

    while (!end) {
        let monster;
        //9스테이지 넘어갈 시, 몬스터가 보스몬스터들로 변경
        monster = (stage > 9) ? new bossMonster() : new Monster(stage);
        //전투 결과 확인용
        status = await battle(stage, player, monster, maxscore);
        // 도주 시
        if (status === 'run') {
            //새롭게 전투 시작
            continue;
        // 문제집을 풀었을 시
        } else if (status) {
            //보상 생성
            const reward = new Rewards(player, monster, stage);
            //보상 이벤트 이동
            await rewardEvent(stage, player, reward, maxscore);
            //스테이지 증가
            stage++;
            //점수가 정해진만큼을 넘었을 시, 엔딩
            end = player.score > maxscore;
        // 죽었을 시
        } else {
            //죽으면 게임오버 이벤트 이동
            return await endgame(stage, player);
        }
    }
    //while문을 end를 통해 빠져나오면 엔딩으로 이동
    return await win(player);
}

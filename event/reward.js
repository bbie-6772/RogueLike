import chalk from 'chalk';
import readlineSync from 'readline-sync';
import figlet from 'figlet';
import endgame from './gameover.js';
import { Weapons } from '../storage/weapons.js';

const rewardEvent = async (stage, player, reward, maxscore) => {
    let logs = [];
    let exit = false;
    let coast = stage * 2;
    let gambleWeapon = {};

    //보상 출력
    logs.push(chalk.magentaBright('============================= 보상 정보 ============================='));
    logs.push(chalk.cyanBright(`| 기본보상 | 회복 : ${reward.heal} | 이해력 증가 : ${reward.levUp} | 추가 점수 : ${reward.score} |`));
    //보상 적용
    player.heal(reward.heal, logs);
    player.levelSet(reward.levUp, logs);
    player.score += reward.score;

    while (!exit) {
        console.clear();

        console.log(
            chalk.green(
                figlet.textSync('   Reward Time', {
                    font: 'Standard',
                    horizontalLayout: 'default',
                    verticalLayout: 'default',
                }),
            ),
        );

        for await (const log of logs) {
            console.log(log);
            // 애니메이션 효과 딜레이
            await new Promise((resolve) => setTimeout(resolve, 200));
        }

        displayReward(stage, player, maxscore);

        logs = [];

        console.log(
            chalk.gray(
                `\n선택은 한 번만 가능하며, 변경사항을 확인하고 취소할 수 있습니다(되돌아오기)`,
            ),
        );
        console.log(
            chalk.yellowBright(`\n1. 휴식 2. 필기구 강화 3. 뽑기 4. 포기`),
        );

        const choice = readlineSync.question('뭘 할까? ');

        switch (choice) {
            case '1':
                exit = await rest(player, stage, reward, maxscore);
                break;
            case '2':
                exit = await upgrade(player, stage);
                break;
            case '3':
                [exit, coast, gambleWeapon] = await gamble(
                    player,
                    coast,
                    gambleWeapon,
                );
                break;
            case '4':
                console.log(chalk.redBright('게임을 마무리 합니다.'));
                return await endgame(stage, player);
            default:
                logs.push(
                    chalk.yellowBright(
                        `예상치 못한 입력입니다! 다시 입력해주세요`,
                    ),
                );
                console.clear();
                continue;
        }
    }
    //스탯에 따른 무기 데미지 업데이트
    player.weapon.damageUpdate(player, null, logs);
    // 업데이트 상황 공유
    for await (const log of logs) {
        console.log(log);
        // 애니메이션 효과 딜레이
        await new Promise((resolve) => setTimeout(resolve, 200));
    }
    const next = readlineSync.question('다음으로 문제로 이동>>');
};

const displayReward = function (stage, player, maxscore) {
    console.log(
        chalk.magentaBright(
            `============================= 현재 상태 =============================`,
        ),
    );
    console.log(
        chalk.cyanBright(
            `| Stage: ${stage} | 필기구 : ${player.weapon.name} | 등급 : ${player.weapon.rating} |`,
        ) +
            chalk.yellowBright(
                `\n|   학생   | 정신력 : ${player.hp}/${player.maxHp} | 몰입도 : ${player.minDmg}~${player.maxDmg} Page | `,
            ) +
            chalk.greenBright(
                `\n           | 수면효과 : ${player.minHeal}~${player.maxHeal} | 이해력 : ${player.lev} | 도달 점수 : ${player.score}/${maxscore} | `,
            ),
    );
    console.log(chalk.magentaBright('='.repeat(69)));
};

// 휴식 기능
const rest = async function (player, stage, reward, maxscore) {
    let logs = [];
    let results = false;
    let exit = false;
    let choice;

    console.clear();

    console.log(
        chalk.green(
            figlet.textSync('       Take a Rest', {
                font: 'Standard',
                horizontalLayout: 'default',
                verticalLayout: 'default',
            }),
        ),
    );

    logs.push(
        chalk.magentaBright(
            `============================= 휴식 정보 =============================`,
        ),
    );
    logs.push(
        chalk.greenBright(
            `| 휴식보상 | 최대 정신력 : ${reward.hpUp} | 정신력 회복 : ${Math.round(reward.hpUp * 1.5)} | 최대 수면효과 증가 : ${reward.healUp} |`,
        ),
    );

    while (!exit) {
        for await (const log of logs) {
            console.log(log);
            // 애니메이션 효과 딜레이
            await new Promise((resolve) => setTimeout(resolve, 200));
        }

        // 선택이 되었을 때, 최종 값을 출력
        if (results) {
            return results;
        } else if (choice) {
            const back = readlineSync.question('돌아가기<<');
            return results;
        }

        displayReward(stage, player, maxscore);

        logs = [];

        console.log(chalk.yellowBright(`\n1. 수락 2. 돌아가기`));
        choice = readlineSync.question('휴식을 취하겠습니까? ');

        // 플레이어의 선택에 따라 다음 행동 처리
        logs.push(chalk.yellowBright(`${choice}를 선택하셨습니다.`));

        switch (choice) {
            case '1':
                player.maxHpSet(reward.hpUp, logs);
                player.heal(Math.round(reward.hpUp * 1.5), logs);
                results = true;
                break;
            case '2':
                logs.push(
                    chalk.yellowBright(
                        `선택을 취소했습니다! 선택지로 다시 이동합니다..`,
                    ),
                );
                break;
            default:
                logs.push(
                    chalk.yellowBright(
                        `예상치 못한 입력입니다! 다시 입력해주세요`,
                    ),
                );
                console.clear();
                continue;
        }
    }
};

// 강화 기능
const upgrade = async function (player, stage) {
    let logs = [];
    let results = false;
    let exit = false;
    let upgreadCoast =
        player.weapon.upgradeCoast + player.weapon.plus * 2 + stage;
    let choice;
    const plusWpn = player.weapon.plusWeapon(stage);

    console.clear();

    console.log(
        chalk.red(
            figlet.textSync('            Upgrade', {
                font: 'Standard',
                horizontalLayout: 'default',
                verticalLayout: 'default',
            }),
        ),
    );

    logs.push(
        chalk.magentaBright(
            `============================= 강화 정보 =============================`,
        ),
    );
    logs.push(
        chalk.cyanBright(
            `| 등급 : ${player.weapon.rating}  | 대상 : ${player.weapon.name} |`,
        ),
    );
    logs.push(
        chalk.yellowBright(
            `| 강화 이전 | 이름 : ${player.weapon.name} | 몰입도 : ${player.weapon.damage} Page  | 수면효과 : ${player.weapon.heal} |`,
        ),
    );
    logs.push(
        chalk.greenBright(
            `| 강화 이후 | 이름 : ${plusWpn.name} | 몰입도 : ${plusWpn.damage} Page  | 수면효과 : ${plusWpn.heal} |`,
        ),
    );
    logs.push(
        chalk.redBright(
            `| 강화 비용 | 이해력 : ${player.lev}/${upgreadCoast} | 확률 : ${player.weapon.prob}% | `,
        ),
    );

    while (!exit) {
        for await (const log of logs) {
            console.log(log);
            // 애니메이션 효과 딜레이
            await new Promise((resolve) => setTimeout(resolve, 200));
        }

        logs = [];

        // 선택이 되었을 때, 최종 값을 출력
        if (results) {
            return results;
        } else if (choice) {
            // 값 확인용 정지
            const back = readlineSync.question('돌아가기<<');
            return results;
        }

        console.log(chalk.yellowBright(`\n1. 수락 2. 돌아가기`));
        choice = readlineSync.question('강화를 하시겠습니까? ');

        // 플레이어의 선택에 따라 다음 행동 처리
        logs.push(chalk.yellowBright(`${choice}를 선택하셨습니다.`));

        switch (choice) {
            case '1':
                //코스트가 충분하지 않으면
                if (player.lev < upgreadCoast) {
                    logs.push(
                        chalk.redBright(`강화에 필요한 이해력이 부족합니다.`),
                    );
                    logs.push(chalk.yellowBright(`이전 선택지로 이동합니다.`));
                    break;
                    //성공 여부 돌리기
                } else if (Math.random() * 100 <= player.weapon.prob) {
                    logs.push(chalk.greenBright(`무기 강화에 성공했습니다!!`));
                    player.changeUpdate(plusWpn, logs);
                } else {
                    logs.push(chalk.redBright(`무기 강화에 실패했습니다..`));
                }
                //강화 비용 지불
                player.levelSet(-upgreadCoast, logs);
                results = true;
                break;
            case '2':
                logs.push(
                    chalk.yellowBright(
                        `선택을 취소했습니다! 선택지로 다시 이동합니다..`,
                    ),
                );
                break;
            default:
                logs.push(
                    chalk.yellowBright(`입력이 이상합니다! 다시 입력해주세요`),
                );
                console.clear();
                continue;
        }
    }
};

//뽑기 기능
const gamble = async function (player, coast, newWpn) {
    let logs = [];
    let results = false;
    let exit = false;
    let choice;
    let ratingWeapons = [];

    while (!exit) {
        const name = newWpn.name || '없음';
        const rating = newWpn.rating || '??';
        const damage = newWpn.damage || '0';
        const heal = newWpn.heal || '0';

        console.clear();

        console.log(
            chalk.yellow(
                figlet.textSync('                    Gamble', {
                    font: 'Standard',
                    horizontalLayout: 'default',
                    verticalLayout: 'default',
                }),
            ),
        );

        console.log(
            chalk.magentaBright(
                `=================================== 뽑기 정보 ===================================`,
            ),
        );
        console.log(
            chalk.cyanBright(
                `|  장착됨   | ${player.weapon.name} | 등급 : ${player.weapon.rating} | 몰입도 : ${player.weapon.damage} Page  | 수면효과 : ${player.weapon.heal} |`,
            ),
        );
        console.log(
            chalk.yellowBright(
                `| 뽑기 확률 | 등급 별 확률 |  S(5%) A(8%) B(10%) C(15%) D(25%) E(35%)  |`,
            ),
        );
        console.log(
            chalk.redBright(`| 뽑기 비용 | 이해력 : ${player.lev}/${coast} |`),
        );
        console.log(
            chalk.magentaBright(
                `================================= 가져온 필기구 =================================`,
            ),
        );

        console.log(
            chalk.yellowBright(
                `| 뽑힌 필기구 | 등급 : ${rating} | 이름 : ${name} | 몰입도 : ${damage} Page | 수면효과 : ${heal} |`,
            ),
        );

        console.log(
            chalk.magentaBright(
                `=================================== 상호 작용 ===================================`,
            ),
        );

        for await (const log of logs) {
            console.log(log);
            // 애니메이션 효과 딜레이
            await new Promise((resolve) => setTimeout(resolve, 200));
        }

        logs = [];

        // 선택이 되었을 때, 최종 값을 출력
        if (results) {
            return [results, coast, newWpn];
        } else if (choice) {
            const back = readlineSync.question('돌아가기<<');
            return [results, coast, newWpn];
        }

        console.log(chalk.yellowBright(`\n1. 뽑기 2. 필기구 교체 3. 돌아가기`));

        choice = readlineSync.question('무엇을 할까요? ');

        // 플레이어의 선택에 따라 다음 행동 처리
        logs.push(chalk.yellowBright(`${choice}를 선택하셨습니다.`));

        switch (choice) {
            //뽑기
            case '1':
                //비용이 부족할 때
                if (player.lev < coast) {
                    logs.push(
                        chalk.redBright(`뽑기에 필요한 이해력이 부족합니다.`),
                    );
                    logs.push(chalk.yellowBright(`이전 선택지로 이동합니다.`));
                    results = false;
                    break;
                    //뽑기 기능
                } else {
                    // 등급 확정
                    const prob = Math.round(Math.random() * 100);
                    //히든
                    if (prob < 2) {
                        ratingWeapons = Weapons.filter((a) => a.rating === 'H');
                        newWpn =
                            ratingWeapons[
                                Math.round(
                                    Math.random() * (ratingWeapons.length - 1),
                                )
                            ];
                        //S급
                    } else if (prob < 7) {
                        ratingWeapons = Weapons.filter((a) => a.rating === 'S');
                        newWpn =
                            ratingWeapons[
                                Math.round(
                                    Math.random() * (ratingWeapons.length - 1),
                                )
                            ];
                        //A급
                    } else if (prob < 15) {
                        ratingWeapons = Weapons.filter((a) => a.rating === 'A');
                        newWpn =
                            ratingWeapons[
                                Math.round(
                                    Math.random() * (ratingWeapons.length - 1),
                                )
                            ];
                        //B급
                    } else if (prob < 25) {
                        ratingWeapons = Weapons.filter((a) => a.rating === 'B');
                        newWpn =
                            ratingWeapons[
                                Math.round(
                                    Math.random() * (ratingWeapons.length - 1),
                                )
                            ];
                        //C급
                    } else if (prob < 40) {
                        ratingWeapons = Weapons.filter((a) => a.rating === 'C');
                        newWpn =
                            ratingWeapons[
                                Math.round(
                                    Math.random() * (ratingWeapons.length - 1),
                                )
                            ];
                        //D급
                    } else if (prob < 65) {
                        ratingWeapons = Weapons.filter((a) => a.rating === 'D');
                        newWpn =
                            ratingWeapons[
                                Math.round(
                                    Math.random() * (ratingWeapons.length - 1),
                                )
                            ];
                        //E급
                    } else if (prob <= 100) {
                        ratingWeapons = Weapons.filter((a) => a.rating === 'E');
                        newWpn =
                            ratingWeapons[
                                Math.round(
                                    Math.random() * (ratingWeapons.length - 1),
                                )
                            ];
                    }
                    //뽑기 비용 지불
                    player.levelSet(-coast, logs);
                    //뽑기 비용 증가
                    coast++;
                    // 여러 뽑을 수 있도록 choice 초기화로 while 지속
                    choice = 0;
                    continue;
                }
            //교체
            case '2':
                if (newWpn.name) {
                    logs.push(chalk.greenBright(`뽑은 무기와 교체합니다!`));
                    player.changeUpdate(newWpn);
                    //무기 교체 시, 다음 라운드 진행
                    results = true;
                    break;
                } else {
                    logs.push(
                        chalk.redBright(`뽑은 무기가 존재하지 않습니다!`),
                    );
                    choice = 0;
                    continue;
                }
            //취소
            case '3':
                logs.push(
                    chalk.yellowBright(
                        `선택을 취소했습니다! 선택지로 다시 이동합니다..`,
                    ),
                );
                break;
            default:
                logs.push(
                    chalk.yellowBright(
                        `예상치 못한 입력입니다! 다시 입력해주세요`,
                    ),
                );
                console.clear();
                continue;
        }
    }
};

export default rewardEvent;

import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import start from '../server.js';
import passwordCk from '../storage/PSWD-schema.js';
import { Weapons, update } from '../storage/weapons.js';
import WeaponSch from '../storage/weapon-schemas.js';

const admin = async (password) => {
    let logs = [];
    let exit = false;

    //비밀 번호 확인
    if (passwordCk.password !== password) {
        console.log(chalk.redBright('오류! 비밀번호가 틀렸습니다!!'));
        console.log(chalk.yellowBright('메인화면으로 이동합니다!'));
        readlineSync.question('Back<<');
        return start();
    }

    logs.push(chalk.greenBright('어서오세요! 관리자님!!'));

    while (!exit) {
        console.clear();

        console.log(
            chalk.cyanBright(
                figlet.textSync('    Admin', {
                    font: 'Standard',
                    horizontalLayout: 'default',
                    verticalLayout: 'default',
                }),
            ),
        );

        console.log(
            chalk.magentaBright(
                `================ 관리자 모드 ================`,
            ),
        );

        logs.push(
            chalk.yellowBright(
                `\n1. 무기 사전 2. 무기 검색 3. 무기 추가 4.돌아가기`,
            ),
        );

        for await (const log of logs) {
            console.log(log);
            // 애니메이션 효과 딜레이
            await new Promise((resolve) => setTimeout(resolve, 50));
        }

        logs = [];

        const choice = readlineSync.question('Choice? ');

        switch (choice) {
            case '1':
                logs.push(chalk.cyanBright('모든 무기들을 불러옵니다!'));
                WeaponList(logs);
                break;
            case '2':
                console.log(
                    chalk.cyanBright('검색할 무기의 이름를 입력해주세요!'),
                );
                await SearchingWeapon(readlineSync.question('무기 이름: '));
                break;
            case '3':
                logs.push(chalk.cyanBright('무기 추가를 위해 이동합니다!'));
                await NewWeapon();
                break;
            case '4':
                console.log(chalk.cyanBright('메인 화면으로 이동합니다'));
                const back = readlineSync.question('돌아가기<<');
                return start();
            default:
                console.log(chalk.redBright('올바르지 않은 접근입니다.'));
                continue;
        }
    }
};

//무기 전부 조회
const WeaponList = (logs) => {
    Weapons.sort((a, b) => {
        const x = ratingToNum(a);
        const y = ratingToNum(b);
        return y - x;
    }).forEach((val, idx) => {
        if (idx === 0) {
            logs.push(
                chalk.magentaBright(`=========== ${val.rating}급 ===========`),
            );
        } else if (val.rating !== Weapons[idx - 1].rating) {
            logs.push(
                chalk.magentaBright(`=========== ${val.rating}급 ===========`),
            );
        }

        logs.push(
            chalk.yellowBright(
                `| 등급 : ${val.rating} | 몰입도 : ${String(val.damage).padStart(3, ' ')} Page | 수면효과 : ${String(val.heal).padStart(3, ' ')} | 이름 : ${val.name}`,
            ),
        );
    });
};

//무기 하나 조회
const SearchingWeapon = async (name) => {
    //무기이름으로 조회
    const val = Weapons.find((e) => {
        return e.name === name;
    });
    let logs = [];
    let results = false;
    let exit = false;
    let typename;
    let choice;

    //성공 시
    if (val) {
        switch (val.type) {
            case 0:
                typename = '이해력 비례';
                break;
            case 1:
                typename = '남은 일 수 비례';
                break;
            case 2:
                typename = '정신력 비례';
                break;
            case 3:
                typename = '이해력 반비례';
                break;
        }
        logs.push(
            chalk.magentaBright(
                `================================= 선택된 필기구 =================================`,
            ),
        );
        logs.push(
            chalk.yellowBright(
                `| 등급 : ${val.rating} | 몰입도 : ${String(val.damage).padStart(3, ' ')} Page | 수면효과 : ${String(val.heal).padStart(3, ' ')} | 유형 : ${typename} | 이름 : ${val.name}`,
            ),
        );
        logs.push(
            chalk.magentaBright(
                `================================================================================`,
            ),
        );
        logs.push(
            chalk.cyanBright(
                `| 수정 가능 정보 | 이름(name) / 몰입도(damage) / 수면효과(heal) / 등급(rating) / 유형(type) |`,
            ),
        );

        // 수정, 삭제 기능 구현용
        while (!exit) {
            for await (const log of logs) {
                console.log(log);
                // 애니메이션 효과 딜레이
                await new Promise((resolve) => setTimeout(resolve, 100));
            }

            logs = [];

            // 선택이 되었을 때
            if (results) {
                return;
            } else if (choice) {
                // 값 확인용 정지
                const back = readlineSync.question('돌아가기<<');
                return;
            }

            console.log(
                chalk.yellowBright(`\n1. 무기 조정 2. 무기 삭제 3. 돌아가기`),
            );
            choice = readlineSync.question('선택해주세요! ');

            // 플레이어의 선택에 따라 다음 행동 처리
            logs.push(chalk.yellowBright(`${choice}를 선택하셨습니다.`));

            switch (choice) {
                case '1':
                    const valueName = readlineSync.question(
                        '바꿀 정보를 영어로 입력해주세요! ',
                    );
                    console.log(
                        chalk.yellowBright(`${valueName}을 선택하셨습니다.`),
                    );
                    const value = readlineSync.question('값을 입력해주세요!');
                    console.log(
                        chalk.yellowBright(`${value}를 입력 하셨습니다.`),
                    );

                    const weaponFound = await WeaponSch.findOne({
                        name: name,
                    }).exec();
                    switch (valueName) {
                        case 'name':
                            weaponFound.name = value;
                            break;
                        case 'rating':
                            weaponFound.rating = value;
                            break;
                        case 'damage':
                            weaponFound.damage = Number(value);
                            break;
                        case 'heal':
                            weaponFound.heal = Number(value);
                            break;
                        case 'type':
                            weaponFound.type = Number(value);
                            break;
                        default:
                            console.log('오류입니다');
                            break;
                    }
                    //저장
                    await weaponFound.save();
                    await update();
                    break;
                case '2':
                    await WeaponSch.deleteOne({ name: name }).then(async () => {
                        logs.push(chalk.redBright(`무기를 삭제했습니다!`));
                        //무기 업데이트
                        await update();
                    });
                    break;
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
                            `입력이 이상합니다! 다시 입력해주세요`,
                        ),
                    );
                    continue;
            }
        }
    } else {
        //찾기 실패 시
        logs.push(
            chalk.redBright('입력하신 이름을 가진 무기를 찾을 수 없습니다!'),
        );
    }
};

//무기 추가
const NewWeapon = async () => {
    let logs = [];
    let results = false;
    let exit = false;
    let newWp = [];
    let choice;

    console.clear();

    console.log(
        chalk.red(
            figlet.textSync('Forge'.padStart(40, ' '), {
                font: 'Standard',
                horizontalLayout: 'default',
                verticalLayout: 'default',
            }),
        ),
    );

    logs.push(
        chalk.magentaBright(
            `============================================ 무기 정보 ============================================`,
        ),
    );
    logs.push(
        chalk.yellowBright(
            `| 기입 필요 | 이름(String) | 공격력(Number) | 회복력(Number) | Type(Number) | 등급(Stirng) |`,
        ),
    );
    logs.push(chalk.greenBright(`| 등급 유형 | H > S > A > B > C > D > E |`));
    logs.push(
        chalk.greenBright(
            `| Type: 공격력 증가 유형 | 0 : 이해도 비례 | 1 : 남은 일 수 비례 | 2 : 정신력 비례 | 3 : 이해도 반비례 |`,
        ),
    );
    logs.push(
        chalk.magentaBright(
            `===================================================================================================`,
        ),
    );

    while (!exit) {
        for await (const log of logs) {
            console.log(log);
            // 애니메이션 효과 딜레이
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        logs = [];

        // 선택이 되었을 때, 최종 값을 출력
        if (results) {
            return;
        } else if (choice) {
            // 값 확인용 정지
            const back = readlineSync.question('돌아가기<<');
            return;
        }

        console.log(chalk.yellowBright(`\n1. 수락 2. 돌아가기`));
        choice = readlineSync.question('무기를 생성하시겠습니까? ');

        // 플레이어의 선택에 따라 다음 행동 처리
        logs.push(chalk.yellowBright(`${choice}를 선택하셨습니다.`));

        switch (choice) {
            case '1':
                console.log(
                    chalk.yellowBright(
                        `기입 사항들을 (,) 기준으로 차례대로 입력해주세요!`,
                    ),
                );
                newWp = readlineSync.question('무기 정보 기입::').split(',');

                console.log(chalk.yellowBright(`입력된 정보 ${newWp}`));
                const newWpData = new WeaponSch({
                    name: newWp[0],
                    damage: Number(newWp[1]),
                    heal: Number(newWp[2]),
                    type: Number(newWp[3]),
                    rating: newWp[4],
                });

                await newWpData
                    .save()
                    .then(async () => {
                        logs.push(chalk.greenBright('실행되었습니다!'));
                        // 올린 값 업데이트 해주기
                        await update();
                    })
                    .catch((err) => console.log(chalk.redBright('저장실패!')));
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
                continue;
        }
    }
};

// 정렬용 비교 함수
const ratingToNum = (x) => {
    switch (x.rating) {
        case 'H':
            return 7;
        case 'S':
            return 6;
        case 'A':
            return 5;
        case 'B':
            return 4;
        case 'C':
            return 3;
        case 'D':
            return 2;
        case 'E':
            return 1;
    }
};

export default admin;

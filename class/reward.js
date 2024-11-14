class Rewards {
    constructor(player, monster, stage) {
        //회복량
        this.heal =
            Math.floor(Math.random() * (player.maxHeal - player.minHeal)) +
            player.minHeal;
        //이해력 레벌업 수치
        this.levUp =
            Math.round(Math.random() * monster.value) +
            Math.round(monster.value / 2) +
            stage * 2;
        //수면효과 증가
        this.healUp =
            Math.round(Math.random() * (monster.value * 3)) +
            Math.round(monster.value) +
            stage;
        //최대 정신력 증가
        this.hpUp =
            Math.round(Math.random() * (monster.value * 10)) +
            monster.value * 3 +
            stage * 2;
        this.score = monster.value * 30 + stage * 15;
    }
}

export default Rewards;

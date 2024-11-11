class Weapon {
    constructor(name, damage, heal, plus, prob) {
        //강화된 횟수
        this.plus = plus ? plus : 0;
        //강화 성공 확률
        this.plusProb = prob ? prob : 75;
        // 이름
        this.name = name;
        //기본 데미지
        this.damage = damage;
        //회복량
        this.heal = heal;
    }

    plusWeapon(stage) {
        if (this.plus === 0) {
            return new Weapon(
                `${this.name}+${this.plus + 1}`,
                this.damage + stage * 5,
                this.heal + stage * 2,
                1,
                50,
            );
        } else {
            return new Weapon(
                `${this.name.slice(0, -1) + (this.plus + 1)}`,
                this.damage + stage * 5,
                this.heal + 5,
                this.heal + stage * 2,
                this.prob - this.plus * 5,
            );
        }
    }
}

export default Weapon;

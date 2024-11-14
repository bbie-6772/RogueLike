import mongoose from "mongoose";

const weaponSchema = new mongoose.Schema({
    // // 이름
    name: {
        type: String,
        required: true,
        uinque: true,
    },
    // //기본 데미지
    damage: {
        type: Number,
        required: true,
    },
    // //회복량
    heal: {
        type: Number,
        required: true,
    },
    //무기 스탯 영향 0: 이해력 / 1: d-day / 2: 최대 정신력 / 3: -이해력
    type: {
        type: Number,
        required: true,
    },
    // //등급
    rating: {
        type: String,
        required: true,
    }
})

export default mongoose.model("WeaponSch", weaponSchema)


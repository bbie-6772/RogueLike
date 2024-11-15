import mongoose from "mongoose"

const rank = new mongoose.Schema({
    // // 이름
    name: {
        type: String,
        required: true,
    },
    // //기본 데미지
    score: {
        type: Number,
        required: true,
    }
})

export default mongoose.model('ranking', rank);
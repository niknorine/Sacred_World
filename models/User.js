const mongoose = require("mongoose");
const { ROLE } = require("../config/role");
const role = require("../config/role");


// Create Schema
const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        email_is_verified: {
            type: Boolean,
            default: false
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: ROLE,
            required: true,
            default: ROLE.USER
        },
        referral_code: {
            type: String,
            default: function() {
                let hash = 0;
                for (let i = 0; i < this.email.length; i++) {
                    hash = this.email.charCodeAt(i) + ((hash << 5) - hash);
                }
                let res = (hash & 0x00ffffff).toString(16).toUpperCase();
                return "00000".substring(0, 6 - res.length) + res;
            }  
        },
        referred_by: {
            type: String,
            default: null
        }, 
        date_created: {
            type: Date,
            default: Date.now
        }
    }
)

const User = mongoose.model('User', UserSchema)


module.exports = User;
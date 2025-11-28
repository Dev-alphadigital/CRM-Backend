import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService,
    ) { }

    async register(name: string, email: string, password: string) {
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) throw new BadRequestException("Email already registered");

        const hashed = await bcrypt.hash(password, 10);

        const user = await this.userModel.create({
            name,
            email,
            password: hashed,
        });

        return { message: "User registered successfully", userId: user._id };
    }

    async login(email: string, password: string) {
        const user = await this.userModel.findOne({ email });

        if (!user) throw new BadRequestException("Invalid credentials");

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new BadRequestException("Invalid credentials");

        const payload = { sub: user._id, email: user.email, role: user.role };

        const token = this.jwtService.sign(payload);

        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }
}

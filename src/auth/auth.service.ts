import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService,
    ) { }

    async register(data: RegisterDto) {
        const { name, email, phoneNumber, companyName, companyUrl, password } = data;

        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) throw new BadRequestException("Email already registered");

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.userModel.create({
            name,
            email,
            phoneNumber,
            companyName,
            companyUrl,
            password: hashedPassword,
        });

        return {
            message: "User registered successfully",
            userId: user._id,
        };
    }


    async login(email: string, password: string) {
        const user = await this.userModel.findOne({ email });
        if (!user) throw new BadRequestException("Invalid credentials");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new BadRequestException("Invalid credentials");

        const payload = { sub: user._id, role: user.role };

        const token = this.jwtService.sign(payload);

        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                companyName: user.companyName,
                companyUrl: user.companyUrl,
                role: user.role,
            }
        };
    }
}
